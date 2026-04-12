import React from "react";

interface WeeklyProgressCardProps {
  requiredCompleted: number;
  requiredTotal: number;
  bonusCompleted: number;
  bonusTotal: number;
}

export function WeeklyProgressCard({
  requiredCompleted,
  requiredTotal,
  bonusCompleted,
  bonusTotal,
}: WeeklyProgressCardProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5 border-l-4 border-l-ftg-amber">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
            HAFTALIK İLERLEME
          </div>
          <div className="font-mono text-[10px] text-ftg-text-dim mt-1">
            3 zorunlu gün = Başarılı. Cumartesi = Bonus.
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-1">
            ZORUNLU
          </div>
          <div className="font-display text-4xl text-ftg-amber flex items-baseline gap-2">
            {requiredCompleted}
            <span className="text-ftg-text-mute text-xl">/ {requiredTotal}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-1">
            BONUS
          </div>
          <div className="font-display text-4xl text-ftg-amber flex items-baseline gap-2">
            {bonusCompleted}
            <span className="text-ftg-text-mute text-xl">/ {bonusTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
