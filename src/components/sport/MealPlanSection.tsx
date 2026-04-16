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
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-[#666666] text-xs font-semibold tracking-widest uppercase">
          BESLENME PROGRAMI
        </h3>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>

      <div className="flex flex-col gap-4">
        {meals.map((meal) => (
          <div 
            key={meal.id}
            className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-sm hover:border-[#6366f1]/30 transition-all"
          >
            {/* Meal Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#2a2a2a]/50">
              <div className="flex flex-col gap-0.5">
                <span className="text-[#6366f1] text-[10px] font-bold tracking-widest uppercase">
                  {meal.meal_label}
                </span>
                <span className="text-[#666666] text-[9px] font-bold tracking-widest uppercase">
                  {meal.meal_time}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#ffffff]">
                    {meal.total_protein_g}
                  </span>
                  <span className="text-[10px] font-bold text-[#666666] uppercase">g</span>
                </div>
                <span className="text-[8px] font-bold text-[#666666] uppercase tracking-widest">PROTEİN</span>
              </div>
            </div>

            {/* Meal Items */}
            <div className="space-y-4">
              {meal.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between group">
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-[#ababab] font-medium tracking-tight">
                        {item.name}
                      </span>
                      {item.amount && (
                        <span className="text-[10px] text-[#ababab] font-bold bg-[#0a0a0a] px-2 py-0.5 rounded-lg border border-[#2a2a2a]">
                          {item.amount}
                        </span>
                      )}
                    </div>
                    {item.note && (
                      <span className="text-[10px] text-[#666666] italic mt-1 font-medium leading-snug">
                        {item.note}
                      </span>
                    )}
                  </div>
                  {item.protein_g > 0 && (
                    <div className="flex items-center gap-1 ml-4 py-1">
                      <span className="text-xs font-bold text-[#ababab]">
                        {item.protein_g}
                      </span>
                      <span className="text-[9px] font-bold text-[#666666]">g</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Total Summary */}
      <div className="mt-4 p-6 rounded-2xl bg-[#141414] border border-[#6366f1]/20 flex flex-col items-center justify-center gap-1 shadow-sm">
        <div className="flex items-baseline gap-1.5">
            <span className="text-3xl text-[#6366f1] font-bold">
              {dailyTotalProtein}g
            </span>
        </div>
        <span className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em]">GÜNLÜK PROTEİN HEDEFİ</span>
      </div>
    </div>
  );
}
