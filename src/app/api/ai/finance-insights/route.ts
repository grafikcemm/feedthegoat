import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter, extractJSON } from '@/lib/openrouter';

const SYSTEM_PROMPT = `Sen Feed The Goat uygulamasında Cem'in finans koçusun.

Cem: DEHB uyumlu, freelance + maaşlı çalışan, nakit açığı var.

Finans koçu kuralları:
- Denizbank yapılandırma sadece borç servisidir, planlanan gider değil.
- Borç servislerini geciktirme.
- Kısa ve net konuş. Finans dersi verme. Suçlama yok. Finansal tavsiye değil, bütçe farkındalığı.
- Türkçe yanıt ver.

SADECE geçerli JSON döndür:
{
  "status": "safe" | "attention" | "critical",
  "summary": "kısa durum özeti (max 130 karakter)",
  "recommendedActions": ["aksiyon 1", "aksiyon 2", "aksiyon 3"],
  "subscriptionActions": ["abonelik önerisi 1", "abonelik önerisi 2"],
  "debtServiceNotes": ["borç servisi notu 1"],
  "bleedingWarnings": ["kanama uyarısı 1"],
  "assistantNote": "Cem'e kısa not (max 110 karakter)"
}`;

interface FinanceInsightRequest {
  totalIncome: number;
  totalExpense: number;
  net: number;
  subscriptionTotal: number;
  debtServiceTotal: number;
  currentExpensesTotal: number;
}

const FALLBACK: Record<string, unknown> = {
  status: 'critical',
  summary: 'Ana baskı borç servisi. Yeni borç yok, yeni taksit yok, yeni araç aboneliği yok.',
  recommendedActions: [
    'Borç servislerini geciktirme.',
    'Yemek siparişini 1.750 TL altında tut.',
    'Spor ödemesini nakit akışı netleşince yap.',
  ],
  subscriptionActions: [
    'AI/SaaS araçlarını gözden geçir, 1-2 ana araca indir.',
    'Bu ay yeni araç aboneliği yok.',
  ],
  debtServiceNotes: [
    'Denizbank yapılandırma ilk taksit 10.700 TL borç servisidir.',
    'Kredi 1 son taksit ödenince sonraki aydan itibaren ~10.757 TL rahatlama.',
  ],
  bleedingWarnings: [
    'Taksitli e-ticaret kanalları bu ay kapalı.',
    'Yemek siparişi hedef: 1.750 TL.',
  ],
  assistantNote: 'Kanama durdurma modu. Çizgide kal, borç servisi geçince nefes alırsın.',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as FinanceInsightRequest;
    const { totalIncome, totalExpense, net, subscriptionTotal, debtServiceTotal, currentExpensesTotal } = body;

    const userMessage = `Cem'in güncel finansal durumu:

Gelir (kayıtlı): ${totalIncome.toLocaleString('tr-TR')} TL
Gider (kayıtlı): ${totalExpense.toLocaleString('tr-TR')} TL
Net: ${net.toLocaleString('tr-TR')} TL

Borç servis takvimi toplamı: ${debtServiceTotal.toLocaleString('tr-TR')} TL
(Enpara kredi kartı + Denizbank yapılandırma + kredi taksitleri — borç servisi, gider değil)

Güncel giderler toplamı: ${currentExpensesTotal.toLocaleString('tr-TR')} TL
(Saz kursu 800 TL + Digital Academy 1.800 TL + Spor salonu 5.000 TL)

Abonelik aylık toplam: ${subscriptionTotal.toLocaleString('tr-TR')} TL
(Claude + ChatGPT)

Haziran kuralı: Yeni borç yok. Yeni taksit yok. Yeni araç aboneliği yok.

Bu duruma göre kısa finans analizi yap. Denizbank'tan sadece borç servisi olarak bahset.`;

    const response = await callOpenRouter(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      { temperature: 0.2, maxTokens: 600 }
    );

    if (!response) return NextResponse.json(FALLBACK);

    const parsed = extractJSON(response);
    if (!parsed) return NextResponse.json(FALLBACK);

    const result = parsed as Record<string, unknown>;

    return NextResponse.json({
      status: String(result.status ?? 'critical'),
      summary: String(result.summary ?? FALLBACK.summary),
      recommendedActions: Array.isArray(result.recommendedActions) ? (result.recommendedActions as unknown[]).map(String) : [],
      subscriptionActions: Array.isArray(result.subscriptionActions) ? (result.subscriptionActions as unknown[]).map(String) : [],
      debtServiceNotes: Array.isArray(result.debtServiceNotes) ? (result.debtServiceNotes as unknown[]).map(String) : [],
      bleedingWarnings: Array.isArray(result.bleedingWarnings) ? (result.bleedingWarnings as unknown[]).map(String) : [],
      assistantNote: String(result.assistantNote ?? FALLBACK.assistantNote),
    });
  } catch {
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}
