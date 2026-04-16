import React from "react";

interface ChargeDayCardProps {
  isTodayCharge: boolean;
}

const CHARGE_RITUALS = [
  { title: "Geçen haftayı gözden geçir", description: "Ne iyi gitti, ne kötü gitti?" },
  { title: "Gelecek haftanın 1 P1 hedefini belirle", description: "Tek bir odak noktası seç" },
  { title: "Sadece dinlen — salon yok", description: "Vücudun toparlanması gerek" },
  { title: "En geç 23:00 yat", description: "Pazartesi güçlü başla" },
];

export function ChargeDayCard({ isTodayCharge }: ChargeDayCardProps) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2a2a2a]/50">
        <span className="text-[#666666] text-[10px] tracking-[0.2em] uppercase font-bold">
          PAZAR — ŞARJ GÜNÜ
        </span>
        {isTodayCharge && (
          <span className="text-[9px] tracking-widest uppercase px-3 py-1 rounded-lg bg-[#6366f1] text-white font-bold animate-pulse">
            BUGÜN
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {CHARGE_RITUALS.map((r, i) => (
          <div key={i} className="flex flex-col gap-1.5 border-l-4 border-[#6366f1] pl-6 py-3 transition-all group bg-[#141414]/50 rounded-r-2xl shadow-sm hover:bg-[#141414]">
            <span className="text-sm font-bold text-[#ababab] group-hover:text-[#ffffff] transition-colors">
              {r.title}
            </span>
            <span className="text-xs text-[#666666] leading-relaxed font-medium">
              {r.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
