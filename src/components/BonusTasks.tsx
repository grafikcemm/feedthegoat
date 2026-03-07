"use client";

import { useState, useEffect } from "react";

export default function BonusTasks() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

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

  const ITEMS = [
    { id: "bn-walk", label: "Sabah 20 dk koşu bandı yürüyüş" },
    { id: "bn-english", label: "Fielse'den 1 ders İngilizce" },
    { id: "bn-share", label: "Twitter'da haber paylaşımı" },
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
        {ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
              checked[item.id]
                ? "border-text bg-surface/5"
                : "border-border bg-surface/20 hover:border-text-muted"
            }`}
          >
            <div
              className={`w-6 h-6 shrink-0 flex items-center justify-center border-2 transition-colors ${
                checked[item.id]
                  ? "border-text bg-text text-background"
                  : "border-border bg-transparent text-transparent"
              }`}
            >
              <span className="text-xs font-bold">✓</span>
            </div>
            <span
              className={`text-xs md:text-sm font-bold select-none truncate ${
                checked[item.id] ? "line-through text-text-muted opacity-70" : "text-text"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
