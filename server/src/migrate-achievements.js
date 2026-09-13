import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQL_PATH = path.resolve(__dirname, '../../supabase/migrations/20260913000002_achievements.sql');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Build a DATABASE_URL from Supabase URL 
// Supabase Postgres is accessible via: postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
// We can also use Supabase's db.<ref>.supabase.co direct connection

async function runAchievementsMigration() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl || dbUrl.includes('[YOUR-PASSWORD]')) {
    console.log('\n============================================');
    console.log('  MANUAL MIGRATION REQUIRED');
    console.log('============================================');
    console.log('\nDATABASE_URL is not configured in server/.env.');
    console.log('Please apply the migration by copying the SQL below');
    console.log('into the Supabase SQL Editor at:');
    console.log('  https://supabase.com/dashboard/project/wfrqsoyrqvxrylohwamy/sql\n');
    
    const sql = fs.readFileSync(SQL_PATH, 'utf8');
    console.log('=== SQL TO APPLY ===\n');
    console.log(sql);
    console.log('\n===================\n');
    return;
  }

  console.log('[Migrate] Connecting to Supabase Postgres...');
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('[Migrate] Connected!');

    const sql = fs.readFileSync(SQL_PATH, 'utf8');
    await client.query(sql);
    console.log('[Migrate] achievements migration applied ✓');

    const res = await client.query(`SELECT name, criteria_type, criteria_value FROM public.achievements ORDER BY criteria_type;`);
    console.table(res.rows);

  } catch (err) {
    console.error('[Migrate Error]', err.message);
  } finally {
    await client.end();
  }
}

runAchievementsMigration();
