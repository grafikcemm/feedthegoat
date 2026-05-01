
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function unlockAllPhases() {
  console.log('Unlocking all career phases...');
  const { data, error } = await supabase
    .from('career_phases')
    .update({ is_unlocked: true })
    .neq('id', 0); // Update all rows

  if (error) {
    console.error('Error unlocking phases:', error);
  } else {
    console.log('Successfully unlocked all career phases.');
  }
}

unlockAllPhases();
