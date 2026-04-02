import { PhaseInfo, Goal } from "@/data/careerGoals";

interface CareerRoadmapProps {
  phases: PhaseInfo[];
  goals: Goal[];
}

export default function CareerRoadmap({ phases, goals }: CareerRoadmapProps) {
  // Determine active phase (the lowest phase that has an active or planned goal)
  const uncompletedGoals = goals.filter(g => g.status === "active" || g.status === "planned");
  const activePhaseNumber = uncompletedGoals.length > 0 
    ? Math.min(...uncompletedGoals.map(g => g.phase))
    : 6;

  return (
    <div className="brutalist-card bg-surface/10 border-border p-6 mb-12">
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-3">
        <span>🗺️</span> YOL HARİTASI
      </h3>
      
      <div className="flex flex-col gap-4 relative">
        {/* Dikey çizgi */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border z-0 hidden md:block" />

        {phases.map(phase => {
          const phaseGoals = goals.filter(g => g.phase === phase.number);
          const totalGoals = phaseGoals.length;
          const completedGoals = phaseGoals.filter(g => g.status === "completed").length;
          const progressPercent = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);
          const isActive = phase.number === activePhaseNumber;
          const isPassed = phase.number < activePhaseNumber;

          return (
            <div key={phase.number} className="relative z-10 flex gap-4 items-stretch group cursor-pointer" onClick={() => {
                const el = document.getElementById(`phase-${phase.number}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
              {/* Yuvarlak/İkon (Desktop) */}
              <div className={`hidden md:flex shrink-0 w-8 h-8 rounded-full items-center justify-center font-bold text-xs border-2 transition-colors ${
                isActive 
                  ? `bg-background text-white ${phase.color}` 
                  : isPassed
                  ? "bg-text text-background border-text"
                  : "bg-surface border-border text-border"
              }`}>
                {isPassed ? "✓" : phase.number}
              </div>

              {/* Kart */}
              <div className={`flex-1 border p-4 transition-all ${
                isActive 
                  ? `bg-[#0D0D0D] border-x-0 border-r-0 border-y-0 border-l-4 ${phase.color} shadow-[0_0_15px_rgba(255,255,255,0.03)]` 
                  : `bg-surface/5 border-border hover:border-text-muted`
              }`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-text-muted mb-1">
                      {phase.timeframe} {isActive && <span className="text-accent-red ml-2 animate-pulse">● AKTİF</span>}
                    </div>
                    <h4 className={`text-sm md:text-base font-bold uppercase tracking-wider ${isActive ? "text-white" : "text-text-muted"}`}>
                      FAZ {phase.number}: {phase.title}
                    </h4>
                    <p className="text-xs text-text-muted/80 mt-1 italic">
                      &quot;{phase.subtitle}&quot;
                    </p>
                  </div>
                  
                  {/* Progress Block */}
                  <div className="shrink-0 flex flex-col items-start md:items-end min-w-[120px]">
                     <span className="text-[10px] uppercase font-bold text-text-muted block mb-1">İlerleme: {progressPercent}%</span>
                     <div className="w-full md:w-32 h-1.5 bg-surface border border-border mt-1 relative overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 bottom-0 bg-text transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                     </div>
                     <span className="text-[9px] uppercase tracking-widest text-text-muted mt-2 block">
                        Hedef: {totalGoals} | Biten: {completedGoals}
                     </span>
                  </div>
                </div>

                {/* Çıkış Kriterleri - Hoverda veya Aktifken göster */}
                <div className={`pt-3 border-t border-border/50 ${isActive ? 'block' : 'hidden group-hover:block fade-in'}`}>
                  <span className={`text-[9px] uppercase tracking-widest font-bold block mb-2 ${isActive ? 'text-white' : 'text-text-muted'}`}>Odak ve Kriterler:</span>
                  <div className="grid grid-cols-1 gap-1 text-[10px] md:text-xs">
                    {/* Bu fazdaki hedeflerin başlıkları özet olarak */}
                    <div className="text-text-muted mb-2 opacity-80 border-l-2 border-border pl-2 py-1 leading-relaxed">
                       {phase.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
