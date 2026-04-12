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
    positive: "border-ftg-success bg-ftg-success/5 text-ftg-success",
    neutral: "border-ftg-text-mute bg-ftg-surface text-ftg-text-dim",
    warning: "border-ftg-amber bg-ftg-amber-glow text-ftg-amber",
    danger: "border-ftg-danger bg-ftg-danger/10 text-ftg-danger",
  };

  return (
    <div
      className={cn(
        "block w-full rounded-ftg-card border-l-4 p-5 mb-8 transition-colors",
        styles[severity]
      )}
    >
      <div className="font-mono text-sm font-medium uppercase tracking-wider">
        {label}
      </div>
      <div className="font-mono text-xs text-ftg-text-dim mt-1">
        {description}
      </div>
    </div>
  );
}
