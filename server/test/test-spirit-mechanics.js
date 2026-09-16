import assert from 'assert';
import dotenv from 'dotenv';
import { supabase, supabaseAdmin } from '../src/supabase.js';
import { computeSpiritMood, SPIRIT_BONUS_MULTIPLIERS, fallbackSpiritState } from '../src/routes/spirit.js';

dotenv.config();

const API_BASE = 'http://127.0.0.1:5000';
const admin = supabaseAdmin || supabase;

async function runTests() {
  console.log('===============================================================');
  console.log('   STUDY SPIRIT MECHANICAL BENEFITS COMPREHENSIVE TEST SUITE   ');
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // TEST UNIT 1: Pure Unit Logic for Mood Derivation & Stage Multipliers
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: Mood Derivation & Multiplier Verification ---');

  // Verify multipliers
  assert.strictEqual(SPIRIT_BONUS_MULTIPLIERS[1], 0.10, 'Stage 1 must be +10%');
  assert.strictEqual(SPIRIT_BONUS_MULTIPLIERS[2], 0.20, 'Stage 2 must be +20%');
  assert.strictEqual(SPIRIT_BONUS_MULTIPLIERS[3], 0.35, 'Stage 3 must be +35%');
  console.log('✓ Stage multipliers verified: Stage 1 (+10%), Stage 2 (+20%), Stage 3 (+35%)');

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10);
  const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10);

  // Completed today -> Radiant
  const radiantMood = computeSpiritMood(today, false, 1);
  assert.strictEqual(radiantMood.mood, 'Radiant', 'Completed today must be Radiant');
  console.log('✓ Completed today -> Radiant mood verified');

  // Completed yesterday -> Content
  const contentMood = computeSpiritMood(yesterday, false, 1);
  assert.strictEqual(contentMood.mood, 'Content', 'Completed yesterday must be Content');
  console.log('✓ Completed yesterday -> Content mood verified');

  // 1 day since deadline, grace available -> Drowsy
  const drowsyMood = computeSpiritMood(twoDaysAgo, true, 2);
  assert.strictEqual(drowsyMood.mood, 'Drowsy', '1 missed day with grace available must be Drowsy');
  console.log('✓ 1 missed day with grace available (Stage 2+) -> Drowsy mood verified');

  // 1 day since deadline, no grace left -> Fading
  const fadingMoodNoGrace = computeSpiritMood(twoDaysAgo, false, 2);
  assert.strictEqual(fadingMoodNoGrace.mood, 'Fading', '1 missed day without grace must be Fading');

  // 1 day since deadline, stage 1 (no grace) -> Fading
  const fadingMoodStage1 = computeSpiritMood(twoDaysAgo, true, 1);
  assert.strictEqual(fadingMoodStage1.mood, 'Fading', '1 missed day on Stage 1 must be Fading');

  // 2+ missed days -> Fading regardless of grace
  const fadingMoodMultiDay = computeSpiritMood(threeDaysAgo, true, 3);
  assert.strictEqual(fadingMoodMultiDay.mood, 'Fading', '2+ missed days must always be Fading');
  console.log('✓ Broken streak or exhausted grace -> Fading mood verified\n');

  // --------------------------------------------------------------------------
  // TEST UNIT 2: Integration Tests against API endpoints
  // --------------------------------------------------------------------------
  console.log('--- TEST 2: Integration Tests (Auth, Spirit, Quests, Shop) ---');

  const timestamp = Date.now();
  const testEmail = `spirit_scholar_${timestamp}@gmail.com`;
  const testPassword = 'TestPassword123!';

  // Create test scholar
  let userId;
  const { data: createdUserData, error: createError } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true
  });

  if (createError) {
    throw new Error(`Failed to create test user: ${createError.message}`);
  }
  userId = createdUserData.user.id;

  // Initialize character row
  await admin.from('characters').insert({
    user_id: userId,
    name: 'Scholar Tester',
    level: 1,
    current_xp: 0,
    xp_to_next_level: 100,
    cozy_coins: 200,
    focus: 10,
    discipline: 1,
    vitality: 1,
    creativity: 1
  });

  // Sign in to obtain auth JWT
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });
  if (signInError) throw signInError;
  const token = signInData.session.access_token;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  console.log(`✓ Test scholar created (${testEmail}) and authenticated.`);

  // Check GET /api/spirit
  const spiritRes = await fetch(`${API_BASE}/api/spirit`, { headers });
  assert.strictEqual(spiritRes.status, 200, 'GET /api/spirit must return 200');
  const spiritData = await spiritRes.json();
  console.log('✓ GET /api/spirit successful: Active Species =', spiritData.species.name, ', Dominant =', spiritData.dominant_attribute);
  assert(spiritData.mood, 'Spirit response must include mood');
  assert(spiritData.bonus_tier, 'Spirit response must include bonus_tier');
  assert.strictEqual(spiritData.current_stage.stage_number, 1, 'Initial stage should be 1');
  assert.strictEqual(spiritData.grace_available, false, 'Stage 1 grace_available must be false');
  console.log('✓ Initial Stage 1 spirit: Mood =', spiritData.mood, ', Grace Available =', spiritData.grace_available);

  // --------------------------------------------------------------------------
  // TEST 2A: Passive Attribute Bonus (Matching vs Non-Matching)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2A: Passive Attribute Bonus (+10% on Stage 1 matching) ---');
  const activeAttr = spiritData.species.attribute_type; // 'focus'
  const nonMatchingAttr = activeAttr === 'focus' ? 'vitality' : 'focus';

  // 1. Matching Quest (100 FP base) -> Expect 100 + 10 = 110 FP
  const { data: matchingQuest } = await admin
    .from('quests')
    .insert({
      user_id: userId,
      title: 'Deep Focus Reading',
      attribute_type: activeAttr,
      focus_points_reward: 100,
      cozy_coins_reward: 15,
      status: 'active'
    })
    .select()
    .single();

  const completeMatchingRes = await fetch(`${API_BASE}/api/quests/${matchingQuest.id}/complete`, {
    method: 'POST',
    headers
  });
  assert.strictEqual(completeMatchingRes.status, 200, 'Quest completion must return 200');
  const matchingResult = await completeMatchingRes.json();

  assert.strictEqual(matchingResult.spiritBonus.applied, true, 'Spirit bonus must be applied for matching attribute');
  assert.strictEqual(matchingResult.spiritBonus.percentage, 10, 'Stage 1 spirit bonus percentage must be 10%');
  assert.strictEqual(matchingResult.spiritBonus.bonus_xp, 10, 'Stage 1 spirit bonus on 100 FP must be 10 FP');
  assert.strictEqual(matchingResult.rewards.focus_points, 110, 'Total rewarded FP must be 110');
  assert.strictEqual(matchingResult.rewards.base_focus_points, 100, 'Base FP must be 100');
  console.log('✓ Matching quest received +10% bonus:', matchingResult.rewards.base_focus_points, '+', matchingResult.spiritBonus.bonus_xp, '=', matchingResult.rewards.focus_points, 'FP');

  // 2. Non-Matching Quest (100 FP base) -> Expect 100 + 0 = 100 FP
  const { data: nonMatchingQuest } = await admin
    .from('quests')
    .insert({
      user_id: userId,
      title: 'Physical Stretch',
      attribute_type: nonMatchingAttr,
      focus_points_reward: 100,
      cozy_coins_reward: 15,
      status: 'active'
    })
    .select()
    .single();

  const completeNonMatchingRes = await fetch(`${API_BASE}/api/quests/${nonMatchingQuest.id}/complete`, {
    method: 'POST',
    headers
  });
  assert.strictEqual(completeNonMatchingRes.status, 200);
  const nonMatchingResult = await completeNonMatchingRes.json();

  assert.strictEqual(nonMatchingResult.spiritBonus.applied, false, 'Spirit bonus must NOT be applied for non-matching attribute');
  assert.strictEqual(nonMatchingResult.spiritBonus.bonus_xp, 0, 'Bonus XP must be 0 for non-matching quest');
  assert.strictEqual(nonMatchingResult.rewards.focus_points, 100, 'Total rewarded FP must equal base FP for non-matching quest');
  console.log('✓ Non-matching quest received 0 bonus XP: exactly', nonMatchingResult.rewards.focus_points, 'FP');

  // --------------------------------------------------------------------------
  // TEST 2B: Streak Guardian (Grace Day) at Stage 2+
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2B: Streak Guardian (Grace Day) at Stage 2+ ---');

  // Elevate character to Level 6 (Stage 2)
  await admin.from('characters').update({ level: 6 }).eq('user_id', userId);
  try {
    await admin.from('user_spirits').update({ current_stage: 2, grace_available: true }).eq('user_id', userId);
  } catch (_e) {}
  const fb = fallbackSpiritState.get(userId);
  if (fb) fb.grace_available = true;

  // Set up an established streak of 5 days, completed 2 days ago (yesterday was missed!)
  await admin.from('streaks').upsert({
    user_id: userId,
    current_streak: 5,
    longest_streak: 5,
    last_completed_date: twoDaysAgo
  });

  // Verify mood is Drowsy before completing
  const spiritDrowsyCheck = await (await fetch(`${API_BASE}/api/spirit`, { headers })).json();
  assert.strictEqual(spiritDrowsyCheck.mood, 'Drowsy', '1 missed day with grace available on Stage 2 must report Drowsy mood');
  assert.strictEqual(spiritDrowsyCheck.grace_available, true, 'Grace must be available before grace day use');
  console.log('✓ Pre-completion state verified: Mood =', spiritDrowsyCheck.mood, ', Grace Available =', spiritDrowsyCheck.grace_available);

  // Complete a quest on this day after 1 missed day (diffDays = 2)
  const { data: graceQuest } = await admin
    .from('quests')
    .insert({
      user_id: userId,
      title: 'Grace Protected Session',
      attribute_type: activeAttr,
      focus_points_reward: 50,
      cozy_coins_reward: 10,
      status: 'active'
    })
    .select()
    .single();

  const graceCompleteRes = await fetch(`${API_BASE}/api/quests/${graceQuest.id}/complete`, {
    method: 'POST',
    headers
  });
  const graceResult = await graceCompleteRes.json();

  assert.strictEqual(graceResult.streakProtectedByGrace, true, 'Streak MUST be protected by grace on 1 missed day');
  assert.strictEqual(graceResult.streak.current_streak, 5, 'Streak must be preserved at 5, NOT reset to 1');
  assert.strictEqual(graceResult.graceAvailable, false, 'grace_available must now be false after being used');
  console.log('✓ Streak Guardian saved the streak! Preserved current_streak =', graceResult.streak.current_streak, ', graceAvailable =', graceResult.graceAvailable);

  // Verify spirit status reflects grace used
  const spiritAfterGrace = await (await fetch(`${API_BASE}/api/spirit`, { headers })).json();
  assert.strictEqual(spiritAfterGrace.grace_available, false, 'GET /api/spirit must reflect grace_available = false');
  console.log('✓ GET /api/spirit confirms grace consumed (grace_available = false)');

  // Now simulate skipping another day immediately (last completed set to 2 days ago again, but grace is now false!)
  await admin.from('streaks').update({
    current_streak: 5,
    last_completed_date: twoDaysAgo
  }).eq('user_id', userId);

  // Verify mood is now Fading (since grace is false)
  const spiritFadingCheck = await (await fetch(`${API_BASE}/api/spirit`, { headers })).json();
  assert.strictEqual(spiritFadingCheck.mood, 'Fading', '1 missed day with grace unavailable must report Fading mood');
  console.log('✓ Post-grace missed day mood correctly derived as Fading (grace is exhausted)');

  // Complete quest again after missing a day with NO grace left -> Streak MUST break!
  const { data: breakQuest } = await admin
    .from('quests')
    .insert({
      user_id: userId,
      title: 'Broken Streak Session',
      attribute_type: activeAttr,
      focus_points_reward: 50,
      cozy_coins_reward: 10,
      status: 'active'
    })
    .select()
    .single();

  const breakCompleteRes = await fetch(`${API_BASE}/api/quests/${breakQuest.id}/complete`, {
    method: 'POST',
    headers
  });
  const breakResult = await breakCompleteRes.json();

  assert.strictEqual(breakResult.streakProtectedByGrace, false, 'Grace cannot protect streak when grace_available is false');
  assert.strictEqual(breakResult.streak.current_streak, 1, 'Streak must break and reset to 1');
  assert.strictEqual(breakResult.graceAvailable, true, 'grace_available must recharge back to true after streak reset to 1');
  console.log('✓ Streak broke as expected (reset to 1) and grace recharged back to true for next streak run!');

  // --------------------------------------------------------------------------
  // TEST 2C: 2+ Missed Days always breaks streak regardless of grace
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2C: 2+ Missed Days always breaks streak ---');
  await admin.from('streaks').update({
    current_streak: 7,
    last_completed_date: threeDaysAgo // 3 days ago = 2 missed days
  }).eq('user_id', userId);

  const { data: multiDayQuest } = await admin
    .from('quests')
    .insert({
      user_id: userId,
      title: 'Long Gap Quest',
      attribute_type: activeAttr,
      focus_points_reward: 50,
      cozy_coins_reward: 10,
      status: 'active'
    })
    .select()
    .single();

  const multiDayRes = await (await fetch(`${API_BASE}/api/quests/${multiDayQuest.id}/complete`, {
    method: 'POST',
    headers
  })).json();

  assert.strictEqual(multiDayRes.streakProtectedByGrace, false, 'Grace cannot protect 2+ missed days');
  assert.strictEqual(multiDayRes.streak.current_streak, 1, '2+ missed days must reset streak to 1');
  console.log('✓ Gap of 2+ missed days correctly broke the streak to 1 regardless of grace availability.');

  // --------------------------------------------------------------------------
  // TEST 2D: Shop Discount (Stage 3 10% Discount)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2D: Shop Discount (10% Discount on Stage 3) ---');

  // Fetch catalog item
  const { data: items } = await admin.from('items').select('*').limit(1);
  const testItem = items[0];
  const originalCost = testItem.cost; // e.g. 35
  const expectedDiscountedCost = Math.max(1, Math.round(originalCost * 0.90));

  // 1. As Stage 2 user: pays FULL price
  await admin.from('characters').update({ level: 6, cozy_coins: 500 }).eq('user_id', userId);
  const purchaseStage2Res = await fetch(`${API_BASE}/api/items/${testItem.id}/purchase`, {
    method: 'POST',
    headers
  });
  const stage2Purchase = await purchaseStage2Res.json();
  assert.strictEqual(stage2Purchase.discount_applied, false, 'Stage 2 user should not get discount');
  assert.strictEqual(stage2Purchase.final_cost, originalCost, 'Stage 2 user must pay original cost');
  assert.strictEqual(stage2Purchase.character.cozy_coins, 500 - originalCost, 'Full cost must be deducted');
  console.log(`✓ Stage 2 purchase: Paid full price of ${stage2Purchase.final_cost} coins (Balance: 500 -> ${stage2Purchase.character.cozy_coins})`);

  // 2. Elevate to Stage 3 (Level 12): pays 10% DISCOUNTED price
  await admin.from('characters').update({ level: 12, cozy_coins: 500 }).eq('user_id', userId);
  try {
    await admin.from('user_spirits').update({ current_stage: 3 }).eq('user_id', userId);
  } catch (_e) {}

  // Also verify Stage 3 passive bonus is +35%
  const spiritStage3Data = await (await fetch(`${API_BASE}/api/spirit`, { headers })).json();
  assert.strictEqual(spiritStage3Data.bonus_tier.percentage, 35, 'Stage 3 must have +35% bonus');
  assert.strictEqual(spiritStage3Data.bonus_tier.shop_discount_active, true, 'Stage 3 must have shop discount active');
  console.log('✓ Stage 3 Spirit verified: Bonus = +35%, Shop Discount Active = true');

  // Purchase another item (or same item) as Stage 3 user
  const purchaseStage3Res = await fetch(`${API_BASE}/api/items/${testItem.id}/purchase`, {
    method: 'POST',
    headers
  });
  const stage3Purchase = await purchaseStage3Res.json();
  assert.strictEqual(stage3Purchase.discount_applied, true, 'Stage 3 user MUST receive 10% discount');
  assert.strictEqual(stage3Purchase.original_cost, originalCost, 'Original cost must be reported');
  assert.strictEqual(stage3Purchase.final_cost, expectedDiscountedCost, `Final cost must be ${expectedDiscountedCost}`);
  assert.strictEqual(stage3Purchase.character.cozy_coins, 500 - expectedDiscountedCost, 'Discounted cost must be deducted from balance');
  console.log(`✓ Stage 3 purchase: Received 10% discount! Original: ${originalCost} coins -> Paid: ${expectedDiscountedCost} coins (Balance: 500 -> ${stage3Purchase.character.cozy_coins})`);

  console.log('\n===============================================================');
  console.log('   ALL STUDY SPIRIT MECHANICAL BENEFITS VERIFIED SUCCESSFULLY  ');
  console.log('===============================================================');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed with error:', err);
  process.exit(1);
});
