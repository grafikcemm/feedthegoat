import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { parseTelegramMessage } from '@/lib/telegramCommandParser';
import { calculateLocalTodayPlan } from '@/lib/dailyOrchestrator';
import { isOrchestratorActive } from '@/data/orchestratorConfig';
import type { AssistantDailyState } from '@/lib/dailyOrchestrator';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID ?? '';

async function sendTelegram(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });
  } catch { /* ignore send errors */ }
}

async function getOrCreateDailyState(date: string): Promise<AssistantDailyState> {
  const { data } = await supabaseAdmin
    .from('assistant_daily_state')
    .select('*')
    .eq('date', date)
    .maybeSingle();
  if (data) return data as AssistantDailyState;

  const newState: Omit<AssistantDailyState, 'id' | 'created_at' | 'updated_at'> = {
    date,
    agency_load: 'normal',
    energy: 'medium',
    mode: 'denge',
    today_plan_json: null,
  };
  const { data: inserted } = await supabaseAdmin
    .from('assistant_daily_state')
    .insert(newState)
    .select()
    .single();
  return (inserted ?? newState) as AssistantDailyState;
}

async function updateDailyState(date: string, patch: Partial<AssistantDailyState>): Promise<void> {
  await supabaseAdmin
    .from('assistant_daily_state')
    .upsert({ date, ...patch, updated_at: new Date().toISOString() }, { onConflict: 'date' });
}

async function buildTodayPlan(date: string, state: AssistantDailyState): Promise<string> {
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
    date,
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

  await updateDailyState(date, { today_plan_json: plan, mode: plan.mode });

  const modeLabel: Record<string, string> = { koruma: '🛡 Koruma', denge: '⚖️ Denge', atak: '🚀 Atak' };
  const agencyLabel: Record<string, string> = { low: 'Rahat', normal: 'Normal', high: 'Yoğun' };
  const energyLabel: Record<string, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' };

  const lines = [
    `<b>Feed The Goat — ${date} Planı</b>`,
    `Mod: ${modeLabel[plan.mode] ?? plan.mode} | Ajans: ${agencyLabel[plan.agencyLoad]} | Enerji: ${energyLabel[plan.energy]}`,
    '',
    `<b>Kilit:</b> ${plan.todayLock}`,
    `<b>Maks görev:</b> ${plan.maxActiveTasks}`,
    '',
  ];

  if (plan.priorityTasks.length > 0) {
    lines.push('<b>Öncelikli işler:</b>');
    plan.priorityTasks.forEach((t, i) => lines.push(`${i + 1}. ${t.title}`));
    lines.push('');
  }

  lines.push(`<b>Sağlık</b> Gün ${plan.health.day}/30 — ${plan.health.todaySummary}`);

  if (plan.readingTarget) lines.push(`<b>Okuma:</b> ${plan.readingTarget}`);

  if (plan.financeWarnings.length > 0) {
    lines.push('');
    lines.push(`<b>Finans:</b> ${plan.financeWarnings[0]}`);
  }

  return lines.join('\n');
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json() as {
      message?: {
        text?: string;
        chat?: { id: number };
        message_id?: number;
      };
    };

    const text = body?.message?.text;
    if (!text) return NextResponse.json({ ok: true });

    const today = new Date().toISOString().slice(0, 10);

    if (!isOrchestratorActive(today)) {
      await sendTelegram(
        `Feed The Goat Asistanı henüz aktif değil.\nSistem ${process.env.ORCHESTRATOR_START_DATE ?? '2026-06-01'} tarihinde başlıyor.`
      );
      return NextResponse.json({ ok: true });
    }

    const intent = parseTelegramMessage(text);
    const state = await getOrCreateDailyState(today);

    switch (intent.type) {
      case 'send_plan': {
        const msg = await buildTodayPlan(today, state);
        await sendTelegram(msg);
        break;
      }

      case 'set_state': {
        await updateDailyState(today, {
          agency_load: intent.agencyLoad,
          energy: intent.energy,
        });
        const updated: AssistantDailyState = { ...state, agency_load: intent.agencyLoad, energy: intent.energy };
        const msg = await buildTodayPlan(today, updated);
        await sendTelegram(msg);
        break;
      }

      case 'set_agency': {
        await updateDailyState(today, { agency_load: intent.agencyLoad });
        const agencyLabel: Record<string, string> = { low: 'Rahat', normal: 'Normal', high: 'Yoğun' };
        await sendTelegram(`Ajans yoğunluğu güncellendi: ${agencyLabel[intent.agencyLoad]}\nPlanı görmek için /plan yaz.`);
        break;
      }

      case 'set_energy': {
        await updateDailyState(today, { energy: intent.energy });
        const energyLabel: Record<string, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' };
        await sendTelegram(`Enerji seviyesi güncellendi: ${energyLabel[intent.energy]}\nPlanı görmek için /plan yaz.`);
        break;
      }

      case 'simplify': {
        await updateDailyState(today, { agency_load: 'high', energy: 'low', mode: 'koruma' });
        await sendTelegram(
          'Koruma moduna geçildi.\n1 ana kilit + kritik rutinler. Yeni görev ekleme.\nPlan güncellendi.'
        );
        break;
      }

      case 'send_rhythms': {
        const dow = new Date().getDay();
        const dayRhythms: Record<number, string> = {
          1: '<b>Pazartesi ritimleri:</b>\n- İngilizce: Günlük kelime (8–10 kelime, 1 cümle)\n- Antrenman: Upper A (75–90 dk)',
          2: '<b>Salı ritimleri:</b>\n- İngilizce Mikro Temas (Fielse 5–8 kelime, 5 cümle)\n- Koşu bandı sabah 20 dk\n- Antrenman: Lower A',
          3: '<b>Çarşamba ritimleri:</b>\n- Saz Ana Ders 1 (35–45 dk: akort + Udemy + 5 tekrar)\n- İngilizce günlük kelime mini ritmi',
          4: '<b>Perşembe ritimleri:</b>\n- İngilizce Ana Çalışma (40–60 dk: tekrar + ders + grammar)\n- Koşu bandı sabah 20 dk\n- Antrenman: Upper B',
          5: '<b>Cuma ritimleri:</b>\n- İngilizce günlük kelime\n- Antrenman: Upper B (80–95 dk)',
          6: '<b>Cumartesi ritimleri:</b>\n- Saz Ana Ders 2 (35–45 dk)\n- İngilizce Hafif Okuma (20–30 dk)\n- Antrenman: Lower B',
          0: '<b>Pazar ritimleri:</b>\n- Saz Tekrar + Ders (35–45 dk)\n- İngilizce Tekrar + Konuşma (45–60 dk)\n- Koşu bandı opsiyonel',
        };
        await sendTelegram(dayRhythms[dow] ?? 'Bugün ritim bilgisi yok.');
        break;
      }

      case 'send_health': {
        const { getProtocolDay, getPhase, getTodayShampoo, PHASE_LABELS, WORKOUT_DAYS } = await import('@/data/healthProtocol');
        const dow = new Date().getDay();
        const protocolDay = getProtocolDay(today);
        const phase = getPhase(protocolDay);
        const shampoo = getTodayShampoo(phase, dow, Math.ceil(Math.max(protocolDay, 1) / 7));
        const isWorkout = WORKOUT_DAYS.has(dow);

        const msg = [
          `<b>Sağlık Gün ${protocolDay}/30 — ${PHASE_LABELS[phase]}</b>`,
          `Şampuan: ${shampoo ? `${shampoo.product}${shampoo.wait ? ` (${shampoo.wait} beklet)` : ''}` : 'Yok'}`,
          '150g protein',
          '2.5–3L su',
          'Süt / gluten / şeker yok',
          'Creatine + Psyllium',
          isWorkout ? 'Antrenman günü — supplement: Creatine + Omega3 + D3K2' : 'Dinlenme günü — supplement: D3K2 + Omega3',
        ].join('\n');
        await sendTelegram(msg);
        break;
      }

      case 'send_finance': {
        await sendTelegram(
          '<b>Finans notu:</b>\nBugün yeni taksit yok. Yeni SaaS yok.\nHaziran kanama durdurma ayı.\n\nKural: Yeni borç yok. Yeni taksit yok. Yeni araç aboneliği yok.'
        );
        break;
      }

      case 'send_book': {
        await sendTelegram(
          '<b>Okuma hedefi:</b>\nAktif kitap: Bir Tek Şey (veya seçtiğin kitap).\nBugünkü hedef: 10 sayfa veya 15 dk.\nEnerji düşükse: 5 sayfa yeterli.'
        );
        break;
      }

      case 'send_shutdown': {
        await sendTelegram(
          'Günü kapatalım Cem.\n1) Bugünün Kilidi bitti mi?\n2) Sağlık kaçaksız mı?\n3) Ritimlerden hangisi tamamlandı?\n4) Yarın ilk hamle ne?'
        );
        break;
      }

      case 'send_status': {
        const agencyLabel: Record<string, string> = { low: 'Rahat', normal: 'Normal', high: 'Yoğun' };
        const energyLabel: Record<string, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' };
        const modeLabel: Record<string, string> = { koruma: '🛡 Koruma', denge: '⚖️ Denge', atak: '🚀 Atak' };
        await sendTelegram(
          `<b>Bugünkü durum — ${today}</b>\nMod: ${modeLabel[state.mode] ?? state.mode}\nAjans: ${agencyLabel[state.agency_load]}\nEnerji: ${energyLabel[state.energy]}`
        );
        break;
      }

      case 'add_task_draft': {
        await sendTelegram(
          `Görevi nereye ekleyeyim?\n"${intent.title}"\n\n1) Bugünün işi\n2) Bekleyen\n3) Gelişim adımı\n\nCevapla: 1, 2 veya 3`
        );
        break;
      }

      default: {
        await sendTelegram(
          'Komutlar:\n/plan — Bugünün planı\n/durum — Anlık durum\n/yogun — Ajans yoğun\n/normal — Ajans normal\n/rahat — Ajans rahat\n/sadelestir — Koruma modu\n/ritimler — Ritim detayları\n/saglik — Sağlık protokolü\n/finans — Finans notu\n/kitap — Okuma hedefi\n/shutdown — Günü kapat\n\nYa da yaz: "yoğun düşük", "rahat yüksek", "görev ekle: ..."'
        );
        break;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
