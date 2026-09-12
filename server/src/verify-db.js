import pg from 'pg';
import dotenv from 'dotenv';
import { supabase, supabaseAdmin } from './supabase.js';

dotenv.config();

async function verifyWithPg() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes('[YOUR-PASSWORD]') || databaseUrl.includes('localhost:5432/life_rpg')) {
    return false;
  }

  console.log('[PostgreSQL] Connecting directly via DATABASE_URL...');
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    console.log('[PostgreSQL] Connected successfully!\n');

    console.log('1. Row Level Security (RLS) Status:');
    const rlsQuery = `
      SELECT 
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' 
        AND c.relname IN ('characters', 'quests', 'streaks', 'items', 'inventory')
      ORDER BY c.relname;
    `;
    const rlsRes = await client.query(rlsQuery);
    console.table(rlsRes.rows);

    console.log('\n2. Seed Items:');
    const itemsRes = await client.query(`SELECT name, category, cost FROM public.items ORDER BY cost ASC;`);
    console.table(itemsRes.rows);

    await client.end();
    return true;
  } catch (err) {
    console.log('[PostgreSQL] Direct connection error:', err.message);
    try { await client.end(); } catch (_) {}
    return false;
  }
}

async function verifyWithSupabaseAPI() {
  if (!supabaseAdmin) {
    console.log('[Supabase API] Credentials not loaded.');
    return false;
  }

  console.log('[Supabase API] Verifying tables, RLS, and seed catalog via Supabase REST API...\n');
  const tables = ['characters', 'quests', 'streaks', 'items', 'inventory'];
  const tableStatus = [];

  for (const table of tables) {
    // Check with service_role (has admin bypass)
    const { data: adminData, error: adminErr } = await supabaseAdmin.from(table).select('*').limit(1);

    if (adminErr) {
      tableStatus.push({
        table,
        exists: false,
        error: adminErr.message,
        rls_verified: 'N/A'
      });
      continue;
    }

    // Check with anon client (RLS enforced)
    const { data: anonData, error: anonErr } = await supabase.from(table).select('*').limit(1);

    let rlsNote = 'Active & Enforced';
    if (table === 'items') {
      rlsNote = (anonData && !anonErr) ? 'Public Read Permitted (Catalog)' : 'Restricted';
    } else {
      // In private tables, unauthenticated anon should receive 0 rows
      rlsNote = (anonData && anonData.length === 0) ? 'Active (Empty for Anon / Protected)' : (anonErr ? 'Blocked (' + anonErr.message + ')' : 'Check RLS');
    }

    tableStatus.push({
      table,
      exists: true,
      records: adminData ? adminData.length : 0,
      rls_policy: rlsNote
    });
  }

  console.table(tableStatus);

  // Check Seed Items
  const { data: items, error: itemsErr } = await supabaseAdmin.from('items').select('name, category, cost').order('cost', { ascending: true });
  if (items && items.length > 0) {
    console.log(`\n3. Seed Items Catalog (${items.length} items loaded):`);
    console.table(items);
    return true;
  }

  return false;
}

async function main() {
  console.log('======================================================');
  console.log('       LIFE RPG SUPABASE VERIFICATION REPORT          ');
  console.log('======================================================\n');

  const pgVerified = await verifyWithPg();
  if (!pgVerified) {
    const apiVerified = await verifyWithSupabaseAPI();
    if (!apiVerified) {
      console.log('\n[Action Required]');
      console.log('The SQL migration has not been applied to your Supabase project yet.');
      console.log('To apply it:');
      console.log('1. Go to https://supabase.com/dashboard/project/wfrqsoyrqvxrylohwamy/sql');
      console.log('2. Click "New Query"');
      console.log('3. Paste the contents of supabase/migrations/20260912000001_initial_schema.sql');
      console.log('4. Click "Run"');
      console.log('5. Re-run: npm run db:verify in /server');
    }
  }
}

main();
