import { Goal } from "@/data/careerGoals";

interface CareerFocusPanelProps {
  goals: Goal[];
}

export default function CareerFocusPanel({ goals }: CareerFocusPanelProps) {
  // Logic: "Şimdi Odaklan" paneli sace aktif olan **en düşük faz numarasındaki** kritik hedefleri gösterir.
  
  // 1. Get all active and planned goals to determine the current minimum active phase
  // Actually, only 'active' or 'planned' goals are uncompleted. Let's find the current running phase.
  const uncompletedGoals = goals.filter(g => g.status === "active" || g.status === "planned");
  
  if (uncompletedGoals.length === 0) {
     return null; // All done or removed!
  }

  // Find the lowest phase number among uncompleted goals
  const currentPhase = Math.min(...uncompletedGoals.map(g => g.phase));

  // Filter only goals in the current phase that are 'active' or 'planned' (prioritize active)
  const focusGoals = uncompletedGoals
    .filter(g => g.phase === currentPhase)
    .sort((a, b) => {
      // Sort by priority first: critical > important > normal
      const priorityWeights = { critical: 3, important: 2, normal: 1 };
      const statusWeights = { active: 2, planned: 1 };

      const statusDiff = statusWeights[b.status as keyof typeof statusWeights] - statusWeights[a.status as keyof typeof statusWeights];
      if (statusDiff !== 0) return statusDiff; // actives first

      const prioDiff = priorityWeights[b.priority as keyof typeof priorityWeights] - priorityWeights[a.priority as keyof typeof priorityWeights];
      return prioDiff;
    })
    .slice(0, 3); // Max 3 items

  if (focusGoals.length === 0) return null;

  return (
    <div className="brutalist-card bg-[#0D0D0D] p-5 border-l-4 border-l-accent-red mb-8">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-red mb-4 flex items-center gap-2">
        <span>🔥</span> ŞU AN SADECE BUNLARA ODAKLAN
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {focusGoals.map(goal => (
          <div key={goal.id} className="border border-border p-4 bg-surface/5 flex flex-col justify-between hover:bg-surface/20 transition-all cursor-pointer group" onClick={() => {
            const el = document.getElementById(`goal-${goal.id}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}>
            <div>
               <div className="text-[9px] font-bold text-text-muted mb-2 tracking-widest uppercase flex justify-between">
                  <span>Faz {goal.phase}</span>
                  <span className={goal.priority === "critical" ? "text-accent-red" : "text-accent-amber"}>
                    {goal.priority}
                  </span>
               </div>
               <h4 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-accent-red transition-colors">{goal.title}</h4>
               <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{goal.shortDescription}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50">
               <span className="text-[10px] uppercase font-bold text-text bg-surface px-2 py-1 flex items-center gap-2 w-max shadow-sm border border-border">
                  GİT <span>→</span>
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
