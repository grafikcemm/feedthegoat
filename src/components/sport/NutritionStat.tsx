import React from "react";

interface NutritionStatProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  weeklyAvg: number;
  prefix?: string;
}

export function NutritionStat({
  label,
  value,
  target,
  unit,
  weeklyAvg,
  prefix = "",
}: NutritionStatProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-bg p-4 flex flex-col items-center text-center">
      <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-2">
        {label}
      </div>
      <div className="font-display text-3xl text-ftg-amber leading-none">
        {value}
      </div>
      <div className="font-mono text-[10px] text-ftg-text-mute mt-1">
        / {prefix}{target}{unit}
      </div>
      <div className="w-full font-mono text-[9px] text-ftg-text-mute mt-3 pt-2 border-t border-ftg-border-subtle">
        7g ort: {Math.round(weeklyAvg)}{unit}
      </div>
    </div>
  );
}
