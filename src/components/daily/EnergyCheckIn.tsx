"use client";

import React, { useTransition, useState } from "react";
import { cn } from "@/utils/cn";
import { setEnergy } from "@/app/actions/setEnergy";

interface EnergyCheckInProps {
  currentEnergy: "LOW" | "MID" | "HIGH" | null;
  onSelect?: (val: "LOW" | "MID" | "HIGH") => void;
}

export function EnergyCheckIn({ currentEnergy, onSelect }: EnergyCheckInProps) {
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState<"LOW" | "MID" | "HIGH">(currentEnergy || "MID");

  const buttons = [
    { label: "DÜŞÜK", value: "LOW" as const },
    { label: "ORTA",  value: "MID" as const },
    { label: "YÜKSEK", value: "HIGH" as const },
  ];

  const handleSetEnergy = (value: "LOW" | "MID" | "HIGH") => {
    setActive(value);
    onSelect?.(value);
    startTransition(() => { setEnergy({ energy: value }); });
  };

  return (
    <div className="w-full relative">
      <h3 className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)] mb-4 text-center">
        BUGÜNÜN ENERJİSİ
      </h3>
      <div className="flex gap-2">
        {buttons.map((btn) => {
          const isActive = btn.value === active;
          return (
            <button
              key={btn.value}
              onClick={() => handleSetEnergy(btn.value)}
              className={cn(
                "flex-1 py-2.5 text-center text-xs font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-white/10 border border-white/20 text-white font-semibold"
                  : "bg-[var(--bg-card-elevated)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] hover:bg-white/5 hover:text-[var(--text-primary)]"
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
