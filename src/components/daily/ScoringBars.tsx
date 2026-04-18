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
  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border-subtle)]">
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
          SİSTEM DURUMU
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500 text-[9px] font-extrabold uppercase tracking-widest">CANLI</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {[
          { label: "DİSİPLİN",  current: disciplineScore,  max: disciplineMax,    opacity: 1.0 },
          { label: "ÜRETİM",    current: productionDone,   max: productionTotal,  opacity: 0.8 },
          { label: "SAĞLIK",    current: healthScore,       max: healthMax,        opacity: 0.6 },
        ].map((bar) => (
          <div key={bar.label} className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--text-tertiary)]">
                {bar.label}
              </span>
              <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">
                {bar.current} / {bar.max}
              </span>
            </div>
            <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5 border border-[var(--border-subtle)]">
              <div
                className="h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${bar.max > 0 ? Math.min((bar.current / bar.max) * 100, 100) : 0}%`,
                  backgroundColor: `rgba(250,250,250,${bar.opacity})`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
