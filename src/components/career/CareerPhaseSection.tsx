"use client";

import { useState } from "react";
import { PhaseInfo, Goal, Status } from "@/data/careerGoals";
import CareerGoalCard from "./CareerGoalCard";

interface CareerPhaseSectionProps {
  phase: PhaseInfo;
  goals: Goal[];
  onUpdateStatus: (id: string, newStatus: Status) => void;
}

export default function CareerPhaseSection({ phase, goals, onUpdateStatus }: CareerPhaseSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (goals.length === 0) return null;

  return (
    <div id={`phase-${phase.number}`} className="mb-4 border border-border bg-surface transition-all">
       {/* Phase Header */}
       <div 
         className={`p-5 cursor-pointer flex justify-between items-center transition-colors hover:bg-surface-hover ${isOpen ? 'border-b border-border/50' : ''}`}
         style={{ borderLeftWidth: "4px", borderLeftColor: phase.color.replace('border-', '') }}
         onClick={() => setIsOpen(!isOpen)}
       >
          <div className="flex flex-col gap-1.5">
             <div className="flex items-center gap-3">
               <h3 className={`text-sm md:text-base font-bold tracking-wide ${isOpen ? 'text-text' : 'text-text-muted transition-colors group-hover:text-text'}`}>
                 Faz {phase.number}: {phase.title}
               </h3>
               <span className="text-[10px] uppercase tracking-widest text-text-muted border border-border px-2 py-0.5 bg-background">
                 {phase.timeframe}
               </span>
             </div>
             <p className="text-xs text-text-muted italic">{phase.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted font-medium mr-2">
               {goals.length} Hedef
             </div>
             <div className="text-text-muted text-lg transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
               ↓
             </div>
          </div>
       </div>

       {/* Phase Body (Goals) */}
       <div
         className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}
       >
         <div className="p-4 md:p-6 pb-8 bg-background">
            <div className="mb-6 p-5 border border-border bg-surface text-sm text-text-muted leading-relaxed border-l-2 border-l-text-muted/50">
               <strong className="text-text">Amacı:</strong> {phase.description}
               
               <div className="mt-4 pt-4 border-t border-border/50">
                  <strong className="block mb-2 text-text">Çıkış Kriterleri:</strong>
                  <ul className="space-y-2 list-disc list-inside">
                     {phase.exitCriteria.map((crit, i) => (
                       <li key={i}>{crit}</li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="flex flex-col gap-4">
               {goals.map(goal => (
                 <CareerGoalCard 
                   key={goal.id} 
                   goal={goal} 
                   onUpdateStatus={onUpdateStatus} 
                 />
               ))}
            </div>
         </div>
       </div>
    </div>
  );
}
