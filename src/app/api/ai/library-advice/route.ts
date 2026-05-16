import { NextResponse } from "next/server";
import { z } from "zod";
import { callOpenRouter, extractJSON } from "@/lib/openrouter";

const RequestSchema = z.object({
  activeBook: z
    .object({
      id: z.string(),
      title: z.string(),
      category: z.string(),
      problemItSolves: z.string(),
      whyRead: z.string(),
      feedTheGoatAction: z.string(),
      readingMode: z.string(),
    })
    .nullable(),
  completedCount: z.number().default(0),
  totalBooks: z.number().default(0),
  prompt: z.string().default("Genel okuma koçluğu ver"),
});

const FALLBACK_RESPONSE = {
  activeBookAdvice: "Aktif kitabına odaklan. Bugün sadece 10-15 dakika yeterli.",
  shouldContinueCurrentBook: true,
  nextBook: null,
  reason: "Aktif kitabı bitirmeden sıradakine geçme.",
  todayReadingTarget: "10 sayfa veya 15 dakika — hangisi gelirse.",
  avoidStarting: [],
  actionFromBook: "Kitaptan 1 aksiyon çıkar ve sisteme ekle.",
};

const SYSTEM_PROMPT = `Sen Feed The Goat uygulamasında çalışan bir kitap koçusun.
Kullanıcı: Cem — DEHB uyumlu, yoğun çalışan, aynı anda çok şey yapmak isteyen ama tamamlayamayan biri.

Kütüphane kuralları:
- Aynı anda sadece 1 aktif ana kitap olabilir.
- Bir kitap bitmeden sıradakine geçilmemeli.
- Kitap bitmiş sayılması için: 5 not + 1 aksiyon + 1 Feed The Goat bağlantısı gerekir.
- Referans kitaplar (tasarım, grafik, tipografi) ana kitap gibi değil, araç olarak kullanılır.
- Edebiyat kitapları akşam okuması olarak ayrı tutulabilir ama ana kitabın önüne geçmemeli.
- Ana kitap ilerlemiyorsa yeni kitap önerme.
- Enerji düşükse 5-10 sayfa veya 10 dakika yeterli de.
- Yoğun günlerde "bugün sadece 10 dakika oku" öner.
- Kitapları Cem'in gerçek problemlerine bağla. Motivasyonel boş laftan kaçın.
- Türkçe yanıt ver. Kısa ve net konuş.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(FALLBACK_RESPONSE);
    }

    const { activeBook, completedCount, totalBooks, prompt } = parsed.data;

    const userContext = activeBook
      ? `Aktif kitap: "${activeBook.title}" — ${activeBook.problemItSolves}. Bu kitabın Feed The Goat aksiyonu: ${activeBook.feedTheGoatAction}.`
      : "Şu an aktif kitap yok.";

    const userMessage = `${userContext}

Tamamlanan kitap sayısı: ${completedCount}/${totalBooks}

Kullanıcı sorusu / isteği: "${prompt}"

Aşağıdaki JSON formatında yanıt ver:
{
  "activeBookAdvice": "aktif kitapla ilgili kısa ve net tavsiye",
  "shouldContinueCurrentBook": true veya false,
  "nextBook": "sıradaki kitap adı ya da null",
  "reason": "neden bu kitap veya öneri",
  "todayReadingTarget": "bugün için somut hedef (sayfa veya dakika)",
  "avoidStarting": ["şu an başlanmaması gereken kitap başlıkları"],
  "actionFromBook": "aktif kitaptan çıkarılabilecek somut 1 aksiyon"
}`;

    const raw = await callOpenRouter([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ]);

    if (!raw) return NextResponse.json(FALLBACK_RESPONSE);
    const jsonRaw = extractJSON(raw);
    if (!jsonRaw) return NextResponse.json(FALLBACK_RESPONSE);
    const json = jsonRaw as Record<string, unknown>;

    const result = {
      activeBookAdvice: String(json.activeBookAdvice ?? FALLBACK_RESPONSE.activeBookAdvice),
      shouldContinueCurrentBook: Boolean(json.shouldContinueCurrentBook ?? true),
      nextBook: json.nextBook ? String(json.nextBook) : null,
      reason: String(json.reason ?? FALLBACK_RESPONSE.reason),
      todayReadingTarget: String(json.todayReadingTarget ?? FALLBACK_RESPONSE.todayReadingTarget),
      avoidStarting: Array.isArray(json.avoidStarting) ? (json.avoidStarting as unknown[]).map(String) : [],
      actionFromBook: String(json.actionFromBook ?? FALLBACK_RESPONSE.actionFromBook),
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(FALLBACK_RESPONSE);
  }
}
