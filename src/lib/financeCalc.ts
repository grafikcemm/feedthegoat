export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  totalSubscriptions: number;
  net: number;
}

export function computeFinanceSummary(
  income: number,
  expense: number,
  subscriptions: number
): FinanceSummary {
  return {
    totalIncome: income,
    totalExpense: expense,
    totalSubscriptions: subscriptions,
    net: income - expense - subscriptions,
  };
}

export type StatusSeverity = "positive" | "neutral" | "warning" | "danger";

export interface StatusInfo {
  label: string;
  description: string;
  severity: StatusSeverity;
}

export function computeStatus(net: number): StatusInfo {
  if (net > 0)
    return {
      label: "Pozitif Nakit Akışı",
      description: "Gelirin giderlerini karşılıyor. Fazlayı Savaş Fonuna aktar.",
      severity: "positive",
    };
  if (net === 0)
    return {
      label: "Dengede",
      description: "Gelir ve gider eşit. Büyüme için gelir artışı gerek.",
      severity: "neutral",
    };
  if (net > -10000)
    return {
      label: "Dikkat: Negatif Bakiye",
      description: "Küçük bir açık var. Gereksiz abonelikleri gözden geçir.",
      severity: "warning",
    };
  return {
    label: "Durum Bilgisi: Nakit Açığı",
    description:
      "Giderler geçici olarak gelirini aşmış durumda. Panik yapmadan önce abonelikleri ve gereksiz küçük harcamaları optimize edebilirsin.",
    severity: "danger",
  };
}
