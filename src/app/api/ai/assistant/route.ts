import { NextResponse } from "next/server";
import { z } from "zod";
import { callOpenRouter, extractJSON } from "@/lib/openrouter";
import { ASSISTANT_SYSTEM_PROMPT, DAILY_BRIEF_SCHEMA_PROMPT } from "@/lib/assistantPrompt";

// ── Schemas ───────────────────────────────────────────────────────────────────

const BriefRequestSchema = z.object({
  mode: z.literal("brief"),
  date: z.string(),
  completedTasksYesterday: z.number().optional().default(0),
  criticalRoutineCompletionRate: z.number().optional().default(0),
  dailyPeakClean: z.boolean().nullable().optional().default(null),
  activeTasksCount: z.number().optional().default(0),
  waitingTasksCount: z.number().optional().default(0),
  rhythmCountToday: z.number().optional().default(0),
});

const ChatRequestSchema = z.object({
  mode: z.literal("chat"),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
});

const DailyBriefSchema = z.object({
  greeting: z.string(),
  energySummary: z.string(),
  todayLock: z.string(),
  capacity: z.number().int().min(1).max(4),
  criticalReminder: z.string(),
  rhythmReminder: z.string().nullable(),
  warning: z.string().nullable(),
  shutdownQuestion: z.string(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildBriefPrompt(data: z.infer<typeof BriefRequestSchema>): string {
  const ctx = {
    tamamlananDunGorevler: data.completedTasksYesterday,
    kritikRutinOrani: (data.criticalRoutineCompletionRate * 100).toFixed(0) + "%",
    dunPeakTemiz: data.dailyPeakClean === null ? "veri yok" : data.dailyPeakClean ? "evet" : "hayır",
    aktifGorevSayisi: data.activeTasksCount,
    bekleyenGorevSayisi: data.waitingTasksCount,
    bugunRitimSayisi: data.rhythmCountToday,
  };

  return `Bugünün durumu: ${JSON.stringify(ctx)}\n\n${DAILY_BRIEF_SCHEMA_PROMPT}`;
}

const FALLBACK_BRIEF = {
  greeting: "Cem, bugün sade ilerliyoruz.",
  energySummary: "Kritik rutinleri önce tamamla.",
  todayLock: "Kritik rutinleri tamamla, gün kazanıldı.",
  capacity: 2,
  criticalReminder: "Kritik rutinler minimum çizgidir. Önce bunlar.",
  rhythmReminder: null,
  warning: null,
  shutdownQuestion: "Yarının ilk hamlesini seç.",
};

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const modeCheck = z.object({ mode: z.string() }).safeParse(body);
  if (!modeCheck.success) {
    return NextResponse.json({ error: "Missing mode" }, { status: 400 });
  }

  // ── Brief mode ──────────────────────────────────────────────────────────────
  if (modeCheck.data.mode === "brief") {
    const parsed = BriefRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(FALLBACK_BRIEF);
    }

    const userPrompt = buildBriefPrompt(parsed.data);
    const content = await callOpenRouter([
      { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ], { maxTokens: 400, temperature: 0.4 });

    if (!content) return NextResponse.json(FALLBACK_BRIEF);

    const raw = extractJSON(content);
    const briefParsed = DailyBriefSchema.safeParse(raw);
    if (!briefParsed.success) return NextResponse.json(FALLBACK_BRIEF);

    return NextResponse.json(briefParsed.data);
  }

  // ── Chat mode ───────────────────────────────────────────────────────────────
  if (modeCheck.data.mode === "chat") {
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ reply: "Bir hata oluştu." });
    }

    const content = await callOpenRouter([
      { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
      ...parsed.data.messages,
    ], { maxTokens: 300, temperature: 0.5 });

    return NextResponse.json({ reply: content ?? "Yanıt alınamadı." });
  }

  return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
}
