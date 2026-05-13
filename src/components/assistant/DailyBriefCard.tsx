"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

interface DailyBrief {
  greeting: string;
  energySummary: string;
  todayLock: string;
  capacity: number;
  criticalReminder: string;
  rhythmReminder: string | null;
  warning: string | null;
  shutdownQuestion: string;
}

interface DailyBriefCardProps {
  energyInput: {
    completedTasksYesterday: number;
    criticalRoutineCompletionRate: number;
    dailyPeakClean: boolean | null;
    activeTasksCount: number;
    waitingTasksCount: number;
    rhythmCountToday: number;
  };
  today: string;
}

const CACHE_KEY_PREFIX = "daily-brief-";

export function DailyBriefCard({ energyInput, today }: DailyBriefCardProps) {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(false);

  const cacheKey = CACHE_KEY_PREFIX + today;

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setBrief(JSON.parse(cached));
        return;
      }
    } catch { /* ignore */ }
  }, [cacheKey]);

  async function fetchBrief() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "brief", date: today, ...energyInput }),
      });
      if (res.ok) {
        const data = await res.json() as DailyBrief;
        setBrief(data);
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  return (
    <div className="bg-[#111111] rounded-xl border border-[#1f1f1f] overflow-hidden">
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-[#f5c518]" strokeWidth={2} />
            <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium">
              Günlük Brief
            </span>
          </div>
          {!brief && (
            <button
              onClick={fetchBrief}
              disabled={loading}
              className="text-[11px] text-[#555555] hover:text-[#888888] transition-colors disabled:opacity-50"
            >
              {loading ? "Üretiyor..." : "Oluştur"}
            </button>
          )}
        </div>

        {!brief && !loading && (
          <p className="text-[12px] text-[#444444]">
            AI destekli günlük plan özeti için "Oluştur" butonuna bas.
          </p>
        )}

        {loading && (
          <div className="space-y-2">
            {[40, 60, 50].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded animate-pulse bg-[#1a1a1a]"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}

        {brief && (
          <div className="space-y-3">
            <p className="text-sm text-[#cccccc] font-medium">{brief.greeting}</p>

            <p className="text-xs text-[#666666]">{brief.energySummary}</p>

            <div className="bg-[#161200] border border-[#2a2000] rounded-lg px-3 py-2.5">
              <span className="text-[10px] uppercase tracking-widest text-[#f5c518] font-medium block mb-1">
                Kilit
              </span>
              <p className="text-sm text-[#cccccc]">{brief.todayLock}</p>
            </div>

            <p className="text-xs text-[#555555]">{brief.criticalReminder}</p>

            {brief.rhythmReminder && (
              <p className="text-xs text-[#3b82f6]">{brief.rhythmReminder}</p>
            )}

            {brief.warning && (
              <div className="flex items-start gap-2 rounded-lg px-3 py-2 bg-[#1c1500] border border-[#2a2000]">
                <span className="text-[#f59e0b] text-xs mt-px">⚠</span>
                <span className="text-xs text-[#777777]">{brief.warning}</span>
              </div>
            )}

            <div className="h-px bg-[#1a1a1a]" />
            <p className="text-[11px] text-[#444444] italic">{brief.shutdownQuestion}</p>

            <button
              onClick={() => { setBrief(null); try { sessionStorage.removeItem(cacheKey); } catch { /* ignore */ } }}
              className="text-[10px] text-[#333333] hover:text-[#555555] transition-colors"
            >
              Yenile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
