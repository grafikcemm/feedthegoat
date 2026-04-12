import React from "react";
import { STAGE_LABELS, type GoatStage } from "@/lib/goatState";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export interface GoatState {
  current_stage: GoatStage;
  current_streak: number;
  consistency_days: number;
}

export function TopBar({ state }: { state: GoatState }) {
  // Safe default stage label if invalid
  const stageLabel = STAGE_LABELS[state.current_stage] || STAGE_LABELS["OGLAK"];
  
  // Basic phase mapping
  const phaseLabel = `${String(state.consistency_days <= 30 ? "01" : state.consistency_days <= 90 ? "02" : "03").padStart(2, "0")} — DAĞIN ETEĞİ`;

  const dateStr = format(new Date(), "dd MMMM yyyy EEEE", { locale: tr }).toUpperCase();

  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-ftg-border-subtle">
      {/* Left side — Brand block */}
      <div className="flex flex-col">
        <h1 className="font-display text-2xl tracking-wide text-ftg-text">
          FEED THE GOAT.
        </h1>
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mt-1">
          {dateStr}
        </span>
      </div>

      {/* Right side — Three meta pills */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute">
            SEVİYE
          </span>
          <span className="font-mono text-xs text-ftg-amber mt-1">
            {stageLabel}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute">
            STREAK
          </span>
          <span className="font-mono text-xs text-ftg-amber mt-1">
            {state.current_streak} GÜN
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute">
            FAZ
          </span>
          <span className="font-mono text-xs text-ftg-amber mt-1">
            {phaseLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
