import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(URL, KEY);

// Based on code occurrences of .from("table_name")
const TABLES = [
  'tasks',
  'daily_scores',
  'goat_state',
  'energy_checkins',
  'daily_logs',
  'active_tasks'
];

const OUT_DIR = 'supabase/exports';
mkdirSync(OUT_DIR, { recursive: true });

async function exportTable(tableName: string) {
  console.log(`Exporting ${tableName}...`);
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`  ERROR on ${tableName}:`, error.message);
    return;
  }
  const json = JSON.stringify(data, null, 2);
  writeFileSync(join(OUT_DIR, `${tableName}.json`), json);
  console.log(`  ${tableName}: ${data?.length ?? 0} rows`);

  // Also generate SQL INSERT statements for re-import
  if (!data || data.length === 0) return;
  const columns = Object.keys(data[0]);
  const sqlLines = data.map(row => {
    const values = columns.map(c => {
      const v = row[c];
      if (v === null) return 'NULL';
      if (typeof v === 'number') return String(v);
      if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
      if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
      return `'${String(v).replace(/'/g, "''")}'`;
    }).join(', ');
    return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`;
  });
  writeFileSync(join(OUT_DIR, `${tableName}.sql`), sqlLines.join('\n'));
}

(async () => {
  for (const table of TABLES) {
    await exportTable(table);
  }
  console.log('Done. Exports in', OUT_DIR);
})();
