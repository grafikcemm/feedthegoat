import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isOrchestratorActive } from '@/data/orchestratorConfig';
import { getDueReminder } from '@/lib/reminderEngine';
import { calculateLocalTodayPlan } from '@/lib/dailyOrchestrator';
import {
  getProtocolDay,
  getPhase,
  getTodayShampoo,
  PHASE_LABELS,
  WORKOUT_DAYS,
} from '@/data/healthProtocol';
import type { ReminderType } from '@/data/orchestratorConfig';
import type { AssistantDailyState } from '@/lib/dailyOrchestrator';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID ?? '';

async function sendTelegram(text: string): Promise<number | null> {
  if (!BOT_TOKEN || !CHAT_ID) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });
    const data = await res.json() as { ok: boolean; result?: { message_id: number } };
    return data?.result?.message_id ?? null;
  } catch {
    return null;
  }
}

async function getOrCreateDailyState(date: string): Promise<AssistantDailyState> {
  const { data } = await supabaseAdmin
    .from('assistant_daily_state')
    .select('*')
    .eq('date', date)
    .maybeSingle();
  if (data) return data as AssistantDailyState;

  const newState = { date, agency_load: 'normal', energy: 'medium', mode: 'denge', today_plan_json: null };
  const { data: inserted } = await supabaseAdmin
    .from('assistant_daily_state')
    .insert(newState)
    .select()
    .single();
  return (inserted ?? newState) as AssistantDailyState;
}

function buildReminderMessage(type: ReminderType, date: string, state: AssistantDailyState): string {
  const dow = new Date(date).getDay();

  if (type === 'morning_checkin') {
    return `Günaydın Cem.\nBugün ajans yoğunluğu nasıl: Yoğun / Normal / Rahat?\nEnerjin nasıl: Düşük / Orta / Yüksek?\nCevapla: yoğun düşük`;
  }

  if (type === 'midday_status') {
    return `Cem, gün ortası kontrol.\nAjans beklediğinden yoğun mu?\nCevapla: rahat / normal / yoğun / sadeleştir`;
  }

  if (type === 'evening_rhythm') {
    const dayRhythms: Record<number, string> = {
      1: '- İngilizce günlük kelime (8–10 kelime)\n- Antrenman: Upper A',
      2: '- İngilizce Mikro Temas (Fielse, 5–8 kelime)\n- Koşu bandı 20 dk\n- Antrenman: Lower A',
      3: '- Saz Ana Ders 1 (akort + Udemy + 5 tekrar)\n- İngilizce günlük kelime',
      4: '- İngilizce Ana Çalışma (40–60 dk)\n- Koşu bandı 20 dk\n- Antrenman: Upper B',
      5: '- İngilizce günlük kelime\n- Antrenman: Upper B (80–95 dk)',
      6: '- Saz Ana Ders 2 (35–45 dk)\n- İngilizce Hafif Okuma\n- Antrenman: Lower B',
      0: '- Saz Tekrar + Ders (35–45 dk)\n- İngilizce Tekrar + Konuşma (45–60 dk)',
    };
    const rhythmDetail = dayRhythms[dow] ?? 'Bugün programlanmış ritim yok.';
    const energyNote = state.energy === 'low' ? '\n\nEnerji düşük — minimum versiyon yeterli.' : '';
    return `<b>Akşam ritimleri:</b>\n${rhythmDetail}${energyNote}`;
  }

  if (type === 'night_shutdown') {
    // Health snapshot for shutdown
    const protocolDay = getProtocolDay(date);
    const phase = getPhase(protocolDay);
    const shampoo = getTodayShampoo(phase, dow, Math.ceil(Math.max(protocolDay, 1) / 7));
    const isWorkout = WORKOUT_DAYS.has(dow);
    const healthLine = `Gün ${protocolDay}/30 — ${PHASE_LABELS[phase]}${shampoo?.isRequired ? ` — Şampuan: ${shampoo.product}` : ''}${isWorkout ? ' — Antrenman günü' : ''}`;

    return `Günü kapatalım Cem.\n\n<b>Sağlık:</b> ${healthLine}\n\n1) Bugünün Kilidi bitti mi?\n2) Sağlık kaçaksız mı?\n3) Ritimlerden hangisi tamamlandı?\n4) Yarın ilk hamle ne?`;
  }

  return '';
}

export async function GET(req: Request): Promise<NextResponse> {
  const secret = new URL(req.url).searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);

  if (!isOrchestratorActive(today)) {
    return NextResponse.json({ ok: true, message: 'Orchestrator not active yet', startDate: process.env.ORCHESTRATOR_START_DATE });
  }

  // Get already-sent reminders for today
  const { data: sentRows } = await supabaseAdmin
    .from('assistant_reminders')
    .select('reminder_type')
    .eq('date', today);

  const sentToday = (sentRows ?? []).map(r => r.reminder_type as ReminderType);
  const due = getDueReminder(new Date(), sentToday);

  if (!due) {
    return NextResponse.json({ ok: true, message: 'No reminder due right now', sentToday });
  }

  const state = await getOrCreateDailyState(today);

  // Build plan if not already done for morning check-in
  if (due === 'morning_checkin' && !state.today_plan_json) {
    const { data: activeTasks } = await supabaseAdmin
      .from('active_tasks')
      .select('id, title, category, is_priority')
      .order('is_priority', { ascending: false })
      .limit(10);

    const { data: phases } = await supabaseAdmin
      .from('career_phases')
      .select('id, title, is_active');
    const { data: skills } = await supabaseAdmin
      .from('career_skills')
      .select('id, phase_id, title, is_completed')
      .order('sort_order');

    const activePhase = phases?.find(p => p.is_active);
    const activeStep = activePhase
      ? skills?.find(s => s.phase_id === activePhase.id && !s.is_completed) ?? null
      : null;

    const plan = calculateLocalTodayPlan({
      date: today,
      agencyLoad: state.agency_load,
      energy: state.energy,
      activeTasks: (activeTasks ?? []).filter(t => t.category === 'active'),
      waitingTasks: (activeTasks ?? []).filter(t => t.category === 'waiting'),
      criticalRoutines: [],
      todayRhythms: [],
      healthProtocol: { protocolDay: 1, phase: 'Saldırı', shampoo: null, supplementList: [] },
      financeSnapshot: { hasDebtService: false, haineWarning: false },
      activeBook: null,
      activeGrowthStep: activeStep ? { title: activeStep.title } : null,
    });

    await supabaseAdmin
      .from('assistant_daily_state')
      .upsert({ date: today, today_plan_json: plan, updated_at: new Date().toISOString() }, { onConflict: 'date' });
  }

  const message = buildReminderMessage(due, today, state);
  const messageId = await sendTelegram(message);

  // Record the sent reminder
  await supabaseAdmin.from('assistant_reminders').upsert(
    {
      date: today,
      reminder_type: due,
      sent_at: new Date().toISOString(),
      status: 'sent',
      telegram_message_id: messageId,
    },
    { onConflict: 'date,reminder_type' }
  );

  return NextResponse.json({ ok: true, sent: due, messageId });
}
