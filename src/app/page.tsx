"use client";

import { useState, useCallback, useEffect } from "react";
import MotivationCards from "@/components/MotivationCards";
import EndDayButton from "@/components/EndDayButton";
import ActiveTasks from "@/components/ActiveTasks";
import GoalsDashboard from "@/components/GoalsDashboard";
import VitaminTracker from "@/components/VitaminTracker";
import NutritionTracker from "@/components/NutritionTracker";
import DailyPrayer from "@/components/DailyPrayer";
import NeverBreak from "@/components/NeverBreak";
import BonusTasks from "@/components/BonusTasks";
import DopamineDetox from "@/components/DopamineDetox";
import WeeklyScreen from "@/components/WeeklyScreen";
import WarFund from "@/components/WarFund";
import SportsProgram from "@/components/SportsProgram";
import RightPanel from "@/components/RightPanel";

type Tab = "GUNLUK" | "HAFTALIK" | "STRATEJI" | "FINANS" | "SPOR_SAGLIK";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "GUNLUK", label: "GÜNLÜK", icon: "⚡" },
  { key: "SPOR_SAGLIK", label: "SPOR & SAĞLIK", icon: "🏋️‍♂️" },
  { key: "HAFTALIK", label: "HAFTALIK", icon: "📅" },
  { key: "STRATEJI", label: "KARİYER", icon: "🗺️" },
  { key: "FINANS", label: "FİNANS", icon: "💰" },
];

export default function Home() {
  /* ── State ────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<Tab>("GUNLUK");
  const [dailyScore, setDailyScore] = useState(0);
  const [dailyStatusMessage, setDailyStatusMessage] = useState("");
  const [dailyStatusColor, setDailyStatusColor] = useState("");
  const [streak, setStreak] = useState(0);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("goat-streak-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If the last date was more than 1 day ago and not today, streak resets if we want strict streak, but let's just keep the count and update it on EndDay.
        setTimeout(() => setStreak(parsed.count || 0), 0);
      } catch {}
    }
  }, []);

  const handleDayEnd = (isSuccess: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem("goat-streak-v1");
    let currentStreak = streak;
    let lastDate = "";

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        currentStreak = parsed.count || 0;
        lastDate = parsed.lastDate || "";
      } catch {}
    }

    if (lastDate !== today) {
        if (isSuccess) {
            currentStreak += 1;
        } else {
            currentStreak = 0; // Break streak
        }
    }

    setStreak(currentStreak);
    localStorage.setItem("goat-streak-v1", JSON.stringify({ count: currentStreak, lastDate: today }));
    calculateScore();
  };

  /* ── Score Calculation ────────────────────────────────── */
  const calculateScore = useCallback(() => {
    let score = 0;
    const today = new Date().toISOString().split("T")[0];

    // Never Break (5 tasks = max 5 points) - now using v2
    const savedNB = localStorage.getItem("goat-never-break-v2");
    if (savedNB) {
      try {
        const parsed = JSON.parse(savedNB);
        if (parsed.date === today && parsed.data) {
          if (parsed.data["nb-morning"]) score += 1;
          if (parsed.data["nb-teeth"]) score += 1;
          if (parsed.data["nb-deepwork"]) score += 1;
          if (parsed.data["nb-sports"]) score += 1;
          if (parsed.data["nb-book"]) score += 1;
        }
      } catch {
        // ignore errors
      }
    }

    // Bonus (max 4 tasks * 0.5 = 2 points)
    const savedBonus = localStorage.getItem("goat-bonus-tasks-v1");
    if (savedBonus) {
      try {
        const parsed = JSON.parse(savedBonus);
        if (parsed.date === today && parsed.data) {
          Object.values(parsed.data).forEach(val => {
            if (val) score += 0.5;
          });
        }
      } catch {
        // ignore errors
      }
    }

    setDailyScore(score);

    // Determine status based on score (out of 5 base tasks)
    if (score >= 5) {
      setDailyStatusMessage("Gün Kazanıldı ✓");
      setDailyStatusColor("#00FF88");
    } else if (score >= 4) {
      setDailyStatusMessage("İyi Gün ✓");
      setDailyStatusColor("#00FF88");
    } else {
      setDailyStatusMessage(score > 0 ? "Devam Et" : "Başla");
      setDailyStatusColor("#FF3B3B");
    }
  }, []);

  useEffect(() => {
    // Avoid calling setState synchronously within an effect
    setTimeout(() => {
      calculateScore();
    }, 0);
    window.addEventListener("dailyScoreUpdated", calculateScore);

    // Midnight Auto-Rollover Logic and 18:00 check interval
    const initDate = new Date().toISOString().split("T")[0];
    const checkInterval = setInterval(() => {
        const currentDate = new Date().toISOString().split("T")[0];
        if (initDate !== currentDate) {
            window.location.reload();
        } else {
            // Re-calculate score purely to trigger the 18:00 check if time passes naturally
            calculateScore();
        }
    }, 60000); // Check every minute

    return () => {
        window.removeEventListener("dailyScoreUpdated", calculateScore);
        clearInterval(checkInterval);
    };
  }, [calculateScore]);

  /* ── Today's date display ─────────────────────────────── */
  const todayDate = new Date();
  const dateStrTR = todayDate.toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="min-h-screen">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="brutalist-border border-t-0 border-x-0 px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.3em] text-text">
              FEED THE GOAT<span className="text-accent-red">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mt-1">
              {activeTab === "GUNLUK" && "KARARGÂH — Bugün sadece ana savaşları kazan."}
              {activeTab === "HAFTALIK" && "BU HAFTANIN 3 KAZANCI — Haftayı kazanmak için minimum sonuçlar."}
              {activeTab === "STRATEJI" && "KARİYER — Az konu. Çok kanıt. Canlı sistem. Gelir odak."}
              {activeTab === "FINANS" && "SAVAŞ FONU — Kan kaybetme. Kaynaklarını koru ve büyüt."}
              {activeTab === "SPOR_SAGLIK" && "SPOR & SAĞLIK — Makineyi güçlü ve zinde tut."}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted tabular-nums">
              {dateStrTR}
            </p>
            <button 
              onClick={() => setIsRightPanelOpen(true)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 border border-border bg-surface text-text hover:bg-text hover:text-black transition-colors"
            >
              FİLTRELER
            </button>
          </div>
        </header>

        <RightPanel isOpen={isRightPanelOpen} onClose={() => setIsRightPanelOpen(false)} />

        {/* ── Tab Navigation ─────────────────────────────── */}
        <nav className="px-4 md:px-8 pt-4 pb-2 max-w-6xl mx-auto">
          <div className="flex gap-0 border border-border">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(50);
                    setActiveTab(tab.key);
                  }}
                  className={`
                    flex-1 py-3 px-4 text-[11px] uppercase tracking-[0.25em] font-bold
                    transition-all duration-200 flex items-center justify-center gap-2
                    ${isActive
                      ? "bg-text text-bg border-text"
                      : "bg-surface text-text-muted hover:bg-surface-hover hover:text-text border-r border-border last:border-r-0"
                    }
                  `}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Main Content ──────────────────────────────── */}
        <main className="px-4 md:px-8 py-6 space-y-6 max-w-6xl mx-auto">

          {/* ── TAB: GÜNLÜK ────────────────────────────── */}
          {activeTab === "GUNLUK" && (
            <>
              {/* 1. Asla Kırma (En Yüksek Öncelik) */}
              <NeverBreak streak={streak} />

              <div className="h-px bg-border my-6" />

              {/* 2. Enerji Varsa (İkinci Öncelik) */}
              <BonusTasks />

              <div className="h-px bg-border my-6" />

              {/* 4. Dopamin Detoksu (Kompakt) */}
              <DopamineDetox />

              <div className="h-px bg-border my-8" />

              {/* Aktif Görevler */}
              <ActiveTasks />

              {/* Animasyonlu Motivasyon Kartları */}
              <MotivationCards />

              {/* Manus Button */}
              <section className="mb-4">
                  <a href="#" className="flex items-center justify-center gap-2 p-3 border border-text text-text bg-surface hover:bg-text hover:text-black transition-colors font-bold uppercase tracking-widest text-xs">
                      <span className="text-base">🤖</span>
                      Manus Günlük Güncellemeleri Kontrol Et
                  </a>
              </section>

              {/* Günlük Skor */}
              <section className="flex flex-col items-center justify-center text-center space-y-2 py-4">
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Gün Durumu</div>
                <div 
                  className={`text-2xl md:text-3xl font-bold uppercase tracking-wider`}
                  style={{ color: dailyStatusColor }}
                >
                  {dailyStatusMessage} <span className="text-sm opacity-50 ml-2">({dailyScore.toFixed(1)}/5)</span>
                </div>
              </section>

              {/* Günü Bitirme Butonu */}
              <EndDayButton
                score={dailyScore}
                maxBaseScore={5}
                onFail={() => handleDayEnd(false)}
                onSuccess={() => handleDayEnd(true)}
              />

              {/* 5. Günü Kapatış Ritüeli */}
              <DailyPrayer />
            </>
          )}

          {/* ── TAB: HAFTALIK ───────────────────────────── */}
          {activeTab === "HAFTALIK" && (
            <>
              <WeeklyScreen />
            </>
          )}

          {/* ── TAB: STRATEJİ ───────────────────────────── */}
          {activeTab === "STRATEJI" && (
            <>
              {/* Goals Dashboard (Refactored) */}
              <GoalsDashboard />
            </>
          )}

          {/* ── TAB: FİNANS ─────────────────────────────── */}
          {activeTab === "FINANS" && (
            <>
              <WarFund />
            </>
          )}

          {/* ── TAB: SPOR & SAĞLIK ─────────────────────────────── */}
          {activeTab === "SPOR_SAGLIK" && (
            <>
              <VitaminTracker />
              <NutritionTracker />
              <div className="h-px bg-border my-8" />
              <SportsProgram />
            </>
          )}

          {/* Footer */}
          <footer className="pt-6 pb-8 text-center space-y-4">
            <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted">
              &ldquo;Disiplinsiz özgürlük, özgürlüksüz disiplin — ikisi de
              ölüm.&rdquo;
            </p>
            <button 
                onClick={() => {
                    const data = { ...localStorage };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `goat-backup-${new Date().toISOString().split("T")[0]}.json`;
                    a.click();
                }}
                className="text-[10px] text-text-muted/50 hover:text-text-muted transition-colors border border-border/50 px-3 py-1 bg-surface/10"
            >
                VERİLERİ DIŞA AKTAR (JSON)
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}
