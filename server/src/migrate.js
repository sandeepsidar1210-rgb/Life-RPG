import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('[YOUR-PASSWORD]') || databaseUrl.includes('localhost:5432/life_rpg')) {
    console.log('[Migration] No active external DATABASE_URL provided or placeholder detected.');
    console.log('[Migration] To run directly against Supabase Postgres:');
    console.log('            Set DATABASE_URL in server/.env with your Supabase pooler or direct connection string.');
    console.log('            Example: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require');
    console.log('            Alternatively, paste supabase/migrations/20260912000001_initial_schema.sql in the Supabase SQL Editor.');
    return;
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  });

  try {
    console.log('[Migration] Connecting to database...');
    await client.connect();
    console.log('[Migration] Connected successfully.');

    const sqlPath = path.resolve(__dirname, '../../supabase/migrations/20260912000001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[Migration] Executing migration...');
    await client.query(sql);
    console.log('[Migration] Migration executed successfully!');

    // Run verification
    console.log('\n--- VERIFYING TABLES AND RLS STATUS ---');
    const res = await client.query(`
      SELECT 
        c.relname as table_name,
        c.relrowsecurity as rls_enabled
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' 
        AND c.relname IN ('characters', 'quests', 'streaks', 'items', 'inventory')
      ORDER BY c.relname;
    `);

    console.table(res.rows);

    const itemsCount = await client.query(`SELECT count(*) FROM public.items;`);
    console.log(`\nSeed items count: ${itemsCount.rows[0].count}`);

  } catch (err) {
    console.error('[Migration Error]', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
