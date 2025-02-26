import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Access environment variables directly using process.env
const supabaseUrl = Constants.expoConfig.extra.SUPABASE_PROJECT_URL;
const supabaseAnonKey = Constants.expoConfig.extra.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  alert("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

