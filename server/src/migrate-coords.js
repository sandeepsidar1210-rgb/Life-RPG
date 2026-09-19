import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_SQL = `
-- Add 3D coordinates and surface columns to public.inventory
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS position_x DOUBLE PRECISION DEFAULT NULL,
ADD COLUMN IF NOT EXISTS position_y DOUBLE PRECISION DEFAULT 0,
ADD COLUMN IF NOT EXISTS position_z DOUBLE PRECISION DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rotation_y DOUBLE PRECISION DEFAULT 0,
ADD COLUMN IF NOT EXISTS surface TEXT DEFAULT 'floor';
`;

async function runCoordsMigration() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('[YOUR-PASSWORD]') || databaseUrl.includes('localhost:5432/life_rpg')) {
    console.log('\n=============================================================');
    console.log('  SANCTUARY COORDINATES DATABASE MIGRATION');
    console.log('=============================================================');
    console.log('\nNo direct DATABASE_URL connection configured in server/.env.');
    console.log('The Life RPG server automatically persists all coordinates via');
    console.log('the local disk-backed coordinate store and browser localStorage.');
    console.log('\nIf you also want these columns added to Supabase PostgreSQL:');
    console.log('1. Visit: https://supabase.com/dashboard/project/wfrqsoyrqvxrylohwamy/sql');
    console.log('2. Run this SQL in the Query Editor:\n');
    console.log(MIGRATION_SQL.trim());
    console.log('\n=============================================================\n');
    return;
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  });

  try {
    console.log('[Migration] Connecting to database...');
    await client.connect();
    console.log('[Migration] Executing coordinate schema migration...');
    await client.query(MIGRATION_SQL);
    console.log('[Migration] ✓ Sanctuary coordinates columns migrated successfully!');
  } catch (err) {
    console.error('[Migration Error]', err.message);
  } finally {
    await client.end();
  }
}

runCoordsMigration();
