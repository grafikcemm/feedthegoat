import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request): Promise<NextResponse> {
  const date = new URL(req.url).searchParams.get('date');
  if (!date) return NextResponse.json(null);

  const { data } = await supabaseAdmin
    .from('assistant_daily_state')
    .select('*')
    .eq('date', date)
    .maybeSingle();

  return NextResponse.json(data ?? null);
}
