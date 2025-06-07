import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jthzocdiryhuytnmtekj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aHpvY2RpcnlodXl0bm10ZWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDA4NDUsImV4cCI6MjA2Mzg3Njg0NX0.eNbN8wZsAYz_RmcjyspXUJDPhEGYKHa4pSrWc4Hbb-M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});