"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, Check, ChevronDown, ChevronUp } from "lucide-react";
import { getBadHabitData, recordBadHabit } from "@/app/actions/streaks";

const HABITS = [
  { key: "no_outside_food",      label: "Dışarıdan yemek yemedim" },
  { key: "no_porn",              label: "Pornografi izlemedim" },
  { key: "started_not_postponed",label: "Ertelemedim, başladım" },
  { key: "selective_sharing",    label: "Herkese her şeyi anlatmadım" },
] as const;

export function DailyPeakCard() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const { logs } = await getBadHabitData();
      const todayStr = new Date().toISOString().split("T")[0];
      const todayLogs = logs.filter((l) => l.log_date === todayStr);
      const initial: Record<string, boolean> = {};
      todayLogs.forEach((l) => { initial[l.habit_key] = l.success; });
      setChecked(initial);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleToggle = async (key: string) => {
    const newValue = !checked[key];
    setChecked((prev) => ({ ...prev, [key]: newValue }));
    try {
      await recordBadHabit(key, newValue);
    } catch {
      setChecked((prev) => ({ ...prev, [key]: !newValue }));
    }
  };

  const allDone = HABITS.every((h) => checked[h.key]);
  const anyBroken = HABITS.some((h) => checked[h.key] === false);

  return (
    <div className="bg-[#111111] rounded-xl border border-[#1f1f1f] overflow-hidden">

      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 pt-4 pb-3 flex items-center justify-between cursor-pointer hover:bg-[#161616] transition-colors"
      >
        <div>
          <div className="flex items-center gap-2">
            <Flame
              size={14}
              className={allDone ? "text-[#f97316]" : "text-[#555555]"}
              style={allDone ? { fill: "#f97316" } : {}}
            />
            <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium">
              Günlük Peak
            </span>
          </div>
          <p className="text-xs text-[#555555] mt-0.5">Bugün temiz çizgide misin?</p>
        </div>
        {isOpen
          ? <ChevronUp size={14} className="text-[#444444]" />
          : <ChevronDown size={14} className="text-[#444444]" />
        }
      </div>

      {isOpen && (
        <>
          {/* Divider */}
          <div className="h-px bg-[#1a1a1a]" />

          {/* Checklist */}
          <div className="px-5 py-3 flex flex-col gap-2.5">
            {loading
              ? HABITS.map((h) => (
                  <div key={h.key} className="h-5 rounded bg-[#1a1a1a] animate-pulse" />
                ))
              : HABITS.map((h) => {
                  const isChecked = !!checked[h.key];
                  return (
                    <button
                      key={h.key}
                      onClick={() => handleToggle(h.key)}
                      className="flex items-center gap-3 text-left w-full outline-none"
                    >
                      <div
                        className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-[#22c55e]/15 border-[#22c55e]"
                            : "border-[#2a2a2a] bg-transparent"
                        }`}
                      >
                        {isChecked && (
                          <Check size={10} className="text-[#22c55e]" strokeWidth={3} />
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          isChecked ? "text-[#555555] line-through" : "text-[#888888]"
                        }`}
                      >
                        {h.label}
                      </span>
                    </button>
                  );
                })}
          </div>

          {/* Status footer */}
          {!loading && (allDone || anyBroken) && (
            <>
              <div className="h-px bg-[#1a1a1a]" />
              <div className="px-5 py-3">
                {allDone ? (
                  <div className="flex items-center gap-2">
                    <Flame size={12} className="text-[#f97316]" style={{ fill: "#f97316" }} />
                    <span className="text-xs text-[#555555]">Temiz çizgidesin.</span>
                  </div>
                ) : (
                  <span className="text-xs text-[#555555]">
                    Sorun yok. Şimdi tekrar çizgiye dön.
                  </span>
                )}
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}
