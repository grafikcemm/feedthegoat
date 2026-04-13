import React from "react";

interface DailySystemsCardProps {
  ceo_breakfast_note: string | null;
}

export function DailySystemsCard({ ceo_breakfast_note }: DailySystemsCardProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-4">
        GÜNLÜK SİSTEMLER
      </div>
      <div className="text-zinc-500 font-mono text-[10px] italic">
        Sistemler günlük tab'ına taşındı. Burası yakında antrenman sistemleri ile güncellenecek.
      </div>
    </div>
  );
}
