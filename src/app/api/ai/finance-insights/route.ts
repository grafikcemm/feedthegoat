import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, extractJSON } from "@/lib/openrouter";

const FINANCE_SYSTEM_PROMPT = `Sen Feed The Goat uygulamasında Cem'in kişisel finans danışmanısın.

Cem'in finans durumunu analiz et. Kısa, net ve baskısız öneriler ver.

Kurallar:
- Uzun finans dersi verme.
- Kısa ve net öneriler üret.
- Kullanıcıyı suçlama.
- Gereksiz harcama baskısı kurma.
- Borç bilgisi eksikse tahmin yapma.
- Denizbank bilgileri eksikse "bilgi bekleniyor" de.
- Spor salonu 5000 TL / 3 ay = aylık ~1667 TL olarak hesapla.
- Saz kursu 800 TL ve Digital Academy 1800 TL'yi eğitim yatırımı olarak değerlendir.
- Aynı ay içinde çok fazla eğitim/spor harcaması varsa uyar.
- Finansal tavsiye olarak kesin yatırım/borç yönlendirmesi yapma; bütçe farkındalığı sağla.
- Cevabın Türkçe olsun.

SADECE geçerli JSON döndür:
{
  "status": "safe" | "attention" | "critical",
  "summary": "kısa durum özeti (max 120 karakter)",
  "recommendedActions": ["aksiyon 1", "aksiyon 2"],
  "avoidThisMonth": ["kaçınılacak şey 1"],
  "plannedPayments": ["planlanan ödeme 1"],
  "missingInfo": ["eksik bilgi 1"],
  "assistantNote": "Cem'e kısa not (max 100 karakter)"
}`;

interface PlannedExpenseInput {
  title: string;
  amount?: number;
  monthlyAmount: number;
  status: string;
  category: string;
}

export async function POST(req: NextRequest) {
  try {
    const { totalIncome, totalExpense, plannedExpenses } = await req.json() as {
      totalIncome: number;
      totalExpense: number;
      plannedExpenses: PlannedExpenseInput[];
    };

    const plannedMonthlyTotal = plannedExpenses
      .filter(e => e.status !== "waiting_info")
      .reduce((sum, e) => sum + (e.monthlyAmount || 0), 0);

    const hasMissingInfo = plannedExpenses.some(e => e.status === "waiting_info");

    const userMessage = `Cem'in mevcut aylık finansal durumu:
- Toplam gelir: ${totalIncome.toLocaleString("tr-TR")} TL
- Mevcut gider: ${totalExpense.toLocaleString("tr-TR")} TL
- Net: ${(totalIncome - totalExpense).toLocaleString("tr-TR")} TL

Planlanan ek giderler:
${plannedExpenses.map(e =>
  `- ${e.title}: ${e.amount ? e.amount.toLocaleString("tr-TR") + " TL" : "tutar bilinmiyor"} (aylık karşılık: ~${e.monthlyAmount.toLocaleString("tr-TR")} TL) [${e.status}]`
).join("\n")}

Planlanan giderlerin toplam aylık karşılığı: ~${plannedMonthlyTotal.toLocaleString("tr-TR")} TL
${hasMissingInfo ? "NOT: Bazı kalemler için bilgi eksik (örn. Denizbank yapılandırma)." : ""}

Bu duruma göre kısa finans analizi yap.`;

    const response = await callOpenRouter([
      { role: "system", content: FINANCE_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ], {
      temperature: 0.2,
      maxTokens: 600,
    });

    if (!response) {
      return NextResponse.json(getFallbackInsight(totalIncome, totalExpense, plannedMonthlyTotal, hasMissingInfo));
    }

    const parsed = extractJSON(response);
    if (!parsed) {
      return NextResponse.json(getFallbackInsight(totalIncome, totalExpense, plannedMonthlyTotal, hasMissingInfo));
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      getFallbackInsight(0, 0, 0, false),
      { status: 200 }
    );
  }
}

function getFallbackInsight(income: number, expense: number, plannedMonthly: number, hasMissingInfo: boolean) {
  const net = income - expense;
  const projectedNet = net - plannedMonthly;

  return {
    status: projectedNet < 0 ? "critical" : projectedNet < income * 0.2 ? "attention" : "safe",
    summary: "Mevcut verilere göre planlanan giderler değerlendiriliyor.",
    recommendedActions: [
      "Denizbank yapılandırma detaylarını gir.",
      "Spor salonu kaydını tatil sonrası yap.",
    ],
    avoidThisMonth: [
      "Aynı ay içinde spor + iki eğitim harcamasını sıkıştırma.",
    ],
    plannedPayments: [
      "Spor salonu: 5.000 TL / 3 ay",
      "Saz kursu: 800 TL/ay",
      "Digital Academy: 1.800 TL",
    ],
    missingInfo: hasMissingInfo ? ["Denizbank yapılandırma tutarı ve ödeme günü"] : [],
    assistantNote: "Önce sabit giderlerini sabitle, sonra ek harcamalara geç.",
  };
}
