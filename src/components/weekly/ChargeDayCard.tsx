import React from "react";

interface Ritual {
  id: string;
  title: string;
  description: string | null;
}

interface ChargeDayCardProps {
  rituals: Ritual[];
  isTodayCharge: boolean;
}

export function ChargeDayCard({ rituals, isTodayCharge }: ChargeDayCardProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-ftg-border-subtle">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
          PAZAR — ŞARJ GÜNÜ
        </span>
        {isTodayCharge && (
          <span className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded bg-ftg-amber-glow text-ftg-amber animate-pulse">
            BUGÜN
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {rituals.map((r) => (
          <div key={r.id} className="flex flex-col gap-1 border-l-2 border-ftg-border-subtle pl-4 py-1 hover:border-ftg-amber transition-colors group">
            <span className="font-mono text-sm text-ftg-text group-hover:text-ftg-text-dim transition-colors">
              {r.title}
            </span>
            {r.description && (
              <span className="font-mono text-xs text-ftg-text-mute leading-relaxed">
                {r.description}
              </span>
            )}
          </div>
        ))}

        {rituals.length === 0 && (
          <div className="font-mono text-xs text-ftg-text-mute italic py-4">
            Henüz ritüel tanımlanmamış.
          </div>
        )}
      </div>
    </div>
  );
}
