import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-project-id'))
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
