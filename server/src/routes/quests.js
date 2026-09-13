import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin, supabase } from '../supabase.js';
import { checkAchievements } from '../utils/achievements.js';
import { determineHighestAttribute, FALLBACK_SPECIES, FALLBACK_STAGES } from './spirit.js';

const router = express.Router();

const VALID_ATTRIBUTES = ['focus', 'discipline', 'vitality', 'creativity'];

// Helper to get Supabase client
const getClient = () => supabaseAdmin || supabase;

/**
 * 1. POST /api/quests
 * Create a quest for the logged-in user
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    let { title, description, attribute_type, focus_points_reward, cozy_coins_reward } = req.body;

    // Validation: Reject empty, whitespace-only, or excessively long titles
    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Quest title is required and must be at least 2 characters.'
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Quest title cannot exceed 200 characters.'
      });
    }

    title = title.trim();

    // Default or validate attribute_type
    const normalizedAttr = (attribute_type || 'focus').toLowerCase();
    if (!VALID_ATTRIBUTES.includes(normalizedAttr)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Invalid attribute_type. Allowed: ${VALID_ATTRIBUTES.join(', ')}`
      });
    }

    // Default rewards
    const fpReward = Number.isInteger(Number(focus_points_reward)) && Number(focus_points_reward) > 0 
      ? Number(focus_points_reward) 
      : 25;
    const coinsReward = Number.isInteger(Number(cozy_coins_reward)) && Number(cozy_coins_reward) >= 0 
      ? Number(cozy_coins_reward) 
      : 10;

    const { data: quest, error } = await getClient()
      .from('quests')
      .insert({
        user_id: userId,
        title,
        description: description ? description.trim() : null,
        attribute_type: normalizedAttr,
        focus_points_reward: fpReward,
        cozy_coins_reward: coinsReward,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: 'Quest created successfully',
      quest
    });
  } catch (err) {
    console.error('[Create Quest Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * 2. GET /api/quests
 * List all quests belonging to logged-in user
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: quests, error } = await getClient()
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      quests: quests || []
    });
  } catch (err) {
    console.error('[Get Quests Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * 3. PATCH /api/quests/:id
 * Edit an active quest belonging to req.user.id
 */
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const questId = req.params.id;
    const { title, description, attribute_type, focus_points_reward, cozy_coins_reward } = req.body;

    // Fetch existing quest to verify ownership and active status
    const { data: existingQuest, error: fetchErr } = await getClient()
      .from('quests')
      .select('*')
      .eq('id', questId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    if (!existingQuest) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Quest not found or does not belong to you.'
      });
    }

    if (existingQuest.status !== 'active') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Completed quests cannot be modified.'
      });
    }

    const updates = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 2) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Quest title must be at least 2 characters.'
        });
      }
      if (title.trim().length > 200) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Quest title cannot exceed 200 characters.'
        });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : null;
    }

    if (attribute_type !== undefined) {
      const normalizedAttr = attribute_type.toLowerCase();
      if (!VALID_ATTRIBUTES.includes(normalizedAttr)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid attribute_type. Allowed: ${VALID_ATTRIBUTES.join(', ')}`
        });
      }
      updates.attribute_type = normalizedAttr;
    }

    if (focus_points_reward !== undefined) {
      const fp = Number(focus_points_reward);
      if (!Number.isInteger(fp) || fp < 1) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'focus_points_reward must be a positive integer.'
        });
      }
      updates.focus_points_reward = fp;
    }

    if (cozy_coins_reward !== undefined) {
      const coins = Number(cozy_coins_reward);
      if (!Number.isInteger(coins) || coins < 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'cozy_coins_reward must be a non-negative integer.'
        });
      }
      updates.cozy_coins_reward = coins;
    }

    const { data: updatedQuest, error: updateErr } = await getClient()
      .from('quests')
      .update(updates)
      .eq('id', questId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return res.status(200).json({
      message: 'Quest updated successfully',
      quest: updatedQuest
    });
  } catch (err) {
    console.error('[Patch Quest Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * 4. DELETE /api/quests/:id
 * Delete a quest belonging to req.user.id
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const questId = req.params.id;

    // Check existence & ownership
    const { data: existingQuest, error: fetchErr } = await getClient()
      .from('quests')
      .select('id')
      .eq('id', questId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    if (!existingQuest) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Quest not found or does not belong to you.'
      });
    }

    const { error: deleteErr } = await getClient()
      .from('quests')
      .delete()
      .eq('id', questId)
      .eq('user_id', userId);

    if (deleteErr) throw deleteErr;

    return res.status(200).json({
      message: 'Quest deleted successfully',
      questId
    });
  } catch (err) {
    console.error('[Delete Quest Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

/**
 * 5. POST /api/quests/:id/complete
 * Core RPG Progression Engine:
 * - Verify quest is active & belongs to req.user.id (409 if already completed)
 * - Award FP (XP) and Cozy Coins
 * - Increment specific attribute by 1
 * - Non-linear leveling formula: while current_xp >= xp_to_next_level:
 *     current_xp -= xp_to_next_level
 *     level += 1
 *     xp_to_next_level = Math.round(100 * Math.pow(level, 1.5))
 * - Timezone-safe streak update
 * - Mark quest completed
 */
router.post('/:id/complete', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const questId = req.params.id;
    const client = getClient();

    // a. Verify quest belongs to user
    const { data: quest, error: questErr } = await client
      .from('quests')
      .select('*')
      .eq('id', questId)
      .eq('user_id', userId)
      .maybeSingle();

    if (questErr) throw questErr;

    if (!quest) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Quest not found or does not belong to you.'
      });
    }

    // Return 409 Conflict if already completed to prevent double-awarding
    if (quest.status === 'completed') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'This quest has already been completed.'
      });
    }

    // Fetch user character
    let { data: character, error: charErr } = await client
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (charErr || !character) {
      return res.status(500).json({
        error: 'Character Not Found',
        message: 'Character profile missing for user.'
      });
    }

    // b. Add focus_points_reward to current_xp and cozy_coins_reward to cozy_coins
    let currentXp = (character.current_xp || 0) + quest.focus_points_reward;
    let cozyCoins = (character.cozy_coins || 0) + quest.cozy_coins_reward;
    let level = character.level || 1;
    let xpToNextLevel = character.xp_to_next_level || Math.round(100 * Math.pow(level, 1.5));
    let levelsGained = 0;

    // c. Increment specific attribute by 1
    const attrType = quest.attribute_type || 'focus';
    const updatedAttributes = {
      focus: character.focus || 1,
      discipline: character.discipline || 1,
      vitality: character.vitality || 1,
      creativity: character.creativity || 1
    };

    if (updatedAttributes[attrType] !== undefined) {
      updatedAttributes[attrType] += 1;
    }

    // d. Non-linear level-up check: support multi-level-ups
    while (currentXp >= xpToNextLevel) {
      currentXp -= xpToNextLevel;
      level += 1;
      levelsGained += 1;
      xpToNextLevel = Math.round(100 * Math.pow(level, 1.5));
    }

    const leveledUp = levelsGained > 0;

    // e. Streak update: UTC timezone-safe
    const todayUTC = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let { data: streak, error: streakErr } = await client
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!streak) {
      streak = { current_streak: 0, longest_streak: 0, last_completed_date: null };
    }

    let currentStreak = streak.current_streak || 0;
    let longestStreak = streak.longest_streak || 0;
    let streakIncreased = false;

    if (streak.last_completed_date) {
      const lastDate = new Date(streak.last_completed_date + 'T00:00:00Z');
      const nowDate = new Date(todayUTC + 'T00:00:00Z');
      const diffMs = nowDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already completed a quest today; maintain current streak
        streakIncreased = false;
      } else if (diffDays === 1) {
        // Consecutive day
        currentStreak += 1;
        streakIncreased = true;
      } else {
        // More than 1 day gap: reset streak to 1
        currentStreak = 1;
        streakIncreased = true;
      }
    } else {
      // First completed quest ever
      currentStreak = 1;
      streakIncreased = true;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    // Update database records
    // 1. Update Character
    const { data: updatedCharacter, error: updateCharErr } = await client
      .from('characters')
      .update({
        level,
        current_xp: currentXp,
        xp_to_next_level: xpToNextLevel,
        cozy_coins: cozyCoins,
        focus: updatedAttributes.focus,
        discipline: updatedAttributes.discipline,
        vitality: updatedAttributes.vitality,
        creativity: updatedAttributes.creativity
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateCharErr) throw updateCharErr;

    // 2. Update Streak
    const { data: updatedStreak, error: updateStreakErr } = await client
      .from('streaks')
      .upsert({
        user_id: userId,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_completed_date: todayUTC
      })
      .select()
      .single();

    if (updateStreakErr) throw updateStreakErr;

    // 3. Mark Quest as Completed
    const completedAt = new Date().toISOString();
    const { data: updatedQuest, error: updateQuestErr } = await client
      .from('quests')
      .update({
        status: 'completed',
        completed_at: completedAt
      })
      .eq('id', questId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateQuestErr) throw updateQuestErr;

    // f. Check for newly unlocked rooms upon leveling up
    let newlyUnlockedRooms = [];
    if (leveledUp) {
      try {
        const { data: unlockedRoomsData } = await client
          .from('rooms')
          .select('*')
          .gt('unlock_level', character.level || 1)
          .lte('unlock_level', level)
          .order('unlock_level', { ascending: true });
        newlyUnlockedRooms = unlockedRoomsData || [];
      } catch (rErr) {
        console.warn('[Room Unlock Check Warn]', rErr.message);
      }
    }

    // g. Check for study spirit evolution upon leveling up (Stage 2 @ Lv 5, Stage 3 @ Lv 12)
    let spiritEvolution = null;
    if (leveledUp) {
      try {
        const { data: userSpirit } = await client
          .from('user_spirits')
          .select('*, species:spirit_species(*)')
          .eq('user_id', userId)
          .maybeSingle();

        if (userSpirit && userSpirit.current_stage < 3) {
          const currentStage = userSpirit.current_stage;
          let targetStage = currentStage;

          if (level >= 12 && currentStage < 3) {
            targetStage = 3;
          } else if (level >= 5 && currentStage < 2) {
            targetStage = 2;
          }

          if (targetStage > currentStage) {
            const { data: updatedSpirit, error: spiritUpdateErr } = await client
              .from('user_spirits')
              .update({ current_stage: targetStage })
              .eq('id', userSpirit.id)
              .select('*, species:spirit_species(*)')
              .single();

            if (!spiritUpdateErr && updatedSpirit) {
              const { data: stageInfo } = await client
                .from('spirit_stages')
                .select('*')
                .eq('species_id', updatedSpirit.species_id)
                .eq('stage_number', targetStage)
                .maybeSingle();

              const { data: prevStageInfo } = await client
                .from('spirit_stages')
                .select('*')
                .eq('species_id', updatedSpirit.species_id)
                .eq('stage_number', currentStage)
                .maybeSingle();

              spiritEvolution = {
                evolved: true,
                previousStage: currentStage,
                newStage: targetStage,
                species: updatedSpirit.species,
                stageData: stageInfo,
                previousStageData: prevStageInfo
              };
            }
          }
        }
      } catch (sErr) {
        console.warn('[Spirit Evolution Check Warn]', sErr.message);
      }

      // Resilient fallback if DB query returned null or failed
      if (!spiritEvolution) {
        const prevLevel = level - (levelsGained || 1);
        const crossed5 = prevLevel < 5 && level >= 5;
        const crossed12 = prevLevel < 12 && level >= 12;
        if (crossed5 || crossed12) {
          const targetStage = level >= 12 ? 3 : 2;
          const prevStage = targetStage === 3 ? (prevLevel >= 5 ? 2 : 1) : 1;
          const dominantAttr = determineHighestAttribute(updatedCharacter);
          const spec = FALLBACK_SPECIES[dominantAttr];
          const stgs = FALLBACK_STAGES[dominantAttr];
          spiritEvolution = {
            evolved: true,
            previousStage: prevStage,
            newStage: targetStage,
            species: spec,
            stageData: stgs.find(s => s.stage_number === targetStage),
            previousStageData: stgs.find(s => s.stage_number === prevStage)
          };
        }
      }
    }

    // h. Check & award achievements (non-blocking — failures never crash the response)
    const newAchievements = await checkAchievements(userId, client);

    // i. Return full updated data and celebration indicators
    return res.status(200).json({
      message: 'Quest completed successfully!',
      quest: updatedQuest,
      character: updatedCharacter,
      streak: updatedStreak,
      leveledUp,
      levelsGained,
      streakIncreased,
      rewards: {
        focus_points: quest.focus_points_reward,
        cozy_coins: quest.cozy_coins_reward,
        attribute: quest.attribute_type,
        attribute_increase: 1
      },
      newAchievements,
      newlyUnlockedRooms,
      spiritEvolution
    });

  } catch (err) {
    console.error('[Complete Quest Error]', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

export default router;
