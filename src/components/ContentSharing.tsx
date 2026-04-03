"use client";

import { useState, useEffect } from "react";

interface ShareItem {
  id: string;
  label: string;
}

export default function ContentSharing() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("goat-content-sharing-v1");
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

  const toggle = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
    const newChecked = { ...checked, [id]: !checked[id] };
    setChecked(newChecked);
    localStorage.setItem(
      "goat-content-sharing-v1",
      JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        data: newChecked,
      })
    );
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  const ITEMS: ShareItem[] = [
    { id: "cs-grafikcem-x", label: "Grafikcem X hesabında paylaşım" },
    { id: "cs-maskulenkod-x", label: "Maskülenkod X hesabında paylaşım" },
    { id: "cs-grafikcem-linkedin", label: "Grafikcem LinkedIn hesabında paylaşım" },
  ];

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-wide text-text mb-1 flex items-center gap-2">
          İçerik Paylaşımı
        </h2>
        <p className="text-xs text-text-muted">
          Marka inşası için her gün yapılması gereken yayınlar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ITEMS.map((item) => {
          const isDone = checked[item.id];
          
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`relative flex items-center justify-between p-4 border transition-all cursor-pointer ${
                isDone 
                  ? "border-transparent bg-surface/30" 
                  : "border-border bg-surface hover:bg-surface-hover"
              }`}
            >
              <div className="flex flex-col flex-1 min-w-0 pr-4">
                <span
                  className={`text-sm font-medium truncate ${
                    isDone 
                      ? "line-through text-text-muted opacity-50" 
                      : "text-text"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              <button
                onClick={(e) => toggle(item.id, e)}
                className={`w-8 h-8 shrink-0 flex items-center justify-center border transition-colors ${
                  isDone
                    ? "border-accent-green bg-accent-green text-black"
                    : "border-border bg-transparent text-transparent hover:border-text-muted"
                } rounded-sm`}
              >
                <span className="text-sm font-bold">✓</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
