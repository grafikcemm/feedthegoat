import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Thin wrapper used by server actions — identical to createServerSupabase
// but importable as `@/lib/supabase/server`
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createSupabaseClient(url, key)
}
