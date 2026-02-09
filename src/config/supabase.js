import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rttwsqlisjpcmcfpkdvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dHdzcWxpc2pwY21jZnBrZHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDA3MTEsImV4cCI6MjA3OTY3NjcxMX0.0qCPqa6iZd0-YBCssDTK5HLCRGJJirzs3J2nWyl_Jh8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});