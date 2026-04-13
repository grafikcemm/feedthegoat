"use client";

import React, { useTransition, useState } from "react";
import { cn } from "@/utils/cn";
import { setEnergy } from "@/app/actions/setEnergy";

export function EnergyCheckIn({ currentEnergy }: { currentEnergy: "LOW" | "MID" | "HIGH" | null }) {
  const [isPending, startTransition] = useTransition();
  // We use local state for optimistic UI updates, initialized with the prop 
  const [active, setActive] = useState<"LOW" | "MID" | "HIGH">(currentEnergy || "MID");

  const buttons = [
    { label: "DÜŞÜK", value: "LOW" as const },
    { label: "ORTA", value: "MID" as const },
    { label: "YÜKSEK", value: "HIGH" as const },
  ];

  const handleSetEnergy = (value: "LOW" | "MID" | "HIGH") => {
    setActive(value);
    startTransition(() => {
      setEnergy({ energy: value });
    });
  };

  return (
    <div className="bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card p-6">
      <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-5 text-center">
        BUGÜNÜN ENERJİSİ
      </h3>
      <div className="flex gap-3">
        {buttons.map((btn) => {
          const isActive = btn.value === active;
          return (
            <button
              key={btn.value}
              onClick={() => handleSetEnergy(btn.value)}
              className={cn(
                "flex-1 py-4 border font-mono text-xs tracking-widest transition-all duration-300",
                isActive
                  ? "border-ftg-amber bg-ftg-amber-glow text-ftg-amber rounded-ftg-card shadow-lg shadow-ftg-amber/10"
                  : "border-ftg-border-subtle text-ftg-text-mute hover:text-ftg-text-dim hover:border-ftg-border-strong rounded-ftg-card"
              )}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
