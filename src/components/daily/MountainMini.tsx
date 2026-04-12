import React from "react";

export function MountainMini() {
  return (
    <div className="bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card p-5">
      <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-4">
        DAĞDAKİ KONUMUN
      </h3>
      
      <div className="mb-4">
        <svg viewBox="0 0 200 140" className="w-full h-auto">
          <polygon points="20,130 90,40 160,130" fill="#1E1E22" />
          <polygon points="60,130 130,60 200,130" fill="#161619" />
          <line x1="10" y1="95" x2="190" y2="95" stroke="#2A2A30" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="60" cy="95" r="3" fill="#F5B544" />
        </svg>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-ftg-text">
          FAZ 01 · DAĞIN ETEĞİ
        </span>
        <span className="font-mono text-[10px] text-ftg-text-mute">
          GÜN 12 / 30
        </span>
      </div>
    </div>
  );
}
