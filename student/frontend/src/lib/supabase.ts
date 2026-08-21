import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfmvsftlhynegnjqjtci.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_rhisfOHEIUMuwrXmgGNk_A_vbJuce5L';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
