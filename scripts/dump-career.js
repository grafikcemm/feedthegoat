
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpCareerData() {
  console.log('--- CAREER PHASES ---');
  const { data: phases, error: pError } = await supabase.from('career_phases').select('*').order('sort_order');
  if (pError) console.error(pError);
  else console.log(JSON.stringify(phases, null, 2));

  console.log('\n--- CAREER SKILLS ---');
  const { data: skills, error: sError } = await supabase.from('career_skills').select('*').order('sort_order');
  if (sError) console.error(sError);
  else console.log(JSON.stringify(skills, null, 2));
}

dumpCareerData();
