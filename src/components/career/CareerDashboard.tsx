"use client";

import { useState, useEffect } from "react";
import CareerHeader from "./CareerHeader";
import CareerOrientation from "./CareerOrientation";
import CareerFocusPanel from "./CareerFocusPanel";
import CareerMetrics from "./CareerMetrics";
import CareerFilters, { FilterState } from "./CareerFilters";
import CareerRoadmap from "./CareerRoadmap";
import CareerPhaseSection from "./CareerPhaseSection";
import CareerArchive from "./CareerArchive";

import { CAREER_GOALS, PHASES, Goal, Status } from "@/data/careerGoals";

export default function CareerDashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    phase: "all",
    status: "all",
    category: "all",
    priority: "all",
    quick: "all"
  });

  // Load state from localStorage on mount
  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
    // Combine raw goals with any saved status overrides
    const saved = localStorage.getItem("ftg-career-status-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mergedGoals = CAREER_GOALS.map(g => {
          if (parsed[g.id]) {
            return { ...g, status: parsed[g.id] as Status };
          }
          return g;
        });
        setGoals(mergedGoals);
      } catch {
        setGoals(CAREER_GOALS);
      }
    } else {
      setGoals(CAREER_GOALS);
    }
  }, []);

  const handleUpdateStatus = (id: string, currentStatus: Status) => {
    const sequence: Status[] = ["active", "planned", "waiting", "completed", "removed"];
    const currentIndex = sequence.indexOf(currentStatus);
    const nextStatus = sequence[(currentIndex + 1) % sequence.length];

    const newGoals = goals.map(g => g.id === id ? { ...g, status: nextStatus } : g);
    setGoals(newGoals);

    // Save mapping to localstorage
    const statusMap = newGoals.reduce((acc, g) => ({ ...acc, [g.id]: g.status }), {});
    localStorage.setItem("ftg-career-status-v1", JSON.stringify(statusMap));
  };

  // Process filters
  const filteredGoals = goals.filter(g => {
    // Quick filters override everything
    if (filters.quick !== "all") {
       if (filters.quick === "aktif" && g.status !== "active") return false;
       if (filters.quick === "öğrenme" && g.learningPath.length === 0 && g.courses.length === 0) return false;
       if (filters.quick === "gelir" && g.category !== "sales") return false; // Basic heuristic
       if (filters.quick === "fiziksel" && g.category !== "physical") return false;
    } else {
       // Normal filters
       if (filters.phase !== "all" && g.phase !== filters.phase) return false;
       if (filters.status !== "all" && g.status !== filters.status) return false;
       if (filters.category !== "all" && g.category !== filters.category) return false;
       if (filters.priority !== "all" && g.priority !== filters.priority) return false;
    }
    return true;
  });

  if (!isClient) return null;

  return (
    <section className="pb-16 animate-in fade-in duration-300">
      <CareerHeader />
      <CareerOrientation />
      
      <CareerFocusPanel goals={goals} />
      <CareerMetrics />
      
      <CareerFilters filters={filters} setFilters={setFilters} />
      
      <div className="h-px bg-border my-10 hidden md:block" />

      {/* Roadmap Phase View */}
      <CareerRoadmap phases={PHASES} goals={goals} />

      {/* Phase Detailed Sections */}
      <div className="space-y-6 mt-12 pt-8 border-t border-border">
         <h2 className="text-xl font-bold uppercase tracking-[0.2em] mb-8 text-white">Faz Detayları & Uygulama</h2>
         
         {PHASES.map(phase => {
            const phaseGoals = filteredGoals.filter(g => g.phase === phase.number && g.status !== "removed");
            return phaseGoals.length > 0 ? (
              <CareerPhaseSection 
                 key={phase.number} 
                 phase={phase} 
                 goals={phaseGoals} 
                 onUpdateStatus={handleUpdateStatus} 
              />
            ) : null;
         })}
      </div>

      {/* Archive Section */}
      <CareerArchive goals={goals.filter(g => g.status === "removed")} />

    </section>
  );
}
