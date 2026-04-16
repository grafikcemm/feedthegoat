
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log('--- DB Check ---');
  
  // Today's completions
  const today = new Date().toISOString().split('T')[0];
  const { data: completions, error: compError } = await supabase
    .from('daily_completions')
    .select('template_id, date')
    .eq('date', today);
    
  if (compError) console.error('Completions Error:', compError);
  else console.log(`Completions today (${today}):`, completions.length);

  // Active tasks
  const { data: activeTasks, error: taskError } = await supabase
    .from('active_tasks')
    .select('title, category, is_done');
    
  if (taskError) console.error('Tasks Error:', taskError);
  else console.log('Active Tasks:', activeTasks.length);

  // Goat state
  const { data: goatState, error: stateError } = await supabase
    .from('goat_state')
    .select('*')
    .eq('id', 1)
    .single();
    
  if (stateError) console.error('Goat State Error:', stateError);
  else console.log('Goat State:', goatState);

  console.log('--- End DB Check ---');
}

checkDb();
