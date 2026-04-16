import React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function MonthIndicator() {
  const currentMonth = format(new Date(), "MMMM yyyy", { locale: tr });

  return (
    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#666666] mb-8">
      {currentMonth}
    </div>
  );
}
