import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(URL, KEY);

async function verify() {
  console.log('--- DERS ÖZETİ ---');
  const { data: courses, error: cErr } = await supabase
    .from('courses')
    .select('name, subsection, status, universities(slug)')
    .order('subsection', { ascending: true, nullsFirst: true });
  
  if (cErr) console.error('Course Error:', cErr.message);
  else {
    courses?.forEach(c => {
      console.log(`[${(c as any).universities.slug}] ${c.name} (${c.subsection || 'Normal'}) - ${c.status}`);
    });
  }

  console.log('\n--- SINAV ÖZETİ ---');
  const { data: exams, error: eErr } = await supabase
    .from('exams')
    .select('title, exam_date, exam_period, universities(slug)')
    .order('exam_date', { ascending: true });

  if (eErr) console.error('Exam Error:', eErr.message);
  else {
    exams?.forEach(e => {
      console.log(`[${(e as any).universities.slug}] ${e.title} (${e.exam_period}) - ${e.exam_date}`);
    });
  }
}

verify();
