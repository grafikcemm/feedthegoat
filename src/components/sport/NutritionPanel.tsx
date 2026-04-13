import React from "react";
import { NutritionStat } from "./NutritionStat";

interface NutritionPanelProps {
  todayProtein: number;
  todayCalories: number;
  todayWater: number;
  proteinTarget: number;
  calorieTarget: number;
  waterTarget: number;
  avgProtein: number;
  avgCalories: number;
  avgWater: number;
}

export function NutritionPanel({
  todayProtein,
  todayCalories,
  todayWater,
  proteinTarget,
  calorieTarget,
  waterTarget,
  avgProtein,
  avgCalories,
  avgWater,
}: NutritionPanelProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-4">
        BESLENME
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NutritionStat
          label="PROTEİN"
          value={todayProtein}
          unit="g"
          target={proteinTarget}
          weeklyAvg={avgProtein}
        />
        <NutritionStat
          label="KALORİ"
          value={todayCalories}
          unit=""
          target={calorieTarget}
          weeklyAvg={avgCalories}
          prefix="~"
        />
      </div>
    </div>
  );
}
