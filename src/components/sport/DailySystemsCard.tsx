import React from "react";

interface DailySystemsCardProps {
  ceo_breakfast_note: string | null;
}

export function DailySystemsCard({ ceo_breakfast_note }: DailySystemsCardProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-4">
        GÜNLÜK SİSTEMLER
      </div>
      <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-bg p-4 border-l-2 border-l-ftg-amber/40">
        <div className="font-mono text-sm text-ftg-text font-medium mb-1">
          CEO Breakfast (Intermittent Fasting)
        </div>
        <div className="font-mono text-xs text-ftg-text-dim leading-relaxed">
          {ceo_breakfast_note || "CEO Kahvaltısı: Sadece siyah kahve veya maden suyu ile 16:8 oruç düzeni."}
        </div>
      </div>
    </div>
  );
}
