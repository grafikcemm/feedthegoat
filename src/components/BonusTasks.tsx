"use client";

import { useState, useEffect } from "react";

interface BonusItem {
  id: string;
  label: string;
  activeDays?: number[]; // Days of week (0=Sunday, 1=Monday, etc.)
}

export default function BonusTasks() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [currentDay, setCurrentDay] = useState(new Date().getDay());

  useEffect(() => {
    setTimeout(() => {
      setCurrentDay(new Date().getDay());
    }, 0);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("goat-bonus-tasks-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
      "goat-bonus-tasks-v1",
      JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        data: newChecked,
      })
    );
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  const ITEMS: BonusItem[] = [
    { id: "bn-walk", label: "Sabah 20 dk koşu bandı yürüyüş", activeDays: [2, 3, 5] }, // Salı, Çarşamba, Cuma
    { id: "bn-english", label: "Fielse'den 1 ders İngilizce", activeDays: [0, 1, 4, 6] }, // Pzt, Per, Cmt, Pzr
    { id: "bn-share", label: "2 hesabında tweet paylaşımları" },
    { id: "bn-course", label: "Yüz bakımı yap" },
  ];

  return (
    <section className="mt-6 border border-border bg-surface/10 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text">
          Enerji Varsa
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">
          &ldquo;Bunlar bonus. Zorunlu değil.&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ITEMS.map((item) => {
          const isDisabled = item.activeDays && !item.activeDays.includes(currentDay);
          const needsAction = item.activeDays && !isDisabled && !checked[item.id];
          
          return (
            <div
              key={item.id}
              onClick={() => !isDisabled && toggle(item.id)}
              className={`relative flex items-center gap-3 p-3 border transition-colors ${
                isDisabled 
                  ? "opacity-50 cursor-not-allowed border-border bg-surface/10" 
                  : "cursor-pointer"
              } ${
                !isDisabled && checked[item.id]
                  ? "border-text bg-surface/5"
                  : !isDisabled 
                    ? `border-border bg-surface/20 hover:border-text-muted ${needsAction ? 'animate-pulse border-accent-red/50 shadow-[0_0_10px_rgba(255,59,59,0.2)]' : ''}`
                    : ""
              }`}
            >
              <div
                className={`w-6 h-6 shrink-0 flex items-center justify-center border-2 transition-colors ${
                  checked[item.id] && !isDisabled
                    ? "border-text bg-text text-background"
                    : "border-border bg-transparent text-transparent"
                }`}
              >
                <span className="text-xs font-bold">✓</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className={`text-xs md:text-sm font-bold select-none truncate ${
                    isDisabled 
                      ? "text-text-muted" 
                      : checked[item.id] 
                        ? "line-through text-text-muted opacity-70" 
                        : "text-text"
                  }`}
                >
                  {item.label}
                </span>
                {/* "Bugün değil" label for disabled days */}
                {isDisabled && (
                  <span 
                    className="text-[10px] font-medium mt-0.5"
                    style={{ color: "#666666" }}
                  >
                    Bugün değil
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
