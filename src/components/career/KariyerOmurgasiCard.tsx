import React from "react";

interface BackboneData {
  ana_yon: string;
  ana_gelir_motoru: string;
  yardimci_motor: string;
  fiziksel_sigorta: string;
  karar_filtresi: string;
}

interface KariyerOmurgasiCardProps {
  backbone: BackboneData;
}

function BackboneRow({ label, value, italic }: { label: string; value: string; italic?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute">{label}</span>
      <span className={`font-mono text-sm ${italic ? 'italic text-ftg-text-dim' : 'text-ftg-text'}`}>
        {value}
      </span>
    </div>
  );
}

export function KariyerOmurgasiCard({ backbone }: KariyerOmurgasiCardProps) {
  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-4">
        KARİYER OMURGASI
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
        <BackboneRow label="ANA YÖN"          value={backbone.ana_yon} />
        <BackboneRow label="ANA GELİR MOTORU" value={backbone.ana_gelir_motoru} />
        <BackboneRow label="YARDIMCI MOTOR"   value={backbone.yardimci_motor} />
        <BackboneRow label="FİZİKSEL SİGORTA" value={backbone.fiziksel_sigorta} />
        <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-ftg-border-subtle">
          <BackboneRow label="KARAR FİLTRESİ" value={backbone.karar_filtresi} italic />
        </div>
      </div>
    </div>
  );
}
