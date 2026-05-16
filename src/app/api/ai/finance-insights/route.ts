import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter, extractJSON } from '@/lib/openrouter';

const SYSTEM_PROMPT = `Sen Feed The Goat uygulamasında Cem'in finans koçusun.

Cem: DEHB uyumlu, freelance + maaşlı çalışan, Haziran'da ciddi nakit açığı var.

Haziran kuralları:
- Yeni borç yok. Yeni taksit yok. Yeni araç aboneliği yok.
- Denizbank yapılandırma sadece borç servisidir, planlanan gider değil.
- Borç servislerini geciktirme.
- Yemek siparişi Haziran hedefi: 1.750 TL.
- AI/SaaS araçlarını azalt.
- Spor ödemesi nakit akışı netleşince.
- Kısa ve net konuş. Finans dersi verme. Suçlama. Finansal tavsiye değil, bütçe farkındalığı.
- Türkçe yanıt ver.

SADECE geçerli JSON döndür:
{
  "status": "safe" | "attention" | "critical",
  "summary": "kısa durum özeti (max 130 karakter)",
  "recommendedActions": ["aksiyon 1", "aksiyon 2", "aksiyon 3"],
  "avoidThisMonth": ["kaçınılacak 1", "kaçınılacak 2"],
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
  plannedTotal: number;
  mode: string;
  rule: string;
}

const FALLBACK: Record<string, unknown> = {
  status: 'critical',
  summary: 'Haziran tahmini açık -14.378 TL. Kanama durdurma modu aktif.',
  recommendedActions: [
    'Borç servislerini geciktirme.',
    'Yemek siparişini 1.750 TL altında tut.',
    'Spor ödemesini nakit akışı netleşince yap.',
  ],
  avoidThisMonth: [
    'Yeni taksit açma.',
    'Nakit avans / hazır limit kullanma.',
    'Yeni abonelik başlatma.',
  ],
  subscriptionActions: [
    'AI/SaaS araçlarını gözden geçir, 1-2 ana araca indir.',
    'Bu ay yeni araç aboneliği yok.',
  ],
  debtServiceNotes: [
    'Denizbank yapılandırma ilk taksit 10.700 TL borç servisidir.',
    'Kredi 1 son taksit ödenince Temmuz\'dan itibaren ~10.757 TL rahatlama.',
  ],
  bleedingWarnings: [
    'Taksitli e-ticaret kanalları bu ay kapalı.',
    'Yemek siparişi hedef: 1.750 TL.',
  ],
  assistantNote: 'Haziran kanama durdurma ayı. Çizgide kal, Temmuz\'da nefes alırsın.',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as FinanceInsightRequest;
    const { totalIncome, totalExpense, net, subscriptionTotal, debtServiceTotal, plannedTotal } = body;

    const userMessage = `Cem'in Haziran 2025 finansal durumu:

Gelir: ${totalIncome.toLocaleString('tr-TR')} TL
Toplam tahmini gider: ${totalExpense.toLocaleString('tr-TR')} TL
Net: ${net.toLocaleString('tr-TR')} TL
Mod: Kanama Durdurma Modu

Borç servis toplamı: ${debtServiceTotal.toLocaleString('tr-TR')} TL
(Enpara kredi kartı 30.000 TL + Denizbank yapılandırma ilk taksit 10.700 TL + Kredi 1 son taksit 10.757 TL + Kredi 2 9.121 TL)

Abonelik aylık toplam: ${subscriptionTotal.toLocaleString('tr-TR')} TL
Planlanan giderler aylık yük: ~${plannedTotal.toLocaleString('tr-TR')} TL
(Saz kursu 800 TL + Digital Academy 1.800 TL + Spor salonu 3 aylık 5.000 TL)

Kanama alanları: taksitli e-ticaret ~35.700 TL+, AI/SaaS ~11.200 TL, yemek siparişi ~4.900 TL.

Haziran kuralı: Yeni borç yok. Yeni taksit yok. Yeni araç aboneliği yok.

Bu duruma göre kısa finans analizi yap. Denizbank'tan sadece borç servisi olarak bahset.`;

    const response = await callOpenRouter(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      { temperature: 0.2, maxTokens: 700 }
    );

    if (!response) return NextResponse.json(FALLBACK);

    const parsed = extractJSON(response);
    if (!parsed) return NextResponse.json(FALLBACK);

    const result = parsed as Record<string, unknown>;

    return NextResponse.json({
      status: String(result.status ?? 'critical'),
      summary: String(result.summary ?? FALLBACK.summary),
      recommendedActions: Array.isArray(result.recommendedActions) ? (result.recommendedActions as unknown[]).map(String) : [],
      avoidThisMonth: Array.isArray(result.avoidThisMonth) ? (result.avoidThisMonth as unknown[]).map(String) : [],
      subscriptionActions: Array.isArray(result.subscriptionActions) ? (result.subscriptionActions as unknown[]).map(String) : [],
      debtServiceNotes: Array.isArray(result.debtServiceNotes) ? (result.debtServiceNotes as unknown[]).map(String) : [],
      bleedingWarnings: Array.isArray(result.bleedingWarnings) ? (result.bleedingWarnings as unknown[]).map(String) : [],
      assistantNote: String(result.assistantNote ?? FALLBACK.assistantNote),
    });
  } catch {
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}
