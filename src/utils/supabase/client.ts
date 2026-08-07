import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lslncrqiioujpqhuttlo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_FAQZK8NnQyKWaPup85HJsQ_v-oIx3dj';

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
