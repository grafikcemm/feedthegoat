import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://umercglqbyfqrulhubzv.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_tQMdjkCG87s46Opt5Y4eWg_FBYHxrZ_";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables are missing. Using placeholders for UI development.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
