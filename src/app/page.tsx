"use client";

import { useState, useCallback, useEffect } from "react";
import MotivationCards from "@/components/MotivationCards";
import EndDayButton from "@/components/EndDayButton";
import ActiveTasks from "@/components/ActiveTasks";
import GoalsDashboard from "@/components/GoalsDashboard";
import VitaminTracker from "@/components/VitaminTracker";
import TheArsenal from "@/components/TheArsenal";

import NeverBreak from "@/components/NeverBreak";
import BonusTasks from "@/components/BonusTasks";
import WeeklyScreen from "@/components/WeeklyScreen";
import WarFund from "@/components/WarFund";

type Tab = "GUNLUK" | "HAFTALIK" | "STRATEJI" | "FINANS";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "GUNLUK", label: "GÜNLÜK", icon: "⚡" },
  { key: "HAFTALIK", label: "HAFTALIK", icon: "📅" },
  { key: "STRATEJI", label: "STRATEJİ", icon: "🗺️" },
  { key: "FINANS", label: "FİNANS", icon: "💰" },
];

export default function Home() {
  /* ── State ────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<Tab>("GUNLUK");
  const [dailyScore, setDailyScore] = useState(0);
  const [dailyStatusMessage, setDailyStatusMessage] = useState("");
  const [dailyStatusColor, setDailyStatusColor] = useState("");

  /* ── Score Calculation ────────────────────────────────── */
  const calculateScore = useCallback(() => {
    let score = 0;
    const today = new Date().toISOString().split("T")[0];

    // Never Break (3 tasks = max 3 points)
    const savedNB = localStorage.getItem("goat-never-break-v1");
    if (savedNB) {
      try {
        const parsed = JSON.parse(savedNB);
        if (parsed.date === today && parsed.data) {
          if (parsed.data["nb-morning"]) score += 1;
          if (parsed.data["nb-teeth"]) score += 1;
          if (parsed.data["nb-deepwork"]) score += 1;
          if (parsed.data["nb-sports"]) score += 1;
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

    // Determine status purely on base score (out of 4)
    // Even if they have bonus, the max base requirement is 4.
    if (score >= 4) {
      setDailyStatusMessage("Gün Kazanıldı ✓");
      setDailyStatusColor("#00FF88");
    } else if (score >= 3) {
      setDailyStatusMessage("İyi Gün ✓");
      setDailyStatusColor("#00FF88");
    } else if (score >= 1.5) {
      setDailyStatusMessage("Devam Et");
      setDailyStatusColor("#FFB800");
    } else {
      setDailyStatusMessage("Başla");
      setDailyStatusColor("#FF3B3B");
    }
  }, []);

  useEffect(() => {
    // Avoid calling setState synchronously within an effect
    setTimeout(() => {
      calculateScore();
    }, 0);
    window.addEventListener("dailyScoreUpdated", calculateScore);
    return () => window.removeEventListener("dailyScoreUpdated", calculateScore);
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
              {activeTab === "GUNLUK" && "KOMUTA EKRANI — Bugün sadece ana savaşları kazan."}
              {activeTab === "HAFTALIK" && "BU HAFTANIN 3 KAZANCI — Haftayı kazanmak için minimum sonuçlar."}
              {activeTab === "STRATEJI" && "STRATEJİ HARİTASI — Her gün bakma. Sadece yönünü güncelle."}
              {activeTab === "FINANS" && "SAVAŞ FONU — Kan kaybetme. Kaynaklarını koru ve büyüt."}
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted tabular-nums">
            {dateStrTR}
          </p>
        </header>

        {/* ── Tab Navigation ─────────────────────────────── */}
        <nav className="px-4 md:px-8 pt-4 pb-2 max-w-6xl mx-auto">
          <div className="flex gap-0 border border-border">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
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
              {/* 1. Kimlik İnşası + Strateji */}
              <MotivationCards />

              {/* 2. Vitamin Takibi (Yeni yer - En üst) */}
              <VitaminTracker />

              <div className="h-px bg-border my-8" />

              {/* 3. Asla Kırma */}
              <NeverBreak />

              {/* 4. Enerji Varsa */}
              <BonusTasks />

              <div className="h-px bg-border my-8" />

              {/* 5. Bilgi Cephaneliği (Yeni yer) */}
              <TheArsenal />

              <div className="h-px bg-border my-8" />

              {/* 6. Aktif Görevler */}
              <ActiveTasks />

              <div className="h-px bg-border my-8" />

              {/* 7. Günlük Skor */}
              <section className="flex flex-col items-center justify-center text-center space-y-2 py-4">
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Günlük Skor</div>
                <div 
                  className="text-2xl md:text-3xl font-bold uppercase tracking-wider" 
                  style={{ color: dailyStatusColor }}
                >
                  {dailyStatusMessage} <span className="text-sm opacity-50 ml-2">({dailyScore.toFixed(1)}/4)</span>
                </div>
              </section>

              {/* 8. Günü Bitir */}
              <EndDayButton
                score={dailyScore}
                maxBaseScore={4}
                onFail={() => calculateScore()}
                onSuccess={() => calculateScore()}
              />
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

          {/* Footer */}
          <footer className="pt-6 pb-8 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted">
              &ldquo;Disiplinsiz özgürlük, özgürlüksüz disiplin — ikisi de
              ölüm.&rdquo;
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
