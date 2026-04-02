"use client";

import { useState } from "react";
import { Goal } from "@/data/careerGoals";

interface CareerArchiveProps {
  goals: Goal[];
}

export default function CareerArchive({ goals }: CareerArchiveProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (goals.length === 0) return null;

  return (
    <div className="mt-12 brutalist-card border-accent-red/50 bg-[#0D0D0D] p-0 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex items-center justify-between hover:bg-red-950/20 transition-colors"
      >
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent-red flex items-center gap-2">
          <span>🚫</span> ÇIKARILDI / 12 AY YAPMA
        </span>
        <span className="text-xs font-bold text-accent-red border border-accent-red/50 px-2 py-1">
          {isOpen ? "KAPAT ↑" : "AÇ ↓"}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 md:p-6 bg-surface/5 border-t border-accent-red/30 fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(goal => (
            <div key={goal.id} className="border border-border p-4 bg-background opacity-80 hover:opacity-100 transition-opacity">
               <h4 className="text-sm font-bold text-white mb-3 tracking-wide">{goal.title}</h4>
               
               <div className="space-y-3">
                 <div>
                   <span className="text-[9px] uppercase tracking-widest text-accent-red font-bold block mb-1">Neden çıkarıldı:</span>
                   <p className="text-xs text-text-muted/90">{goal.removedReason}</p>
                 </div>
                 
                 <div>
                   <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold block mb-1">Tamamen öldü mü?</span>
                   <p className="text-xs italic text-text-muted">{goal.shortDescription}</p>
                 </div>
                 
                 {goal.replacedBy && (
                   <div className="pt-2 border-t border-border/50">
                     <span className="text-[9px] uppercase tracking-widest text-accent-amber font-bold block mb-1">Yerine gelen hedef:</span>
                     <p className="text-xs font-bold text-white bg-surface px-2 py-1 border border-border inline-block">{goal.replacedBy}</p>
                   </div>
                 )}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
