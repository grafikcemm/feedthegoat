import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request): Promise<NextResponse> {
  const date = new URL(req.url).searchParams.get('date');
  if (!date) return NextResponse.json([]);

  const { data } = await supabaseAdmin
    .from('assistant_reminders')
    .select('*')
    .eq('date', date)
    .order('sent_at', { ascending: false });

  return NextResponse.json(data ?? []);
}
