import React from "react";
import { cn } from "@/utils/cn";
import { StatusSeverity } from "@/lib/financeCalc";

interface StatusBannerProps {
  label: string;
  description: string;
  severity: StatusSeverity;
}

export function StatusBanner({
  label,
  description,
  severity,
}: StatusBannerProps) {
  const styles = {
    positive: "border-[#30d158]/30 bg-[#30d158] text-[#30d158]",
    neutral: "border-[#2a2a2a] bg-[#0a0a0a] text-[#ababab]",
    warning: "border-[#6366f1]/30 bg-[#141414] text-[#6366f1]",
    danger: "border-[#ff453a]/30 bg-[#ff453a] text-[#ff453a]",
  };

  return (
    <div
      className={cn(
        "block w-full rounded-2xl border-l-4 p-5 mb-8 transition-all shadow-sm",
        styles[severity]
      )}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.2em]">
        {label}
      </div>
      <div className={cn(
        "text-xs mt-2 italic leading-relaxed font-medium",
        severity === 'neutral' ? "text-[#ababab]/70" : "opacity-90"
      )}>
        {description}
      </div>
    </div>
  );
}
