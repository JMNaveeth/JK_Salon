import { createClient } from '@supabase/supabase-js';

type ImportMetaEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const env = import.meta as ImportMeta & { env: ImportMetaEnv };

const supabaseUrl = env.env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon key is missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);