import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nyrrdmkqsdlwjcjrypyl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cnJkbWtxc2Rsd2pjanJ5cHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDg2MTEsImV4cCI6MjA5MDMyNDYxMX0.V3SafRjITKa3BVI1ERbO0XKJeGqBHn3FLklp7w1ZMgI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
