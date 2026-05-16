import { NextResponse } from 'next/server';
import { callOpenRouter, extractJSON } from '@/lib/openrouter';
import { calculateLocalTodayPlan } from '@/lib/dailyOrchestrator';
import { ASSISTANT_SYSTEM_PROMPT } from '@/lib/assistantPrompt';
import type { DailyOrchestratorInput, UnifiedTodayPlan } from '@/lib/dailyOrchestrator';

const ORCHESTRATOR_SCHEMA = `Aşağıdaki JSON şemasıyla bugünün birleşik planını üret. SADECE geçerli JSON döndür:

{
  "date": "yyyy-mm-dd",
  "mode": "koruma" | "denge" | "atak",
  "agencyLoad": "low" | "normal" | "high",
  "energy": "low" | "medium" | "high",
  "todayLock": "bugünün tek ana kilidi (max 80 karakter)",
  "maxActiveTasks": 1-3 tam sayı,
  "priorityTasks": [
    { "title": "görev", "reason": "neden", "source": "daily" | "growth" | "finance" | "health" | "library" | "rhythm" }
  ],
  "rhythms": [
    { "title": "ritim adı", "timeHint": "Akşam", "minimumVersion": "minimum versiyon veya null", "details": "detay" }
  ],
  "health": {
    "day": 1,
    "phase": "faz adı",
    "todaySummary": "özet",
    "checklist": ["madde1", "madde2"]
  },
  "financeWarnings": ["uyarı"],
  "readingTarget": "kitap:hedef veya null",
  "shutdownQuestions": ["soru1", "soru2", "soru3", "soru4"],
  "telegramMessages": {
    "morningCheckIn": "sabah mesajı",
    "noonCheckIn": "öğle mesajı",
    "eveningRhythm": "akşam mesajı",
    "nightShutdown": "gece mesajı"
  }
}`;

export async function POST(req: Request): Promise<NextResponse> {
  let input: DailyOrchestratorInput | null = null;
  try {
    input = await req.json() as DailyOrchestratorInput;

    const userPrompt = `Tarih: ${input.date}
Ajans yoğunluğu: ${input.agencyLoad ?? 'normal'}
Enerji: ${input.energy ?? 'medium'}
Aktif görevler: ${input.activeTasks.map(t => t.title).join(', ') || 'Yok'}
Bekleyen görevler: ${input.waitingTasks.map(t => t.title).join(', ') || 'Yok'}
Sağlık: Gün ${input.healthProtocol.protocolDay}/30 — ${input.healthProtocol.phase}
Aktif kitap: ${input.activeBook?.title ?? 'Yok'}
Aktif gelişim adımı: ${input.activeGrowthStep?.title ?? 'Yok'}
Bugünkü ritimler: ${input.todayRhythms.map(r => r.title).join(', ') || 'Yok'}

${ORCHESTRATOR_SCHEMA}`;

    const aiResult = await callOpenRouter(
      [
        { role: 'system', content: ASSISTANT_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      { maxTokens: 1200, temperature: 0.2 }
    );

    if (aiResult) {
      const parsed = extractJSON(aiResult) as UnifiedTodayPlan | null;
      if (parsed && parsed.todayLock && parsed.mode) {
        return NextResponse.json(parsed);
      }
    }

    // Fallback to local calculation
    const fallback = calculateLocalTodayPlan(input);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('DailyOrchestrator AI error:', error);
    if (input) return NextResponse.json(calculateLocalTodayPlan(input));
    return NextResponse.json({ error: 'Plan üretilemedi' }, { status: 500 });
  }
}
