"use client";

import { useState, useEffect, useRef } from "react";
import { EnergyCheckIn } from "@/components/daily/EnergyCheckIn";
import type { TodayEnergyOutput, TodayEnergyInput } from "@/lib/todayEnergy";

export interface TodayEnergyCardProps {
  initialEnergy: "LOW" | "MID" | "HIGH" | null;
  energyData: TodayEnergyOutput;
  energyInput: TodayEnergyInput;
  today: string;
}

// ── Display constants ─────────────────────────────────────────────────────────

const ENERGY_CONFIG = {
  low:    { label: "DÜŞÜK",  color: "#ef4444", bg: "rgba(239,68,68,0.10)"  },
  medium: { label: "ORTA",   color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  high:   { label: "YÜKSEK", color: "#22c55e", bg: "rgba(34,197,94,0.10)"  },
} as const;

const MODE_LABEL = {
  koruma: "KORUMA",
  denge:  "DENGE",
  atak:   "ATAK",
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function CapacityDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-colors duration-300"
          style={{ backgroundColor: i < value ? "#f5c518" : "#252525" }}
        />
      ))}
    </div>
  );
}

function AiStatusDot({ loading, isAi }: { loading: boolean; isAi: boolean }) {
  if (loading) {
    return (
      <div
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: "#333333" }}
        title="AI analiz ediliyor..."
      />
    );
  }
  if (isAi) {
    return (
      <span
        className="text-[8px] tracking-widest font-mono"
        style={{ color: "#2a2a2a" }}
        title="AI destekli sonuç"
      >
        AI
      </span>
    );
  }
  return null;
}

// ── Main component ────────────────────────────────────────────────────────────

const CACHE_PREFIX = "today-energy-";

export function TodayEnergyCard({
  initialEnergy,
  energyData: localData,
  energyInput,
  today,
}: TodayEnergyCardProps) {
  const [energyLevel, setEnergyLevel] = useState<"LOW" | "MID" | "HIGH" | null>(initialEnergy);
  const [displayData, setDisplayData] = useState<TodayEnergyOutput>(localData);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAiSource, setIsAiSource] = useState(false);

  // Prevent duplicate fetches on StrictMode double-mount
  const fetchedRef = useRef(false);

  // Body theme class — driven by manual EnergyCheckIn selection
  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-low", "theme-mid", "theme-high");
    if (energyLevel === "LOW")  body.classList.add("theme-low");
    if (energyLevel === "MID")  body.classList.add("theme-mid");
    if (energyLevel === "HIGH") body.classList.add("theme-high");
  }, [energyLevel]);

  // AI fetch — once per day, cached in sessionStorage
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const cacheKey = CACHE_PREFIX + today;

    // Serve cached result first
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setDisplayData(JSON.parse(cached) as TodayEnergyOutput);
        setIsAiSource(true);
        return;
      }
    } catch {
      // sessionStorage unavailable — proceed to fetch
    }

    setAiLoading(true);

    fetch("/api/ai/today-energy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, ...energyInput }),
    })
      .then((res) => (res.ok ? (res.json() as Promise<TodayEnergyOutput>) : null))
      .then((data) => {
        if (!data) return;
        setDisplayData(data);
        setIsAiSource(true);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // sessionStorage write failed — fine, just won't cache
        }
      })
      .catch(() => {
        // Network error or any failure — local data already displayed
      })
      .finally(() => setAiLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cfg = ENERGY_CONFIG[displayData.energy];

  return (
    <div className="bg-[#111111] rounded-xl border border-[#1f1f1f] overflow-hidden">

      {/* ── Hesaplanan / AI enerji analizi ── */}
      <div className="px-5 pt-4 pb-4 flex flex-col gap-3">

        {/* Başlık + durum + enerji badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium">
              BUGÜNÜN ENERJİSİ
            </span>
            <AiStatusDot loading={aiLoading} isAi={isAiSource} />
          </div>
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded"
            style={{ backgroundColor: cfg.bg }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-[10px] font-bold tracking-widest" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Mod + kapasite */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-widest text-[#555555] font-semibold">
            {MODE_LABEL[displayData.mode]}
          </span>
          <div className="w-px h-3 bg-[#252525]" />
          <CapacityDots value={displayData.capacity} />
          <span className="text-[11px] text-[#444444]">
            {displayData.capacity} iş kapasitesi
          </span>
        </div>

        {/* Mesaj */}
        <p className="text-sm text-[#777777] leading-snug">
          {displayData.message}
        </p>

        {/* Uyarı — opsiyonel */}
        {displayData.warning && (
          <div className="flex items-start gap-2 rounded-lg px-3 py-2 bg-[#1c1500] border border-[#2a2000]">
            <span className="text-[#f59e0b] text-xs mt-px leading-none">⚠</span>
            <span className="text-xs text-[#777777]">{displayData.warning}</span>
          </div>
        )}
      </div>

      {/* ── Ayırıcı ── */}
      <div className="h-px bg-[#1a1a1a]" />

      {/* ── Manuel enerji girişi (body tema class) ── */}
      <div className="px-5 py-3">
        <EnergyCheckIn
          currentEnergy={energyLevel}
          onSelect={(val) => {
            setEnergyLevel(val);
            setDisplayData(prev => ({
              ...prev,
              energy: val === "HIGH" ? "high" : val === "MID" ? "medium" : "low",
              mode: val === "HIGH" ? "atak" : val === "MID" ? "denge" : "koruma",
              capacity: val === "HIGH" ? 4 : val === "MID" ? 3 : 2,
            }));
          }}
        />
      </div>

    </div>
  );
}
