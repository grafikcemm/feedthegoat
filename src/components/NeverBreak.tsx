"use client";

import { useState, useEffect } from "react";

export default function NeverBreak() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [currentDay, setCurrentDay] = useState(new Date().getDay());

  useEffect(() => {
    setTimeout(() => {
      setCurrentDay(new Date().getDay());
    }, 0);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("goat-never-break-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only load if it's the same day
        if (parsed.date === new Date().toISOString().split("T")[0]) {
          setTimeout(() => {
            setChecked(parsed.data || {});
          }, 0);
        }
      } catch { }
    }
  }, []);

  const toggle = (id: string) => {
    const newChecked = { ...checked, [id]: !checked[id] };
    setChecked(newChecked);
    localStorage.setItem(
      "goat-never-break-v1",
      JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        data: newChecked,
      })
    );
    // Dispatch event to recalculate score
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  const ITEMS = [
    { id: "nb-morning", label: "06:30 Uyanış + Limonlu Su + Yüze Buz" },
    { id: "nb-teeth", label: "Dişlerini fırçala + listerine gargara yap" },
    { id: "nb-deepwork", label: "Vitaminlerin tamamını iç" },
    { id: "nb-sports", label: "Antrenman (Pzt-Sal-Per-Cum)", activeDays: [1, 2, 4, 5] },
  ];

  return (
    <section className="mt-6 border border-border bg-surface/10 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text">
          Asla Kırma
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">
          &ldquo;Zinciri değil, kimliğini koru.&rdquo;
        </p>
      </div>

      <div className="space-y-3">
        {ITEMS.map((item) => {
          const isDisabled = item.activeDays && !item.activeDays.includes(currentDay);
          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isDisabled) toggle(item.id);
              }}
              className={`flex items-center gap-4 p-3 border transition-colors ${
                isDisabled ? "opacity-30 cursor-not-allowed border-border" : "cursor-pointer"
              } ${
                checked[item.id]
                  ? "border-text bg-surface/5"
                  : "border-border bg-surface/20 hover:border-text-muted"
              }`}
            >
              <div
                className={`w-11 h-11 shrink-0 flex items-center justify-center border-2 transition-colors ${
                  checked[item.id]
                    ? "border-text bg-text text-background"
                    : "border-border bg-transparent text-transparent"
                }`}
              >
                <span className="text-xl font-bold">✓</span>
              </div>
              <span
                className={`text-sm md:text-base font-bold select-none ${
                  checked[item.id] ? "line-through text-text-muted opacity-70" : "text-text"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
