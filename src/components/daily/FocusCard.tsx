import React from "react";

interface FocusCardProps {
  focus: {
    title: string;
    subtitle: string | null;
    day_type: string | null;
  } | null;
}

export function FocusCard({ focus }: FocusCardProps) {
  const title = focus?.title ?? 'Bugünün odağı yok';
  const subtitle = focus?.subtitle ?? '';
  const dayType = focus?.day_type ?? '';

  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5 flex flex-col gap-3">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
        BUGÜNÜN ODAĞI
      </div>
      <div className="font-display text-3xl text-ftg-text leading-none">
        {title}
      </div>
      {subtitle && (
        <div className="font-mono text-xs text-ftg-text-dim">
          {subtitle}
        </div>
      )}
      {dayType && (
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute pt-2 border-t border-ftg-border-subtle">
          {dayType}
        </div>
      )}
    </div>
  );
}
