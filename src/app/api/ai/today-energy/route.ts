import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateTodayEnergy } from "@/lib/todayEnergy";

// ── Schemas ───────────────────────────────────────────────────────────────────

const RequestSchema = z.object({
  date: z.string(),
  completedTasksYesterday: z.number(),
  criticalRoutineCompletionRate: z.number().min(0).max(1),
  dailyPeakClean: z.boolean().nullable(),
  activeTasksCount: z.number().int().nonnegative(),
  waitingTasksCount: z.number().int().nonnegative(),
  rhythmCountToday: z.number().int().nonnegative(),
  recentDays: z
    .array(
      z.object({
        date: z.string(),
        completedTasks: z.number(),
        peakClean: z.boolean().nullable(),
        criticalRate: z.number(),
      })
    )
    .optional(),
});

const AIResponseSchema = z.object({
  energy: z.enum(["low", "medium", "high"]),
  mode: z.enum(["koruma", "denge", "atak"]),
  capacity: z.number().int().min(1).max(4),
  message: z.string().max(200),
  warning: z.string().max(200).nullable(),
  suggestedFocus: z.string().max(100),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildPrompt(input: z.infer<typeof RequestSchema>): string {
  const data = {
    tamamlananDunGorevler: input.completedTasksYesterday,
    kritikRutinOrani: (input.criticalRoutineCompletionRate * 100).toFixed(0) + "%",
    dunPeakTemiz: input.dailyPeakClean === null ? "veri yok" : input.dailyPeakClean ? "evet" : "hayır",
    aktifGorevSayisi: input.activeTasksCount,
    bekleyenGorevSayisi: input.waitingTasksCount,
    bugunRitimSayisi: input.rhythmCountToday,
  };

  return `Bugünün enerji seviyesini hesapla. Kullanıcının amacı kendini geliştirmek ama sistem onu bunaltmamalı. Görev kapasitesini abartma. Veriler: ${JSON.stringify(data)}

Yanıt olarak SADECE aşağıdaki JSON formatını döndür, başka hiçbir şey ekleme:
{
  "energy": "low" | "medium" | "high",
  "mode": "koruma" | "denge" | "atak",
  "capacity": 1 ile 4 arası tam sayı,
  "message": "kısa Türkçe mesaj (max 80 karakter)",
  "warning": "uyarı metni veya null",
  "suggestedFocus": "odak alanı (max 30 karakter)"
}`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const input = parsed.data;
  const fallback = calculateTodayEnergy(input);

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  // No key or model configured → return local calculation immediately
  if (!apiKey || !model) {
    return NextResponse.json(fallback);
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://feedthegoat.app",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "Sen kişisel disiplin ve günlük planlama asistanısın. Kullanıcı yoğun çalışıyor ve kendini geliştirmek istiyor. Görevin onu yargılamadan, sürdürülebilir bir günlük kapasiteyle yönlendirmek. Uzun açıklama yapma. Sadece geçerli JSON döndür.",
          },
          {
            role: "user",
            content: buildPrompt(input),
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(fallback);
    }

    // Strip markdown code fences if present
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(fallback);
    }

    let rawAI: unknown;
    try {
      rawAI = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(fallback);
    }

    const aiParsed = AIResponseSchema.safeParse(rawAI);
    if (!aiParsed.success) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json(aiParsed.data);
  } catch {
    // Network error, timeout, or any unexpected failure → silent fallback
    return NextResponse.json(fallback);
  }
}
