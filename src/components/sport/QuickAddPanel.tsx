"use client";

import React, { useTransition } from "react";
import { addNutrition } from "@/app/actions/addNutrition";

interface QuickItem {
  id: string;
  title: string;
  protein_g: number;
  calories: number;
}

interface QuickAddPanelProps {
  items: QuickItem[];
}

export function QuickAddPanel({ items }: QuickAddPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleAdd = (itemId: string) => {
    startTransition(async () => {
      try {
        await addNutrition({ quickItemId: itemId });
      } catch (err) {
        console.error("Failed to add nutrition:", err);
      }
    });
  };

  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-4">
        HIZLI EKLE
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAdd(item.id)}
            disabled={isPending}
            className="w-full px-4 py-3 rounded-ftg-card border border-ftg-border-subtle bg-ftg-bg text-left font-mono text-xs text-ftg-text hover:border-ftg-amber/40 hover:bg-ftg-elevated/50 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <span className="flex items-center justify-between">
              <span>+ {item.title}</span>
              <span className="text-ftg-text-mute group-hover:text-ftg-amber transition-colors">
                {item.protein_g}g | {item.calories}kcal
              </span>
            </span>
          </button>
        ))}

        {items.length === 0 && (
          <div className="font-mono text-xs text-ftg-text-mute italic">
            Hızlı eklenecek öğe bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
