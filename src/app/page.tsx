"use client";

import { useState, useEffect } from "react";
import EndDayButton from "@/components/EndDayButton";
import ActiveTasks from "@/components/ActiveTasks";
import CareerDashboard from "@/components/career/CareerDashboard";
import NeverBreak from "@/components/NeverBreak";
import WeeklyScreen from "@/components/WeeklyScreen";
import WarFund from "@/components/WarFund";
import RightPanel from "@/components/RightPanel";
import HealthDashboard from "@/components/health/HealthDashboard";
import WakeUpMessageCard from "@/components/daily/WakeUpMessageCard";
import DailyFocusCard from "@/components/DailyFocusCard";
import IngilizceModal from "@/components/IngilizceModal";
import { useDailyScore } from "@/utils/useDailyScore";

import { Send } from "lucide-react";

type Tab = "GUNLUK" | "SPOR_SAGLIK" | "HAFTALIK" | "STRATEJI" | "FINANS";

const TABS: { key: Tab; label: string }[] = [
  { key: "GUNLUK", label: "GÜNLÜK" },
  { key: "SPOR_SAGLIK", label: "SPOR" },
  { key: "HAFTALIK", label: "HAFTALIK" },
  { key: "STRATEJI", label: "KARİYER" },
  { key: "FINANS", label: "FİNANS" },
];

// ── İçerik Paylaşımı (15p) ───────────────────────────────────
function ContentSharingSection() {
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("goat-content-sharing-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === new Date().toISOString().split("T")[0]) {
          return parsed.data?.["cs-grafikcem-x"] || false;
        }
      } catch {}
    }
    return false;
  });

  const toggle = () => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }
    const newDone = !done;
    setDone(newDone);
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem("goat-content-sharing-v1");
    let existingData: Record<string, boolean> = {};
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) existingData = parsed.data || {};
      } catch {}
    }
    localStorage.setItem(
      "goat-content-sharing-v1",
      JSON.stringify({ date: today, data: { ...existingData, "cs-grafikcem-x": newDone } })
    );
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  return (
    <div
      onClick={toggle}
      className="flex items-center gap-[10px] cursor-pointer transition-all duration-200"
      style={{
        height: "40px",
        background: done ? "var(--amber-dim)" : "transparent",
        borderBottom: "1px solid var(--border-1)",
        paddingRight: "16px",
      }}
      title="İçerik Paylaşımı"
    >
      <div 
        style={{ 
          width: "2px", 
          height: "100%", 
          background: "var(--amber)",
          transition: "background 0.2s" 
        }} 
      />
      <Send size={14} style={{ color: "var(--amber)", flexShrink: 0 }} />
      <span
        style={{
          flex: 1,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--size-sm)",
          color: "var(--text-1)",
          textDecoration: done ? "line-through" : "none",
          opacity: done ? 0.4 : 1,
        }}
      >
        Bugünkü X paylaşımı yapıldı
      </span>
      <span
        style={{ 
          fontFamily: "var(--font-mono)", 
          fontSize: "var(--size-xs)", 
          color: "var(--text-3)",
          opacity: done ? 0.4 : 1,
        }}
      >
        +15p
      </span>
    </div>
  );
}

// ── Bonus Görevler ────────────────────────────────────────────
interface BonusItemDef {
  id: string;
  label: string;
  points: number;
  activeDays?: number[];
  hasModal?: boolean;
}

const BONUS_ITEMS: BonusItemDef[] = [
  { id: "bn-sleep", label: "23:00 öncesi yat", points: 5 },
  { id: "bn-extra-read", label: "Ekstra 10 sayfa oku", points: 5 },
  {
    id: "bn-english",
    label: "İngilizce çalış",
    points: 10,
    activeDays: [1, 3, 5, 6],
    hasModal: true,
  },
  {
    id: "bn-treadmill",
    label: "Koşu bandı yürüyüşü",
    points: 10,
    activeDays: [3, 5, 0],
  },
];

function BonusSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("goat-bonus-tasks-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === new Date().toISOString().split("T")[0]) {
          return parsed.data || {};
        }
      } catch {}
    }
    return {};
  });
  const [showEnglishModal, setShowEnglishModal] = useState(false);
  const today = new Date().getDay();

  const saveAndDispatch = (newChecked: Record<string, boolean>) => {
    localStorage.setItem(
      "goat-bonus-tasks-v1",
      JSON.stringify({ date: new Date().toISOString().split("T")[0], data: newChecked })
    );
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  const toggle = (id: string, isDisabled: boolean) => {
    if (isDisabled) return;
    if (typeof window !== "undefined" && window.navigator?.vibrate) window.navigator.vibrate(20);
    const newChecked = { ...checked, [id]: !checked[id] };
    setChecked(newChecked);
    saveAndDispatch(newChecked);
  };

  const handleItemClick = (item: BonusItemDef, isDisabled: boolean) => {
    if (isDisabled) return;
    if (item.hasModal && !checked[item.id]) {
      setShowEnglishModal(true);
      return;
    }
    toggle(item.id, isDisabled);
  };

  return (
    <>
      <div className="flex flex-col">
        {BONUS_ITEMS.map((item) => {
          const isDisabled = !!(item.activeDays && !item.activeDays.includes(today));
          const isDone = checked[item.id];

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item, isDisabled)}
              className="flex items-center gap-[10px] transition-all duration-200"
              style={{
                height: "40px",
                borderBottom: "1px solid var(--border-1)",
                paddingRight: "16px",
                background: isDone ? "var(--bg-hover)" : "transparent",
                opacity: isDone ? 0.35 : isDisabled ? 0.15 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              <div 
                style={{ 
                  width: "2px", 
                  height: "100%", 
                  background: isDone ? "var(--amber)" : "transparent",
                  transition: "background 0.2s" 
                }} 
              />
              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--size-sm)",
                  color: isDone ? "var(--text-2)" : "var(--text-1)",
                  textDecoration: isDone ? "line-through" : "none",
                }}
              >
                {item.label}
              </span>
              <span
                style={{ 
                  fontFamily: "var(--font-mono)", 
                  fontSize: "var(--size-xs)", 
                  color: "var(--text-3)",
                }}
              >
                {item.points}p
              </span>
            </div>
          );
        })}
      </div>

      <IngilizceModal
        isOpen={showEnglishModal}
        onClose={() => setShowEnglishModal(false)}
        onComplete={() => toggle("bn-english", false)}
      />
    </>
  );
}

// ── Puan Barı ─────────────────────────────────────────────────
function ScoreBar({ score, maxPuan, percentage }: {
  score: number; maxPuan: number; percentage: number;
}) {
  let fillColor = "var(--green-signal)";
  if (percentage <= 40) fillColor = "var(--red-signal)";
  else if (percentage <= 65) fillColor = "var(--amber)";

  return (
    <div className="flex items-center gap-[10px]">
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-sm)", color: "var(--text-2)" }}>
        {score.toString().padStart(3, '0')} <span style={{ opacity: 0.5 }}>/</span> {maxPuan}
      </span>
      <div 
        style={{ 
          width: "120px", 
          height: "2px", 
          background: "var(--bg-overlay)", 
          borderRadius: 0,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${Math.min(percentage, 100)}%`,
            height: "100%",
            background: fillColor,
            transition: "width 0.3s ease",
            borderRadius: 0,
          }}
        />
      </div>
    </div>
  );
}

// ── Ana Sayfa ─────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("GUNLUK");
  const [streak, setStreak] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("goat-streak-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStreak(parsed.count || 0);
      } catch {}
    }

    const initDate = new Date().toISOString().split("T")[0];
    const interval = setInterval(() => {
      if (new Date().toISOString().split("T")[0] !== initDate) window.location.reload();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { score, maxPuan, percentage } = useDailyScore();

  if (!isClient) return null;

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
    if (lastDate !== today) currentStreak = isSuccess ? currentStreak + 1 : 0;
    setStreak(currentStreak);
    localStorage.setItem("goat-streak-v1", JSON.stringify({ count: currentStreak, lastDate: today }));
  };

  const todayDate = new Date();
  const dateStrTR = todayDate.toLocaleDateString("tr-TR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).toUpperCase();

  return (
    <div className="min-h-screen">
      <RightPanel />

      <div className="max-w-xl mx-auto px-0 pt-0 pb-[100px]">
        {/* ── Header ─────────────────────────────────────── */}
        <header 
          className="flex items-center justify-between mb-4"
          style={{ background: "var(--bg-void)", borderBottom: "1px solid var(--border-1)", padding: "16px 24px" }}
        >
          <div>
            <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-sm)", fontWeight: 500, letterSpacing: "0.15em", color: "var(--text-0)" }}>
              FEED THE GOAT<span style={{ color: "var(--amber)" }}>.</span>
            </h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", letterSpacing: "0.08em", marginTop: "4px" }}>
              {dateStrTR}
            </p>
          </div>
          <ScoreBar score={score} maxPuan={maxPuan} percentage={percentage} />
        </header>

        {/* ── Tab Navigation ─────────────────────────────── */}
        <nav className="mb-6 px-6">
          <div className="flex tab-container">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-btn flex-1 ${isActive ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Content ─────────────────────────────────────── */}
        <main className="px-6">
          {/* ── GÜNLÜK ──────────────────────────────────── */}
          {activeTab === "GUNLUK" && (
            <div className="space-y-6">
              {/* 1. Sabah Fokus Kartı */}
              <DailyFocusCard />

              {/* 2. Günün Darbesi */}
              <section>
                <WakeUpMessageCard />
              </section>

              {/* 3. Kritik Rutinler */}
              <section>
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>KRİTİK RUTİNLER</span>
                </div>
                <NeverBreak streak={streak} />
              </section>

              {/* 4. İçerik Paylaşımı */}
              <section>
                <ContentSharingSection />
              </section>

              {/* 5. Aktif Görevler */}
              <section>
                <ActiveTasks />
              </section>

              {/* 6. Bonus */}
              <section>
                <div className="flex justify-between items-baseline mb-2">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>BONUS</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)" }}>opsiyonel</span>
                </div>
                <BonusSection />
              </section>
            </div>
          )}

          {activeTab === "SPOR_SAGLIK" && <HealthDashboard />}
          {activeTab === "HAFTALIK" && <WeeklyScreen />}
          {activeTab === "STRATEJI" && <CareerDashboard />}
          {activeTab === "FINANS" && <WarFund />}
        </main>

        {/* ── Sticky Günü Bitir ───────────────────────────── */}
        {activeTab === "GUNLUK" && (
          <EndDayButton
            score={score}
            maxBaseScore={maxPuan * 0.66}
            onFail={() => handleDayEnd(false)}
            onSuccess={() => handleDayEnd(true)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center" style={{ marginTop: "40px", paddingBottom: "100px" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", opacity: 0.4 }}>
          &quot;THIS IS A SERIOUS TOOL FOR A SERIOUS PERSON.&quot;
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
          style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", opacity: 0.4, marginTop: "8px", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          VERİLERİ DIŞA AKTAR
        </button>
      </footer>
    </div>
  );
}
