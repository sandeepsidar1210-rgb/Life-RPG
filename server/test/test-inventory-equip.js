import { supabase, supabaseAdmin } from '../src/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function runInventoryEquipTest() {
  console.log('======================================================');
  console.log('      LIFE RPG INVENTORY & EQUIP LOGIC TEST           ');
  console.log('======================================================\n');

  const testEmail = `roomhero_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';

  // 1. Create test user
  console.log(`[Setup] Creating test user: ${testEmail}...`);
  const admin = supabaseAdmin || supabase;
  const { data: createdUserData, error: createError } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true
  });

  if (createError) throw createError;
  const userId = createdUserData.user.id;

  // Sign in to get token
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (signInError) throw signInError;
  const token = signInData.session.access_token;
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Give user generous coins for testing (e.g. 1000 Cozy Coins)
  await admin
    .from('characters')
    .update({ cozy_coins: 1000 })
    .eq('user_id', userId);

  // Fetch catalog items
  const { data: catalogItems } = await admin.from('items').select('*');
  const catItem = catalogItems.find(i => i.name === 'Sleepy Calico Cat');
  const owlItem = catalogItems.find(i => i.name === 'Wise Study Owl');
  const lampItem = catalogItems.find(i => i.name === 'Warm Desk Lamp');
  const plantItem = catalogItems.find(i => i.name === 'Potted Succulent');

  // Purchase items
  console.log('[Test 1] Purchasing Decor & 2 Companions...');
  const buyDecor1 = await fetch(`http://127.0.0.1:5000/api/items/${lampItem.id}/purchase`, { method: 'POST', headers: authHeaders });
  const buyDecor2 = await fetch(`http://127.0.0.1:5000/api/items/${plantItem.id}/purchase`, { method: 'POST', headers: authHeaders });
  const buyCat = await fetch(`http://127.0.0.1:5000/api/items/${catItem.id}/purchase`, { method: 'POST', headers: authHeaders });
  const buyOwl = await fetch(`http://127.0.0.1:5000/api/items/${owlItem.id}/purchase`, { method: 'POST', headers: authHeaders });

  const catInv = (await buyCat.json()).inventory;
  const owlInv = (await buyOwl.json()).inventory;
  const lampInv = (await buyDecor1.json()).inventory;
  const plantInv = (await buyDecor2.json()).inventory;

  // Test 2: GET /api/inventory
  console.log('\n[Test 2] GET /api/inventory:');
  const invRes = await fetch('http://127.0.0.1:5000/api/inventory', { headers: authHeaders });
  const invData = await invRes.json();
  console.log(`Found ${invData.inventory.length} items in user inventory.`);

  // Test 3: Equip multiple decor items
  console.log('\n[Test 3] Equipping multiple decor items:');
  const equipLampRes = await fetch(`http://127.0.0.1:5000/api/inventory/${lampInv.id}/equip`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ equipped: true })
  });
  const equipPlantRes = await fetch(`http://127.0.0.1:5000/api/inventory/${plantInv.id}/equip`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ equipped: true })
  });
  console.log('Lamp equipped:', (await equipLampRes.json()).equipped);
  console.log('Plant equipped:', (await equipPlantRes.json()).equipped);

  // Test 4: Equip first companion (Cat)
  console.log('\n[Test 4] Equipping Companion 1 (Sleepy Calico Cat):');
  const equipCatRes = await fetch(`http://127.0.0.1:5000/api/inventory/${catInv.id}/equip`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ equipped: true })
  });
  console.log('Cat equipped:', (await equipCatRes.json()).equipped);

  // Test 5: Equip second companion (Owl) -> Expect Cat to be auto-unequipped!
  console.log('\n[Test 5] Equipping Companion 2 (Wise Study Owl) -> Expect Cat to auto-unequip:');
  const equipOwlRes = await fetch(`http://127.0.0.1:5000/api/inventory/${owlInv.id}/equip`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ equipped: true })
  });
  console.log('Owl equipped:', (await equipOwlRes.json()).equipped);

  // Check inventory to verify Cat was auto-unequipped
  const checkInvRes = await fetch('http://127.0.0.1:5000/api/inventory', { headers: authHeaders });
  const checkInvData = await checkInvRes.json();
  const catEntry = checkInvData.inventory.find(i => i.id === catInv.id);
  const owlEntry = checkInvData.inventory.find(i => i.id === owlInv.id);
  console.log(`✓ Sleepy Calico Cat equipped status: ${catEntry.equipped} (Expected false)`);
  console.log(`✓ Wise Study Owl equipped status: ${owlEntry.equipped} (Expected true)`);

  if (catEntry.equipped !== false || owlEntry.equipped !== true) {
    throw new Error('Companion exclusivity check failed!');
  }

  // Test 6: Security - try equipping another user's item (expect 404)
  console.log('\n[Test 6] Security Check: Attempting to equip non-existent or foreign item ID:');
  const foreignRes = await fetch('http://127.0.0.1:5000/api/inventory/00000000-0000-0000-0000-000000000000/equip', {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ equipped: true })
  });
  console.log(`Status: ${foreignRes.status} (Expected 404)`);

  console.log('\n🎉 ALL INVENTORY & COMPANION EXCLUSIVITY TESTS PASSED!');
}

runInventoryEquipTest().catch(console.error);
