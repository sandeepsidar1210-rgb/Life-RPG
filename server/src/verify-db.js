import pg from 'pg';
import dotenv from 'dotenv';
import { supabase, supabaseAdmin } from './supabase.js';

dotenv.config();

async function verifyWithPg() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes('[YOUR-PASSWORD]') || databaseUrl.includes('localhost:5432/life_rpg')) {
    return false;
  }

  console.log('[Verification] Testing connection via PostgreSQL (DATABASE_URL)...');
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    console.log('[Verification] Connected to PostgreSQL successfully!\n');

    // 1. Check Tables and RLS
    console.log('1. Checking Tables & Row Level Security (RLS):');
    const rlsQuery = `
      SELECT 
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled,
        c.relforcerowsecurity AS rls_forced
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' 
        AND c.relname IN ('characters', 'quests', 'streaks', 'items', 'inventory')
      ORDER BY c.relname;
    `;
    const rlsRes = await client.query(rlsQuery);
    console.table(rlsRes.rows);

    // 2. Check Policies
    console.log('\n2. Active RLS Policies:');
    const policiesQuery = `
      SELECT 
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename IN ('characters', 'quests', 'streaks', 'items', 'inventory')
      ORDER BY tablename, cmd;
    `;
    const polRes = await client.query(policiesQuery);
    console.table(polRes.rows.map(r => ({
      table: r.tablename,
      policy: r.policyname,
      command: r.cmd,
      using: r.qual ? r.qual.substring(0, 30) : null
    })));

    // 3. Check Seeded Items
    console.log('\n3. Seed Items Catalog:');
    const itemsRes = await client.query(`SELECT name, category, cost FROM public.items ORDER BY cost ASC;`);
    console.table(itemsRes.rows);

    await client.end();
    return true;
  } catch (err) {
    console.error('[Verification Error via pg]', err.message);
    try { await client.end(); } catch (_) {}
    return false;
  }
}

async function verifyWithSupabaseClient() {
  const client = supabaseAdmin || supabase;
  if (!client) {
    console.log('[Verification] No Supabase API client configured (SUPABASE_URL and KEY are placeholder).');
    return false;
  }

  console.log('[Verification] Querying Supabase REST API...');
  try {
    const { data: items, error: itemsError } = await client.from('items').select('*');
    if (itemsError) {
      console.error('[Verification Error]', itemsError.message);
      return false;
    }

    console.log(`[Verification] Successfully read ${items.length} items from 'items' table.`);
    console.table(items.map(i => ({ name: i.name, category: i.category, cost: i.cost })));
    return true;
  } catch (err) {
    console.error('[Verification Error]', err.message);
    return false;
  }
}

async function main() {
  console.log('====================================================');
  console.log('      LIFE RPG DATABASE VERIFICATION REPORT         ');
  console.log('====================================================\n');

  const pgSuccess = await verifyWithPg();
  if (!pgSuccess) {
    const sbSuccess = await verifyWithSupabaseClient();
    if (!sbSuccess) {
      console.log('\n[Notice] Live database credentials are currently in .env.example / placeholder.');
      console.log('To connect to your Supabase project:');
      console.log('1. Open your Supabase project dashboard (https://supabase.com/dashboard)');
      console.log('2. Go to Project Settings -> Database -> Connection String (URI / Pooler)');
      console.log('3. Copy your URI and paste into server/.env as DATABASE_URL');
      console.log('4. Copy Project URL and Anon/Service-Role Keys into server/.env and client/.env');
      console.log('5. Run "npm run db:migrate" and "npm run db:verify" in /server');
      console.log('   OR paste supabase/migrations/20260912000001_initial_schema.sql directly in Supabase SQL Editor.');
    }
  }
}

main();
