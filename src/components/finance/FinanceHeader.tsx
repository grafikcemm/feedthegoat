import React from "react";
import { cn } from "@/utils/cn";

interface FinanceHeaderProps {
  net: number;
}

export function FinanceHeader({ net }: FinanceHeaderProps) {
  const isPositive = net > 0;
  const isNegative = net < 0;
  const isZero = net === 0;

  return (
    <div className="flex items-center justify-between mb-4 border-b border-[#2a2a2a] pb-4">
      <h2 className="text-[#666666] text-[10px] tracking-[0.2em] uppercase font-bold">
        SAVAŞ FONU
      </h2>
      <div className="flex items-center gap-3">
        <span className="text-[#666666] text-[10px] tracking-[0.2em] font-bold uppercase">
          NET:
        </span>
        <span
          className={cn(
            "text-2xl font-bold font-sans",
            isPositive && "text-[#30d158]",
            isNegative && "text-[#ff453a]",
            isZero && "text-[#666666]"
          )}
        >
          {net.toLocaleString("tr-TR")} ₺
        </span>
      </div>
    </div>
  );
}
