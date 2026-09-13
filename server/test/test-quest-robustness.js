import { supabaseAdmin } from '../src/supabase.js';

async function testQuestRobustness() {
  console.log('Testing Quest Robustness & Validation...');

  const email = `robustness_${Date.now()}@gmail.com`;
  const password = 'Passw0rd!123';

  const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  if (authErr) throw authErr;

  const { data: loginData, error: loginErr } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password
  });
  if (loginErr) throw loginErr;

  const token = loginData.session.access_token;
  const baseUrl = 'http://localhost:5000';

  // 1. Create quest with emoji & special characters
  const emojiTitle = '🔬 Study & Refactor Quantum Algorithms 💻✨ (Week 3! #123)';
  const res1 = await fetch(`${baseUrl}/api/quests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: emojiTitle,
      attribute_type: 'focus',
      focus_points_reward: 35,
      cozy_coins_reward: 20
    })
  });
  const data1 = await res1.json();
  if (res1.status !== 201 || data1.quest.title !== emojiTitle) {
    throw new Error(`Failed to create emoji quest: ${JSON.stringify(data1)}`);
  }
  console.log('✓ Emoji & Unicode quest creation passed.');

  // 2. Reject title exceeding 200 characters
  const longTitle = 'A'.repeat(201);
  const res2 = await fetch(`${baseUrl}/api/quests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: longTitle,
      attribute_type: 'focus'
    })
  });
  if (res2.status !== 400) {
    throw new Error(`Expected 400 for 201-char title, got: ${res2.status}`);
  }
  console.log('✓ Title length > 200 rejected with 400.');

  // 3. Complete quest & test double-completion protection (409)
  const questId = data1.quest.id;
  const res3a = await fetch(`${baseUrl}/api/quests/${questId}/complete`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res3a.status !== 200) {
    throw new Error(`Expected 200 on first completion, got ${res3a.status}`);
  }

  const res3b = await fetch(`${baseUrl}/api/quests/${questId}/complete`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (res3b.status !== 409) {
    throw new Error(`Expected 409 on second completion, got ${res3b.status}`);
  }
  console.log('✓ Double-completion properly rejected with 409 Conflict.');

  console.log('🎉 ALL QUEST ROBUSTNESS TESTS PASSED!');
}

testQuestRobustness().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
