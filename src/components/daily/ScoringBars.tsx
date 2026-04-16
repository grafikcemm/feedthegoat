import React from "react";
import { cn } from "@/utils/cn";

interface ScoringBarsProps {
  disciplineScore: number;
  disciplineMax: number;
  healthScore: number;
  healthMax: number;
  productionDone: number;
  productionTotal: number;
}

export function ScoringBars({ 
  disciplineScore, 
  disciplineMax, 
  healthScore, 
  healthMax, 
  productionDone, 
  productionTotal 
}: ScoringBarsProps) {
  const bars = [
    { label: "DİSİPLİN", current: disciplineScore, max: disciplineMax, color: "bg-[#e8b86d]" },
    { label: "ÜRETİM", current: productionDone, max: productionTotal, color: "bg-[#6ee7a0]" },
    { label: "SAĞLIK", current: healthScore, max: healthMax, color: "bg-[#fb923c]" },
  ];

  return (
    <div className="bg-white border border-[#E5DDD4] rounded-2xl px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-[#E5DDD4]/60 pb-3">
        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#B5A090]">
          SİSTEM DURUMU
        </span>
        <div className="flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 rounded-full bg-[#E8956D] animate-pulse" />
           <span className="text-[#E8956D] text-[9px] font-extrabold uppercase tracking-widest">CANLI</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {[
          { label: "DİSİPLİN", current: disciplineScore, max: disciplineMax, color: "bg-[#E8956D]" },
          { label: "ÜRETİM", current: productionDone, max: productionTotal, color: "bg-[#4CAF82]" },
          { label: "SAĞLIK", current: healthScore, max: healthMax, color: "bg-[#F5A623]" },
        ].map((bar) => (
          <div key={bar.label} className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#B5A090]">
                {bar.label}
              </span>
              <span className="text-xs font-semibold text-[#2C2420]">
                {bar.current} / {bar.max}
              </span>
            </div>
            {/* Bar Track */}
            <div className="w-full bg-[#F0EBE3] rounded-full h-1.5">
              <div 
                className={cn("h-1.5 rounded-full transition-all duration-1000 ease-out", bar.color)}
                style={{ width: `${bar.max > 0 ? Math.min((bar.current / bar.max) * 100, 100) : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
