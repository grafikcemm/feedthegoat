'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabaseClient';
import { MealPlanSection } from '@/components/sport/MealPlanSection';

export function NutritionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      const supabase = createBrowserSupabase();
      const { data } = await supabase
        .from("meal_plan")
        .select("id, meal_time, meal_label, items, total_protein_g, sort_order")
        .order("sort_order", { ascending: true });
      
      if (data) setMeals(data);
      setLoading(false);
    }
    fetchMeals();
  }, []);

  const totalProtein = meals.reduce((sum, m) => sum + (m.total_protein_g || 0), 0);

  return (
    <div className="bg-[var(--bg-card)] rounded-[20px] border border-[var(--border-subtle)] overflow-hidden transition-all duration-300 shadow-sm">
      {/* Kapalı / Header Modu */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-card-elevated)] transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <span className="uppercase tracking-wider text-[11px] text-[var(--text-tertiary)] font-bold">
            BESLENME
          </span>
          <div className="text-[var(--text-secondary)] text-[14px] truncate">
            {totalProtein}g protein hedefi · <span className="text-[var(--text-tertiary)] italic">Sıradaki: Whey 12:30</span>
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp size={16} className="text-[var(--text-tertiary)]" />
          ) : (
            <ChevronDown size={16} className="text-[var(--text-tertiary)]" />
          )}
        </div>
      </div>

      {/* Açık Mod İçerik */}
      {isOpen && (
        <div className="px-5 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="border-t border-[var(--border-subtle)] pt-6">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-20 bg-[var(--bg-primary)] rounded-xl" />
                <div className="h-20 bg-[var(--bg-primary)] rounded-xl" />
              </div>
            ) : (
              <MealPlanSection meals={meals} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
