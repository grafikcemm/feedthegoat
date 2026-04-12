import React from "react";

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-4">
      <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-1">{label}</div>
      <div className="font-display text-3xl text-ftg-amber">{value}</div>
    </div>
  );
}

export function ApiMetricsRow() {
  return (
    <div className="mt-6">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-3">
        API METRİKLERİ
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="AYLIK MRR"      value="0" />
        <MetricCard label="AKTİF MÜŞTERİ"  value="0" />
        <MetricCard label="DISCOVERY CALL" value="0" />
        <MetricCard label="PIPELINE LEAD"  value="0" />
        {/* TODO: wire to real data in future phase */}
      </div>
    </div>
  );
}
