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
    <div className="flex flex-col gap-4 bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card p-6">
      <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-2">
        SİSTEM DURUMU
      </h3>
      
      <div className="flex flex-col gap-5">
        {/* DİSİPLİN */}
        {disciplineMax > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ftg-text-mute">
                DİSİPLİN
              </span>
              <span className="font-mono text-[10px] text-ftg-amber">
                {disciplineScore}/{disciplineMax}
              </span>
            </div>
            <div className="w-full h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
              <div
                className="bg-ftg-amber h-full transition-all duration-500 ease-out"
                style={{ width: `${(disciplineScore / disciplineMax) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* ÜRETİM */}
        {productionTotal > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ftg-text-mute">
                ÜRETİM
              </span>
              <span className="font-mono text-[10px] text-ftg-text-bright">
                {productionDone}/{productionTotal}
              </span>
            </div>
            <div className="w-full h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${(productionDone / productionTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* SAĞLIK */}
        {healthMax > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ftg-text-mute">
                SAĞLIK
              </span>
              <span className="font-mono text-[10px] text-ftg-success">
                {healthScore}/{healthMax}
              </span>
            </div>
            <div className="w-full h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
              <div
                className="bg-ftg-success h-full transition-all duration-500 ease-out"
                style={{ width: `${(healthScore / healthMax) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
