"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import MotivationCards from "@/components/MotivationCards";
import DailyTracker from "@/components/DailyTracker";
import WeeklyTracker from "@/components/WeeklyTracker";
import GoalsDashboard from "@/components/GoalsDashboard";
import EndDayButton from "@/components/EndDayButton";
import DarkMirrorModal from "@/components/DarkMirrorModal";

import AggressiveAlert from "@/components/AggressiveAlert";
import ActiveTasks from "@/components/ActiveTasks";
import WarFund from "@/components/WarFund";
import TheArsenal from "@/components/TheArsenal";
import TheManifesto from "@/components/TheManifesto";
import SkillTree from "@/components/SkillTree";
import ContentArsenal from "@/components/ContentArsenal";
import { dailyTasks, weeklyTasks } from "@/data/mock";

type Tab = "SAVAS" | "BUYUME" | "SISTEM";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "SAVAS", label: "YÖNETİM", icon: "🎯" },
  { key: "BUYUME", label: "BÜYÜME", icon: "📈" },
  { key: "SISTEM", label: "SİSTEM", icon: "🏦" },
];

export default function Home() {
  /* ── State ────────────────────────────────────────────── */
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [mirrorOpen, setMirrorOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("SAVAS");

  // We consider a day complete if all daily tasks are done
  const doneDaily = dailyTasks.filter(t => completed[t.id]).length;
  const allComplete = doneDaily === dailyTasks.length;

  /* ── Initial Data Fetch ───────────────────────────────── */
  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        const dateStr = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("daily_metrics")
          .select("checked_tasks")
          .eq("date", dateStr)
          .single();

        if (!error && data && data.checked_tasks) {
          setCompleted(data.checked_tasks);
        }
      } catch (err) {
        console.error("Error fetching today metrics", err);
      }
    };
    fetchTodayData();
  }, []);

  /* ── Handlers ─────────────────────────────────────────── */
  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const openMirror = useCallback(() => setMirrorOpen(true), []);
  const closeMirror = useCallback(() => {
    setMirrorOpen(false);
    triggerRefresh();
  }, [triggerRefresh]);

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
      {/* Dark Mirror Overlay */}
      <DarkMirrorModal open={mirrorOpen} onClose={closeMirror} />

      <div className="min-h-screen">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="brutalist-border border-t-0 border-x-0 px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-text">
              FEED THE GOAT<span className="text-accent-red">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mt-1">
              Disiplin Paneli
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

          {/* ── TAB: YÖNETİM ────────────────────────────── */}
          {activeTab === "SAVAS" && (
            <>
              {/* Compact Motivation — only in YÖNETİM */}
              <MotivationCards />

              {/* Bilgi Cephaneliği — compact at top */}
              <TheArsenal />

              {/* Aggressive Time-based Alert */}
              <AggressiveAlert doneCount={doneDaily} totalCount={dailyTasks.length} />

              {/* Daily Tracker */}
              <DailyTracker completed={completed} onToggle={toggleTask} />

              {/* Weekly Tracker */}
              <WeeklyTracker completed={completed} onToggle={toggleTask} />

              <div className="h-px bg-border" />

              {/* Active Tasks (Dynamic from DB) */}
              <ActiveTasks />

              <div className="h-px bg-border" />

              {/* End Day Button */}
              <EndDayButton
                allComplete={allComplete}
                doneCount={doneDaily}
                totalCount={dailyTasks.length}
                completedTasks={completed}
                onFail={openMirror}
                onSuccess={triggerRefresh}
              />
            </>
          )}

          {/* ── TAB: BÜYÜME ───────────────────────────── */}
          {activeTab === "BUYUME" && (
            <>
              {/* Skill Tree */}
              <SkillTree />

              <div className="h-px bg-border" />

              {/* Goals */}
              <GoalsDashboard />

              <div className="h-px bg-border" />

              {/* Content Arsenal */}
              <ContentArsenal />
            </>
          )}

          {/* ── TAB: SİSTEM ───────────────────────────── */}
          {activeTab === "SISTEM" && (
            <>
              {/* War Fund */}
              <WarFund />

              <div className="h-px bg-border" />

              {/* Rules / Manifesto */}
              <TheManifesto />
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
