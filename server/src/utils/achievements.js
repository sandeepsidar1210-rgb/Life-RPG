/**
 * checkAchievements(userId, client)
 *
 * Called after quest completion and item purchase.
 * Evaluates all 5 criteria types against the user's current state,
 * and inserts newly-unlocked achievements (with the ON CONFLICT DO NOTHING
 * guard preventing double-awards).
 *
 * Returns an array of newly unlocked achievement objects (may be empty).
 */

export async function checkAchievements(userId, client) {
  try {
    // 1. Fetch all achievements from catalog
    const { data: allAchievements, error: achErr } = await client
      .from('achievements')
      .select('*');

    if (achErr) {
      console.error('[Achievements] Failed to fetch catalog:', achErr.message);
      return [];
    }

    // 2. Fetch already-unlocked achievements for this user
    const { data: userAchs, error: userAchErr } = await client
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (userAchErr) {
      console.error('[Achievements] Failed to fetch user achievements:', userAchErr.message);
      return [];
    }

    const unlockedIds = new Set((userAchs || []).map((ua) => ua.achievement_id));

    // 3. Fetch current user state for evaluation
    const [
      { data: character },
      { data: streakRow },
      { data: completedQuests },
      { data: inventoryItems },
      { data: userSpirit }
    ] = await Promise.all([
      client.from('characters').select('*').eq('user_id', userId).single(),
      client.from('streaks').select('*').eq('user_id', userId).maybeSingle(),
      client
        .from('quests')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'completed'),
      client.from('inventory').select('id').eq('user_id', userId),
      client.from('user_spirits').select('current_stage').eq('user_id', userId).maybeSingle()
    ]);

    const questCount = completedQuests?.length ?? 0;
    const streakLength = streakRow?.current_streak ?? 0;
    const level = character?.level ?? 1;
    const itemCount = inventoryItems?.length ?? 0;
    const spiritStage = userSpirit?.current_stage ?? 1;

    // 4. Evaluate each achievement against current state
    const toUnlock = [];

    for (const ach of allAchievements) {
      // Skip already-unlocked
      if (unlockedIds.has(ach.id)) continue;

      let met = false;

      switch (ach.criteria_type) {
        case 'quest_count':
          met = questCount >= ach.criteria_value;
          break;

        case 'streak_length':
          met = streakLength >= ach.criteria_value;
          break;

        case 'level':
          met = level >= ach.criteria_value;
          break;

        case 'attribute_value': {
          const attrKey = ach.criteria_attribute; // e.g. 'focus', 'discipline'
          const attrValue = attrKey ? (character?.[attrKey] ?? 0) : 0;
          met = attrValue >= ach.criteria_value;
          break;
        }

        case 'item_count':
          met = itemCount >= ach.criteria_value;
          break;

        case 'spirit_stage':
          met = spiritStage >= ach.criteria_value;
          break;

        default:
          break;
      }

      if (met) {
        toUnlock.push(ach);
      }
    }

    if (toUnlock.length === 0) return [];

    // 5. Insert newly unlocked achievements (UNIQUE constraint prevents doubles)
    const insertRows = toUnlock.map((ach) => ({
      user_id: userId,
      achievement_id: ach.id,
      unlocked_at: new Date().toISOString(),
    }));

    const { data: inserted, error: insertErr } = await client
      .from('user_achievements')
      .insert(insertRows)
      .select('achievement_id');

    if (insertErr) {
      // Unique constraint violation is safe to ignore — means it was already unlocked
      if (insertErr.code === '23505') {
        console.log('[Achievements] Some achievements already unlocked (duplicate skipped).');
      } else {
        console.error('[Achievements] Insert error:', insertErr.message);
        return [];
      }
    }

    // 6. Award bonus coins for each newly unlocked achievement
    const totalBonusCoins = toUnlock.reduce((sum, a) => sum + (a.reward_coins || 0), 0);
    if (totalBonusCoins > 0 && character) {
      await client
        .from('characters')
        .update({ cozy_coins: (character.cozy_coins || 0) + totalBonusCoins })
        .eq('user_id', userId);
    }

    const insertedIds = new Set((inserted || []).map((r) => r.achievement_id));

    // Return only achievements that were actually inserted in this call
    return toUnlock.filter((ach) => {
      // If there was an insert error but it was a duplicate conflict, the
      // achievement already existed; only return ones we just inserted.
      return insertedIds.has(ach.id) || insertErr?.code !== '23505';
    });
  } catch (err) {
    // Non-fatal: achievement failures must never block the main response
    console.error('[Achievements] Unexpected error in checkAchievements:', err.message);
    return [];
  }
}
