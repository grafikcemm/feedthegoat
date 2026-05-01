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
    <div className="w-full flex justify-center">
      <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-1 flex gap-1">
        {buttons.map((btn) => {
          const isActive = btn.value === active;
          return (
            <button
              key={btn.value}
              onClick={() => handleSetEnergy(btn.value)}
              className={cn(
                "transition-all duration-200",
                isActive
                  ? "bg-[#F5C518] text-black rounded-md px-4 py-1.5 text-xs font-semibold"
                  : "text-[#444444] rounded-md px-4 py-1.5 text-xs font-medium hover:text-[#888888]"
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
