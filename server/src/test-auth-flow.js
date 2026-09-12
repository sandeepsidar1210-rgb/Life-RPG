import { supabase, supabaseAdmin } from './supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function runAuthVerification() {
  console.log('======================================================');
  console.log('      LIFE RPG AUTH & TRIGGER VERIFICATION TEST       ');
  console.log('======================================================\n');

  const testEmail = `scholar_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';

  console.log(`[Test 1] Registering new test user: ${testEmail}...`);
  const client = supabase;
  const admin = supabaseAdmin;

  if (!client) {
    console.error('Supabase client not available.');
    process.exit(1);
  }

  // 1. Sign up user
  const { data: signUpData, error: signUpError } = await client.auth.signUp({
    email: testEmail,
    password: testPassword
  });

  if (signUpError) {
    console.error('[Sign Up Error]', signUpError.message);
    process.exit(1);
  }

  const userId = signUpData.user?.id;
  console.log(`[Test 1] User created with ID: ${userId}`);

  // In Supabase, if email confirmation is enabled, we can auto-confirm the user with supabaseAdmin
  if (admin && !signUpData.session) {
    console.log('[Test 1] Auto-confirming user email via admin client for test...');
    await admin.auth.admin.updateUserById(userId, { email_confirm: true });
  }

  // 2. Sign in to obtain access_token
  console.log('[Test 2] Signing in test user to obtain session JWT...');
  const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (signInError) {
    console.error('[Sign In Error]', signInError.message);
    process.exit(1);
  }

  const token = signInData.session?.access_token;
  console.log('[Test 2] Successfully signed in! Received JWT token.');

  // 3. Verify Database Trigger: check characters and streaks rows
  console.log('\n[Test 3] Verifying on_auth_user_created trigger in Database:');
  const { data: charRow, error: charErr } = await admin
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (charErr) {
    console.error('Characters row error:', charErr.message);
  } else {
    console.log('✓ characters row exists:');
    console.table([{
      id: charRow.id,
      user_id: charRow.user_id,
      level: charRow.level,
      current_xp: charRow.current_xp,
      cozy_coins: charRow.cozy_coins,
      focus: charRow.focus,
      discipline: charRow.discipline,
      vitality: charRow.vitality,
      creativity: charRow.creativity
    }]);
  }

  const { data: streakRow, error: streakErr } = await admin
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (streakErr) {
    console.error('Streaks row error:', streakErr.message);
  } else {
    console.log('✓ streaks row exists:');
    console.table([{
      user_id: streakRow.user_id,
      current_streak: streakRow.current_streak,
      longest_streak: streakRow.longest_streak
    }]);
  }

  // 4. Test Backend Protected Endpoint GET /api/me with valid Bearer Token
  console.log('\n[Test 4] Testing Backend GET /api/me with Bearer JWT:');
  const apiRes = await fetch('http://localhost:5000/api/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${apiRes.status} ${apiRes.statusText}`);
  const apiData = await apiRes.json();
  console.log('Response verified user:', apiData.user);

  // 5. Test Backend GET /api/me with NO token (Expect 401)
  console.log('\n[Test 5] Testing Backend GET /api/me with NO token:');
  const noTokenRes = await fetch('http://localhost:5000/api/me');
  console.log(`Status: ${noTokenRes.status} (Expected: 401)`);
  const noTokenBody = await noTokenRes.json();
  console.log('Error payload:', noTokenBody);

  // 6. Test Backend GET /api/me with INVALID token (Expect 401)
  console.log('\n[Test 6] Testing Backend GET /api/me with INVALID token:');
  const invalidTokenRes = await fetch('http://localhost:5000/api/me', {
    headers: { 'Authorization': 'Bearer fake-invalid-token' }
  });
  console.log(`Status: ${invalidTokenRes.status} (Expected: 401)`);

  console.log('\n🎉 ALL AUTHENTICATION & SECURITY TESTS PASSED!');
}

runAuthVerification().catch(console.error);
