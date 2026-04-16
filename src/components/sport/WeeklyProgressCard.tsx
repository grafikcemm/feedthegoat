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
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 border-l-4 border-l-[#6366f1] shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[#666666] text-[10px] tracking-[0.2em] uppercase font-bold">
            HAFTALIK İLERLEME
          </div>
          <div className="text-[#666666]/70 text-[10px] mt-1 uppercase tracking-tight font-medium">
            3 zorunlu gün = Başarı. Cumartesi = Bonus.
          </div>
        </div>
      </div>
      <div className="flex gap-12">
        <div className="flex-1">
          <div className="text-[9px] tracking-[0.15em] uppercase text-[#666666] mb-2 font-bold">
            ZORUNLU GÜN
          </div>
          <div className="text-4xl text-[#6366f1] font-bold flex items-baseline gap-2 font-sans">
            {requiredCompleted}
            <span className="text-[#2a2a2a] text-xl font-medium">/</span>
            <span className="text-[#666666] text-xl font-medium">{requiredTotal}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[9px] tracking-[0.15em] uppercase text-[#666666] mb-2 font-bold">
            BONUS GÜN
          </div>
          <div className="text-4xl text-[#6366f1] font-bold flex items-baseline gap-2 font-sans">
            {bonusCompleted}
            <span className="text-[#2a2a2a] text-xl font-medium">/</span>
            <span className="text-[#666666] text-xl font-medium">{bonusTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
