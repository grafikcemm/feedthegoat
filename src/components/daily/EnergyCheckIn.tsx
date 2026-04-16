"use client";

import React, { useTransition, useState } from "react";
import { cn } from "@/utils/cn";
import { setEnergy } from "@/app/actions/setEnergy";

export function EnergyCheckIn({ currentEnergy }: { currentEnergy: "LOW" | "MID" | "HIGH" | null }) {
  const [isPending, startTransition] = useTransition();
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

  const getActiveClassName = (val: "LOW" | "MID" | "HIGH") => {
    if (val === "LOW") return "bg-[#ff453a] text-[#ff453a] text-xs font-semibold rounded-xl border border-[#ff453a]/30";
    if (val === "MID") return "bg-[#6366f1] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#6366f1]/30";
    if (val === "HIGH") return "bg-[#30d158] text-[#30d158] text-xs font-semibold rounded-xl border border-[#30d158]/30";
    return "";
  };

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl px-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <h3 className="text-[10px] font-semibold tracking-widest uppercase text-[#555555] mb-4 text-center">
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
                "flex-1 py-2 transition-all duration-300 text-center",
                isActive
                  ? getActiveClassName(btn.value)
                  : "bg-[#1c1c1c] text-[#555555] text-xs font-medium rounded-xl border border-[#222222] hover:border-[#333333]"
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
