"use client";

import React, { useTransition } from "react";
import { cn } from "@/utils/cn";
import { toggleWeeklyGain } from "@/app/actions/toggleWeeklyGain";

interface Gain {
  id: string;
  title: string;
  due_day?: string;
  isCompleted: boolean;
}

interface MinimumGainsCardProps {
  gains: Gain[];
  completedCount: number;
  totalCount: number;
}

export function MinimumGainsCard({ gains, completedCount, totalCount }: MinimumGainsCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (gainId: string) => {
    startTransition(async () => {
      try {
        await toggleWeeklyGain({ gainId });
      } catch (err) {
        console.error("Failed to toggle gain:", err);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2a2a2a]/50">
        <span className="text-[#666666] text-[10px] tracking-[0.2em] uppercase font-bold">
          MİNİMUM KAZANIMLAR
        </span>
        <span className="text-[#6366f1] text-[11px] font-bold tracking-widest uppercase">
          {completedCount}/{totalCount} OK
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {gains.map((gain) => (
          <button
            key={gain.id}
            onClick={() => handleToggle(gain.id)}
            disabled={isPending}
            className={cn(
              'flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left group active:scale-[0.98] disabled:opacity-70',
              gain.isCompleted
                ? 'border-[#30d158]/30 bg-[#30d158]'
                : 'border-[#2a2a2a] bg-[#141414] hover:border-[#6366f1]/30 hover:bg-[#0a0a0a]/50 shadow-sm'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-300',
                gain.isCompleted
                  ? 'bg-[#30d158] border-[#30d158] text-white'
                  : 'border-[#2a2a2a] bg-[#141414] group-hover:border-[#6366f1]'
              )}
            >
              {gain.isCompleted && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-in zoom-in duration-300">
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className={cn(
                'text-sm font-semibold transition-all flex-1 tracking-tight',
                gain.isCompleted
                  ? 'text-[#666666] line-through'
                  : 'text-[#ababab]'
              )}
            >
              {gain.title}
            </span>
            {gain.due_day && (
              <span className="text-[9px] text-[#666666] bg-[#0a0a0a] px-2 py-0.5 rounded-lg border border-[#2a2a2a] font-bold uppercase tracking-widest">
                {gain.due_day}
              </span>
            )}
          </button>
        ))}

        {gains.length === 0 && (
          <div className="text-xs text-[#666666] italic py-8 text-center font-medium">
            Bu hafta için kazanım tanımlanmamış.
          </div>
        )}
      </div>
    </div>
  );
}
