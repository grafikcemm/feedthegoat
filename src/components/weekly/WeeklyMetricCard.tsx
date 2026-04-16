import React from "react";

interface WeeklyMetricCardProps {
  label: string;
  value: string | number;
  subValue?: string | number;
  total?: number;
}

export function WeeklyMetricCard({ label, value, subValue, total }: WeeklyMetricCardProps) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 shadow-sm hover:border-[#6366f1]/30 transition-all group">
      <div className="text-[#666666] text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
        {label}
      </div>
      <div className="text-3xl text-[#6366f1] font-bold flex items-baseline gap-2 font-sans">
        {value} 
        {total !== undefined && (
          <span className="text-[#2a2a2a] text-xl font-medium">/ {total}</span>
        )}
      </div>
      {subValue !== undefined && (
        <div className="text-[10px] text-[#ababab] mt-2 tracking-wide font-medium italic">
          {subValue}
        </div>
      )}
    </div>
  );
}
