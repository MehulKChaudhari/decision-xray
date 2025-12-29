import { createClient } from '@supabase/supabase-js';
import config from 'config';

interface DbConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

const dbConfig: DbConfig = config.get('database');

export const supabase = createClient(
  dbConfig.supabaseUrl,
  dbConfig.supabaseKey
);
