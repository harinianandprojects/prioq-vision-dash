import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cpvhbxmwulbqnpuqzeaa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdmhieG13dWxicW5wdXF6ZWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzQ5ODEsImV4cCI6MjA3NjQ1MDk4MX0.JUUFWsdmxs2wFvspCcRS49k470Ihfl_SVDJhxe83grA";

export const externalSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
