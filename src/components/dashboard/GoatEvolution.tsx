"use client";

import { getGoatStage, GOAT_SPRITES } from "@/lib/goatEvolution";

interface GoatEvolutionProps {
  streak: number;
  score: number;
  cap?: number;           // YENİ — varsayılan 70
  energyStatus?: string;
  orbGlow?: string;       // YENİ
  orbBorder?: string;     // YENİ
  energyLevel?: "LOW" | "MID" | "HIGH" | null;
}

export function GoatEvolution({ 
  streak, 
  score, 
  cap = 70,
  energyStatus,
  orbGlow = 'rgba(255,255,255,0.06)',
  orbBorder = 'var(--border-subtle)',
  energyLevel 
}: GoatEvolutionProps) {
  const stage = getGoatStage(streak);

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-8 py-12 flex flex-col items-center justify-center gap-6 min-h-[420px]">
      
      {/* ORB — merkezi büyük daire */}
      <div className="relative flex items-center justify-center">
        {/* Dış glow daire */}
        <div 
          className="absolute w-[220px] h-[220px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${orbGlow} 0%, rgba(255,255,255,0) 70%)`
          }}
        />
        {/* Ana orb */}
        <div 
          className="relative w-[200px] h-[200px] rounded-full flex items-center justify-center"
          style={{
            border: `1px solid ${orbBorder}`,
            background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)"
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ imageRendering: "pixelated", display: "block" }}
          >
            {/* Sol boynuz */}
            <rect x="4" y="0" width="1" height="3" fill="#A1A1AA"/>
            <rect x="3" y="1" width="1" height="1" fill="#A1A1AA"/>
            {/* Sağ boynuz */}
            <rect x="15" y="0" width="1" height="3" fill="#A1A1AA"/>
            <rect x="16" y="1" width="1" height="1" fill="#A1A1AA"/>
            {/* Sol kulak */}
            <rect x="3" y="3" width="3" height="1" fill="#D4D4D8"/>
            {/* Sağ kulak */}
            <rect x="14" y="3" width="3" height="1" fill="#D4D4D8"/>
            {/* Kafa */}
            <rect x="5" y="3" width="10" height="6" fill="#E4E4E7"/>
            {/* Sol göz */}
            <rect x="7" y="5" width="2" height="1" fill="#18181B"/>
            {/* Sağ göz */}
            <rect x="11" y="5" width="2" height="1" fill="#18181B"/>
            {/* Burun */}
            <rect x="8" y="7" width="1" height="1" fill="#71717A"/>
            <rect x="11" y="7" width="1" height="1" fill="#71717A"/>
            {/* Ağız */}
            <rect x="8" y="8" width="4" height="1" fill="#D4D4D8"/>
            {/* Sakal */}
            <rect x="9" y="9" width="2" height="2" fill="#A1A1AA"/>
            {/* Boyun */}
            <rect x="7" y="9" width="6" height="1" fill="#E4E4E7"/>
            {/* Gövde */}
            <rect x="3" y="10" width="14" height="6" fill="#D4D4D8"/>
            {/* Gövde highlight */}
            <rect x="4" y="11" width="12" height="4" fill="#E4E4E7"/>
            {/* Sol ön bacak */}
            <rect x="4" y="16" width="3" height="3" fill="#A1A1AA"/>
            {/* Sağ ön bacak */}
            <rect x="8" y="16" width="3" height="3" fill="#A1A1AA"/>
            {/* Sol arka bacak */}
            <rect x="12" y="16" width="3" height="3" fill="#A1A1AA"/>
            {/* Sağ arka bacak */}  
            <rect x="16" y="16" width="1" height="3" fill="#A1A1AA"/>
            {/* Kuyruk */}
            <rect x="17" y="10" width="2" height="2" fill="#E4E4E7"/>
            <rect x="18" y="9" width="1" height="2" fill="#D4D4D8"/>
          </svg>
        </div>
      </div>

      {/* SKOR */}
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-baseline">
          <span className="text-white font-bold text-6xl">
            {score}
          </span>
          <span className="text-[#444444] font-bold text-6xl">
            /{cap}
          </span>
        </div>
        <div className="text-[#888888] text-xs uppercase tracking-widest mt-1">
          GÜNLÜK SİSTEM SKORU
        </div>
        
        <div className="text-[#444444] text-xs mt-1">
          {cap === 70 ? 'GÜNLÜK HEDEF: 70P' :
           cap === 50 ? 'ORTA ENERJİ: 50P HEDEF' :
                        'DÜŞÜK ENERJİ: 30P HEDEF'}
        </div>
      </div>

      {/* ENERJI DURUM */}
      {energyStatus && (
        <div className="text-sm italic text-[#888888] mt-2">
          {energyStatus}
        </div>
      )}
    </div>
  );
}
