import React from "react";

interface WeeklyMetricCardProps {
  label: string;
  value: string | number;
  subValue?: string | number;
  total?: number;
}

export function WeeklyMetricCard({ label, value, subValue, total }: WeeklyMetricCardProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-2">
        {label}
      </div>
      <div className="font-display text-4xl text-ftg-amber flex items-baseline gap-2">
        {value} 
        {total !== undefined && (
          <span className="text-ftg-text-mute text-2xl truncate">/ {total}</span>
        )}
      </div>
      {subValue !== undefined && (
        <div className="font-mono text-[10px] text-ftg-text-mute mt-1">
          {subValue}
        </div>
      )}
    </div>
  );
}
