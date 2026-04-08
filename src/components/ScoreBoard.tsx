"use client";

import React from "react";

interface ScoreBoardProps {
  score: number;
  maxPuan: number;
  percentage: number;
  puanRengi: "red" | "yellow" | "green";
}

export default function ScoreBoard({ score, maxPuan, percentage, puanRengi }: ScoreBoardProps) {
  const colors = {
    red: "#ef4444",
    yellow: "#f59e0b",
    green: "#7C9A72", // accent-sage for success
  };

  const currentColor = colors[puanRengi];

  return (
    <div
      className="p-5 flex flex-col gap-4"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0px",
      }}
    >
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            GÜNÜN SKORU
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tighter" style={{ color: "var(--text-primary)" }}>
              {score}
            </span>
            <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>
              / {maxPuan}p
            </span>
          </div>
        </div>
        <span
          className="text-[11px] font-mono px-2 py-0.5 rounded"
          style={{
            background: `${currentColor}15`,
            color: currentColor,
            border: `1px solid ${currentColor}30`,
          }}
        >
          {percentage >= 100 ? "GOAT MODE" : `${Math.round(percentage)}%`}
        </span>
      </div>

      <div className="relative w-full h-[6px] bg-(--bg-base) overflow-hidden" style={{ borderRadius: "0px" }}>
        <div
          className="absolute top-0 left-0 h-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            background: `linear-gradient(90deg, ${currentColor} 0%, var(--accent-amber) 100%)`,
            boxShadow: `0 0 10px ${currentColor}30`,
          }}
        />
      </div>
    </div>
  );
}
