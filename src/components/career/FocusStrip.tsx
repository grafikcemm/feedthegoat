import React from "react";

interface FocusStripProps {
  su_an_odaklanilacak: string;
  simdilik_dokunma: string;
}

export function FocusStrip({ su_an_odaklanilacak, simdilik_dokunma }: FocusStripProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-4 border-l-4 border-l-ftg-amber">
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-2">
          ŞU AN ODAKLANILACAK 3 KONU
        </div>
        <div className="font-mono text-sm text-ftg-text leading-relaxed">
          {su_an_odaklanilacak}
        </div>
      </div>
      <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-4 border-l-4 border-l-ftg-text-mute">
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-2">
          ŞİMDİLİK DOKUNMA
        </div>
        <div className="font-mono text-sm text-ftg-text-dim leading-relaxed">
          {simdilik_dokunma}
        </div>
      </div>
    </div>
  );
}
