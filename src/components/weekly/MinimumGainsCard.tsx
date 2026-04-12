"use client";

import React, { useTransition } from "react";
import { toggleWeeklyGain } from "@/app/actions/toggleWeeklyGain";

interface Gain {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface MinimumGainsCardProps {
  gains: Gain[];
  completedCount: number;
}

export function MinimumGainsCard({ gains, completedCount }: MinimumGainsCardProps) {
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
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-ftg-border-subtle">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
          MİNİMUM KAZANIMLAR
        </span>
        <span className="font-mono text-xs text-ftg-amber">
          {completedCount}/5 Tamamlandı
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {gains.map((gain) => (
          <button
            key={gain.id}
            onClick={() => handleToggle(gain.id)}
            disabled={isPending}
            className={`flex items-center gap-3 px-4 py-3 rounded-ftg-card border transition-all text-left group ${
              gain.isCompleted
                ? "border-ftg-success/40 bg-ftg-success/5"
                : "border-ftg-border-subtle bg-ftg-bg hover:border-ftg-amber/40"
            } active:scale-[0.98] disabled:opacity-70`}
          >
            <div
              className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                gain.isCompleted
                  ? "bg-ftg-success border-ftg-success"
                  : "border-ftg-border-strong group-hover:border-ftg-amber/60"
              }`}
            >
              {gain.isCompleted && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-in zoom-in duration-300">
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className={`font-mono text-sm transition-all ${
                gain.isCompleted
                  ? "text-ftg-text-dim line-through decoration-ftg-success/30"
                  : "text-ftg-text"
              }`}
            >
              {gain.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
