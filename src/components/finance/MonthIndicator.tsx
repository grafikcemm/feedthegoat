import React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function MonthIndicator() {
  const currentMonth = format(new Date(), "MMMM yyyy", { locale: tr });

  return (
    <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-ftg-text-mute mb-6">
      {currentMonth}
    </div>
  );
}
