"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import MotivationCards from "@/components/MotivationCards";
import DailyTracker from "@/components/DailyTracker";
import WeeklyTracker from "@/components/WeeklyTracker";
import GoalsDashboard from "@/components/GoalsDashboard";
import EndDayButton from "@/components/EndDayButton";
import DarkMirrorModal from "@/components/DarkMirrorModal";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import AggressiveAlert from "@/components/AggressiveAlert";
import ActiveTasks from "@/components/ActiveTasks";
import WarFund from "@/components/WarFund";
import CommunicationSimulator from "@/components/CommunicationSimulator";
import TheArsenal from "@/components/TheArsenal";
import ShadowJournalModal from "@/components/ShadowJournalModal";
import TheManifesto from "@/components/TheManifesto";
import { dailyTasks, weeklyTasks } from "@/data/mock";

export default function Home() {
  /* ── State ────────────────────────────────────────────── */
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [mirrorOpen, setMirrorOpen] = useState(false);
  const [shadowOpen, setShadowOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // We consider a day complete if all daily tasks are done
  // Weekly tasks have a separate progress bar but share the same state object
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
          // Restore checked tasks
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

  const openShadow = useCallback(() => setShadowOpen(true), []);
  const closeShadow = useCallback(() => setShadowOpen(false), []);

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

      {/* Shadow Journal Overlay */}
      <ShadowJournalModal open={shadowOpen} onClose={closeShadow} />

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

        {/* ── Main Grid ──────────────────────────────────── */}
        <main className="px-4 md:px-8 py-6 space-y-8 max-w-6xl mx-auto">
          {/* Motivation */}
          <MotivationCards />

          {/* Aggressive Time-based Alert */}
          <AggressiveAlert doneCount={doneDaily} totalCount={dailyTasks.length} />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Performance */}
          <PerformanceMetrics doneCount={doneDaily} totalCount={dailyTasks.length} refreshKey={refreshKey} />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* The Arsenal */}
          <TheArsenal />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Daily Tracker */}
          <DailyTracker completed={completed} onToggle={toggleTask} />

          {/* Weekly Tracker */}
          <WeeklyTracker completed={completed} onToggle={toggleTask} />

          {/* Active Tasks (Dynamic from DB) */}
          <ActiveTasks />

          {/* Shadow Journal Trigger */}
          <section className="mt-8 mb-4">
            <button
              onClick={openShadow}
              className="w-full brutalist-button bg-surface border-border text-text hover:bg-text hover:text-black uppercase tracking-[0.3em] font-bold py-4"
            >
              Gölge Günlüğü&apos;nü Aç
            </button>
          </section>

          {/* End Day Button */}
          <EndDayButton
            allComplete={allComplete}
            doneCount={doneDaily}
            totalCount={dailyTasks.length}
            completedTasks={completed}
            onFail={openMirror}
            onSuccess={triggerRefresh}
          />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* War Fund */}
          <WarFund />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Communication Simulator */}
          <CommunicationSimulator />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Goals */}
          <GoalsDashboard />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Rules / Manifesto */}
          <TheManifesto />

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
