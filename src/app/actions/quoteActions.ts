'use server';

import { createServerSupabase } from '@/lib/supabaseServer';

export async function ensureTodayQuote(): Promise<void> {
  const supabase = createServerSupabase();
  const today = new Date().toISOString().slice(0, 10);

  // 1. Check if we already have a quote for today
  const { data: existing } = await supabase
    .from('daily_quotes')
    .select('id')
    .eq('date', today)
    .maybeSingle();

  if (existing) return;

  // 2. Fetch candidates from the pool
  // Logic: Get 50 candles that either haven't been used today (should be most of them)
  // and prioritize those never used or used longest ago.
  const { data: poolQuotes } = await supabase
    .from('quote_pool')
    .select('id, quote, author')
    .or(`used_on.is.null,used_on.neq.${today}`)
    .order('used_on', { ascending: true, nullsFirst: true })
    .limit(50);

  if (!poolQuotes || poolQuotes.length === 0) {
    console.error('[quoteActions] No quotes found in pool');
    return;
  }

  // 3. Select one at random
  const selected = poolQuotes[Math.floor(Math.random() * poolQuotes.length)];

  // 4. Upsert into daily_quotes
  const { error: upsertError } = await supabase
    .from('daily_quotes')
    .upsert(
      { date: today, quote: selected.quote, author: selected.author ?? null },
      { onConflict: 'date' }
    );

  if (upsertError) {
    console.error('[quoteActions] Failed to upsert daily quote:', upsertError);
    return;
  }

  // 5. Mark as used in pool
  const { error: updateError } = await supabase
    .from('quote_pool')
    .update({ used_on: today })
    .eq('id', selected.id);

  if (updateError) {
    console.error('[quoteActions] Failed to update used_on in pool:', updateError);
  }
}
