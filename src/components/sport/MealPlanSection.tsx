import React from 'react';

interface MealItem {
  name: string;
  amount: string;
  protein_g: number;
  note?: string;
}

interface MealPlan {
  id: string;
  meal_time: string;
  meal_label: string;
  items: MealItem[];
  total_protein_g: number;
  sort_order: number;
}

interface MealPlanSectionProps {
  meals: MealPlan[];
}

export function MealPlanSection({ meals }: MealPlanSectionProps) {
  const dailyTotalProtein = meals.reduce((sum, meal) => sum + meal.total_protein_g, 0);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-mono text-[10px] tracking-widest text-ftg-text-mute uppercase">
          BESLENME PROGRAMI
        </h3>
        <label className="font-mono text-[10px] text-ftg-success/80 bg-ftg-success/10 px-2 py-0.5 rounded border border-ftg-success/20">
          DAILY PLAN
        </label>
      </div>

      <div className="flex flex-col gap-4">
        {meals.map((meal) => (
          <div 
            key={meal.id}
            className="bg-ftg-bg-card border border-ftg-border rounded-xl p-4 shadow-xl hover:border-ftg-accent/30 transition-colors"
          >
            {/* Meal Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-ftg-border-subtle">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg text-ftg-text-bright tracking-tight uppercase">
                  {meal.meal_label}
                </span>
                <span className="font-mono text-[10px] text-ftg-text-mute tracking-widest">
                  · {meal.meal_time}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-ftg-accent">
                  {meal.total_protein_g}<span className="text-[10px] ml-0.5 font-normal text-ftg-text-mute">g</span>
                </span>
                <span className="text-[8px] font-mono text-ftg-text-mute uppercase tracking-tighter">PROTO</span>
              </div>
            </div>

            {/* Meal Items */}
            <div className="space-y-3">
              {meal.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between group">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm text-ftg-text tracking-tight group-hover:text-ftg-text-bright transition-colors">
                        {item.name}
                      </span>
                      {item.amount && (
                        <span className="text-[10px] text-ftg-text-dim font-mono bg-ftg-surface px-1.5 py-0.5 rounded border border-ftg-border-subtle">
                          {item.amount}
                        </span>
                      )}
                    </div>
                    {item.note && (
                      <span className="text-[10px] text-ftg-text-dim italic mt-0.5 opacity-80 leading-tight">
                        {item.note}
                      </span>
                    )}
                  </div>
                  {item.protein_g > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono font-bold text-ftg-text-dim group-hover:text-ftg-accent transition-colors">
                        {item.protein_g}
                      </span>
                      <span className="text-[9px] font-mono text-ftg-text-mute">g</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Total Summary */}
      <div className="mt-4 p-4 rounded-xl border border-ftg-border bg-ftg-surface/30 flex items-center justify-center gap-2">
        <span className="text-sm text-ftg-text-mute italic">~</span>
        <span className="text-xl font-display text-ftg-accent tracking-tighter">
          {dailyTotalProtein} g
        </span>
        <span className="text-[11px] font-mono text-ftg-text-dim uppercase tracking-widest mt-1">protein / gün</span>
      </div>
    </div>
  );
}
