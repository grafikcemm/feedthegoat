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
    <div className="flex items-center justify-between px-10 py-6 bg-white border-b border-[#E5DDD4] shadow-sm">
      {/* Left side — Brand block */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold tracking-tight text-[#2C2420]">
          FEED <span className="text-[#E8956D]">THE</span> GOAT.
        </h1>
        <span className="text-xs font-normal text-[#B5A090] mt-1">
          {dateStr}
        </span>
      </div>

      {/* Right side — Three meta pills */}
      <div className="hidden md:flex items-center gap-10">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-medium tracking-widest uppercase text-[#C8B8A8]">
            SEVİYE
          </span>
          <span className="text-sm font-bold text-[#E8956D]">
            {stageLabel}
          </span>
        </div>

        <div className="h-8 w-px bg-[#E5DDD4]/60" />

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-medium tracking-widest uppercase text-[#C8B8A8]">
            STREAK
          </span>
          <span className="text-sm font-bold text-[#E8956D]">
            {state.current_streak} GÜN
          </span>
        </div>

        <div className="h-8 w-px bg-[#E5DDD4]/60" />

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-medium tracking-widest uppercase text-[#C8B8A8]">
            FAZ
          </span>
          <span className="text-sm font-bold text-[#E8956D]">
            {phaseLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
