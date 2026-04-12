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
    <div className="flex items-center justify-between mb-2">
      <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
        SAVAŞ FONU
      </h2>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
          NET:
        </span>
        <span
          className={cn(
            "font-display text-2xl",
            isPositive && "text-ftg-success",
            isNegative && "text-ftg-danger",
            isZero && "text-ftg-text-dim"
          )}
        >
          {net.toLocaleString("tr-TR")} ₺
        </span>
      </div>
    </div>
  );
}
