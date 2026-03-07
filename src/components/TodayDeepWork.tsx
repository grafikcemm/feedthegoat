"use client";

import { useState, useEffect } from "react";

interface ActiveTask {
    id: string;
    title: string;
    is_completed: boolean;
    is_urgent?: boolean;
    priority: "P1" | "P2" | "P3";
}

export default function TodayDeepWork() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ActiveTask[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const savedSelected = localStorage.getItem("goat-deep-work-id-v1");
    if (savedSelected) {
       setTimeout(() => setSelectedTaskId(savedSelected), 0);
    }
  }, []);

  useEffect(() => {
    if (isSelecting) {
      const savedTasks = localStorage.getItem("goat-active-tasks-v2");
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks);
          // Only show non-completed tasks
          setTimeout(() => setTasks(parsed.filter((t: ActiveTask) => !t.is_completed)), 0);
        } catch {}
      }
    }
  }, [isSelecting]);

  const handleSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    localStorage.setItem("goat-deep-work-id-v1", taskId);
    setIsSelecting(false);
  };

  // If not selecting, we still want to show the title if we have an ID
  const displayTitle = selectedTaskId 
    ? (tasks.find(t => t.id === selectedTaskId)?.title || localStorage.getItem("goat-deep-work-title-fallback") || "Seçilen görev bulunamadı")
    : "Bugünün derin işini seç →";

  // Cache title just in case activeTasks unmounts or changes
  useEffect(() => {
    if (selectedTaskId && tasks.length > 0) {
      const t = tasks.find(t => t.id === selectedTaskId);
      if (t) localStorage.setItem("goat-deep-work-title-fallback", t.title);
    }
  }, [selectedTaskId, tasks]);


  return (
    <section className="mt-6">
      <div className="border border-text p-4 md:p-6 bg-surface/5 relative group">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-amber" />
        <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted mb-3 pl-2">
          BUGÜNÜN DERİN İŞİ
        </h2>
        <div className="h-px bg-border/50 w-full mb-4" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
           <span className={`text-base md:text-lg font-bold ${!selectedTaskId ? 'text-text-muted italic' : 'text-text'}`}>
             {displayTitle}
           </span>
           <button 
             onClick={() => setIsSelecting(!isSelecting)}
             className="text-xs font-bold uppercase tracking-widest text-accent-amber hover:text-text transition-colors shrink-0 flex items-center gap-2 border border-accent-amber/30 px-3 py-1.5"
           >
             Değiştir →
           </button>
        </div>

        {/* Selection Dropdown/List */}
        {isSelecting && (
           <div className="mt-4 p-4 border border-border bg-background max-h-64 overflow-y-auto">
             {tasks.length === 0 ? (
               <p className="text-xs text-text-muted">Aktif görev bulunamadı.</p>
             ) : (
               <div className="space-y-2">
                 {tasks.map(t => (
                   <button
                     key={t.id}
                     onClick={() => handleSelect(t.id)}
                     className="w-full text-left p-3 border border-border bg-surface/10 hover:border-accent-amber transition-colors flex items-center gap-3"
                   >
                     <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border shrink-0 ${
                       t.priority === 'P1' ? 'border-accent-red text-accent-red bg-accent-red/10' :
                       t.priority === 'P2' ? 'border-accent-amber text-accent-amber bg-accent-amber/5' :
                       'border-border text-text-muted bg-surface/30'
                     }`}>
                       {t.priority}
                     </span>
                     <span className="text-sm font-bold text-text truncate">{t.title}</span>
                   </button>
                 ))}
               </div>
             )}
           </div>
        )}
      </div>
    </section>
  );
}
