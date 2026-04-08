import { Goal } from "@/data/careerGoals";

interface CareerFocusPanelProps {
  goals: Goal[];
}

export default function CareerFocusPanel({ goals }: CareerFocusPanelProps) {
  const uncompletedGoals = goals.filter(g => g.status === "active" || g.status === "planned");
  
  if (uncompletedGoals.length === 0) {
     return null;
  }

  const currentPhase = Math.min(...uncompletedGoals.map(g => g.phase));

  const focusGoals = uncompletedGoals
    .filter(g => g.phase === currentPhase)
    .sort((a, b) => {
      const priorityWeights = { critical: 3, important: 2, normal: 1 };
      const statusWeights = { active: 2, planned: 1 };

      const statusDiff = statusWeights[b.status as keyof typeof statusWeights] - statusWeights[a.status as keyof typeof statusWeights];
      if (statusDiff !== 0) return statusDiff;

      const prioDiff = priorityWeights[b.priority as keyof typeof priorityWeights] - priorityWeights[a.priority as keyof typeof priorityWeights];
      return prioDiff;
    })
    .slice(0, 3);

  if (focusGoals.length === 0) return null;

  return (
    <div 
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--border-0)",
        borderLeft: "2px solid var(--amber)",
        borderRadius: "0px",
        padding: "20px",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--size-xs)",
          color: "var(--text-2)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderBottom: "1px solid var(--border-1)",
          paddingBottom: "12px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ color: "var(--amber)" }}>🔥</span> ŞU AN SADECE BUNLARA ODAKLAN
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {focusGoals.map(goal => (
          <div 
            key={goal.id} 
            className="flex flex-col justify-between transition-all cursor-pointer group hover:bg-(--bg-hover)" 
            style={{
              background: "transparent",
              border: "1px solid var(--border-0)",
              padding: "16px",
            }}
            onClick={() => {
              const el = document.getElementById(`goal-${goal.id}`);
              if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          >
            <div>
               <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span>Faz {goal.phase}</span>
                  <span style={{ color: goal.priority === "critical" ? "var(--red-signal)" : "var(--amber)" }}>
                    {goal.priority}
                  </span>
               </div>
               <h4 
                 className="group-hover:text-(--amber) transition-colors"
                 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-1)", fontWeight: 500, marginBottom: "8px", lineHeight: 1.3 }}
               >
                 {goal.title}
               </h4>
               <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-xs)", color: "var(--text-2)", lineHeight: 1.5 }} className="line-clamp-2">
                 {goal.shortDescription}
               </p>
            </div>
            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-1)" }}>
               <span 
                 style={{ 
                   fontFamily: "var(--font-mono)", 
                   fontSize: "9px", 
                   color: "var(--text-1)", 
                   textTransform: "uppercase",
                   background: "transparent",
                   border: "1px solid var(--border-0)",
                   padding: "2px 8px",
                   display: "inline-flex",
                   alignItems: "center",
                   gap: "6px",
                 }}
               >
                  GİT <span>→</span>
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
