"use client";

import { useState } from "react";
import { Goal, Status } from "@/data/careerGoals";
import CareerGoalDetails from "./CareerGoalDetails";

interface CareerGoalCardProps {
  goal: Goal;
  onUpdateStatus: (id: string, currentStatus: Status) => void;
}

const STATUS_CONFIG: Record<Status, { label: string; colorClass: string; borderClass: string; bgClass: string }> = {
  active: { label: "🔴 AKTİF", colorClass: "text-accent-red", borderClass: "border-accent-red", bgClass: "bg-accent-red/10" },
  planned: { label: "🟡 SIRADA", colorClass: "text-accent-amber", borderClass: "border-accent-amber", bgClass: "bg-accent-amber/10" },
  waiting: { label: "🔒 BEKLİYOR", colorClass: "text-text-muted", borderClass: "border-border", bgClass: "bg-surface/20" },
  completed: { label: "🟢 BİTEN", colorClass: "text-accent-green", borderClass: "border-accent-green", bgClass: "bg-accent-green/10" },
  removed: { label: "❌ ÇIKARILDI", colorClass: "text-red-900", borderClass: "border-red-900", bgClass: "bg-red-900/10" }
};

export default function CareerGoalCard({ goal, onUpdateStatus }: CareerGoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[goal.status] || STATUS_CONFIG.waiting;

  return (
    <div 
      id={`goal-${goal.id}`}
      className={`border transition-all duration-300 p-0 overflow-hidden ${
        isExpanded 
          ? "border-border bg-surface/30" 
          : "border-border bg-background hover:bg-surface-hover"
      }`}
    >
      {/* HEADER ROW - Always Visible */}
      <div 
        className="p-4 cursor-pointer flex justify-between items-start gap-4 hover:bg-surface/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
             <button
                onClick={(e) => { e.stopPropagation(); onUpdateStatus(goal.id, goal.status); }}
                className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-[0.2em] border ${statusCfg.bgClass} ${statusCfg.colorClass} ${statusCfg.borderClass} hover:opacity-80 transition-opacity`}
             >
                {statusCfg.label}
             </button>
             
             {/* Tags */}
             <div className="hidden sm:flex items-center gap-2">
               <span className="text-[8px] uppercase tracking-widest bg-surface border border-border px-1.5 py-0.5 text-text-muted">
                 {goal.category}
               </span>
               <span className={`text-[8px] uppercase tracking-widest bg-surface border px-1.5 py-0.5 ${
                 goal.priority === 'critical' ? 'border-accent-red text-accent-red' : 
                 goal.priority === 'important' ? 'border-accent-amber text-accent-amber' : 
                 'border-text-muted/50 text-text-muted/50'
               }`}>
                 P: {goal.priority}
               </span>
             </div>
          </div>
          
          <h4 className={`text-[15px] font-medium leading-snug tracking-wide ${goal.status === 'completed' ? 'text-accent-green opacity-80' : 'text-text'}`}>
            {goal.title}
          </h4>
          
          {!isExpanded && (
            <p className="text-[11px] text-text-muted leading-relaxed mt-2 line-clamp-2 md:line-clamp-1 pr-8">
              {goal.shortDescription}
            </p>
          )}

        </div>

        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded border border-border/50 text-text-muted text-xs font-bold transition-transform group-hover:text-text" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
          ↓
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-border/50 bg-background p-5 pb-6">
           <CareerGoalDetails goal={goal} />
        </div>
      </div>
    </div>
  );
}
