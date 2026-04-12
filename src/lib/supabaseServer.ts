import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client for server actions and RSC
// Uses the same anon key — this is a single-user app without auth
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}
