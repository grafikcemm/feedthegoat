import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);

async function check() {
  const { data: phases, error: pError } = await supabase.from('career_phases').select('*');
  const { data: skills, error: sError } = await supabase.from('career_skills').select('*');
  
  console.log('Phases:', phases?.length || 0);
  console.log('Skills:', skills?.length || 0);
  if (pError) console.error('P Error:', pError);
  if (sError) console.error('S Error:', sError);
}

check();
