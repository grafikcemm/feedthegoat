import { Goal } from "@/data/careerGoals";

interface CareerGoalDetailsProps {
  goal: Goal;
}

export default function CareerGoalDetails({ goal }: CareerGoalDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Context & The Plan */}
        <div className="space-y-6">
           {/* Context */}
           <div>
              <div className="text-[9px] uppercase tracking-widest text-text-muted mb-1 flex items-center gap-2"><span className="text-accent-red">🎯</span> BU HEDEF NEDEN ÖNEMLİ?</div>
              <p className="text-sm font-semibold text-white leading-relaxed">{goal.whyItMatters}</p>
           </div>
           
           <div>
              <div className="text-[9px] uppercase tracking-widest text-text-muted mb-1 flex items-center gap-2"><span className="text-accent-amber">🔗</span> HANGİ KARİYER OMURGAMA HİZMET EDİYOR?</div>
              <p className="text-xs text-text-muted/90 italic border-l-2 border-border pl-2 py-1">{goal.supportsCareerTrack}</p>
           </div>

           <div>
              <div className="text-[9px] uppercase tracking-widest text-text-muted mb-1 flex items-center gap-2"><span className="text-accent-green">📦</span> BU HEDEF TAMAMLANINCA ÇIKTI:</div>
              <p className="text-sm font-black text-white bg-surface/30 border border-border p-2">{goal.outcome}</p>
           </div>

           {/* Kısıtlamalar */}
           <div className="border border-accent-amber/30 bg-accent-amber/5 p-3 rounded-sm">
              <div className="text-[9px] uppercase tracking-widest text-accent-amber font-bold mb-1 flex items-center gap-2"><span>⚠️</span> AŞIRI ÖĞRENME UYARISI / SIK YAPILAN HATA:</div>
              <p className="text-xs text-accent-amber/80 font-bold">{goal.avoidThis}</p>
           </div>

           {/* 3 Kademeli Aksiyon */}
           {goal.stepByStepPlan.length > 0 && (
             <div className="pt-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] mb-4 border-b border-border pb-2 text-white">📋 NASIL YAPACAĞIM? (3 SEVİYE AKSİYON)</div>
                <div className="space-y-4">
                  {goal.stepByStepPlan.map((plan, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <span className="text-[9px] uppercase tracking-widest bg-surface border border-border px-1.5 py-0.5 min-w-16 text-center text-accent-amber mt-0.5">
                         {plan.stage}
                       </span>
                       <ul className="text-xs text-text-muted/90 space-y-1.5">
                         {plan.steps.map((step, idx) => (
                           <li key={idx} className="flex items-start gap-2">
                             <span className="text-[8px] opacity-50 mt-1 block shrink-0">■</span>
                             <span>{step}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>

        {/* Right Column: Learning & Meta data */}
        <div className="space-y-6">
           {/* Learning */}
           <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border-b border-border pb-2 text-white">🎓 NASIL ÖĞRENİRİM?</div>
              
              {/* Order */}
              {goal.learningPath.length > 0 && (
                <div className="mb-4 space-y-2">
                   <span className="text-[9px] uppercase tracking-widest text-text-muted mb-1 block">Öğrenme Sırası:</span>
                   {goal.learningPath.map(lp => (
                     <div key={lp.order} className="flex items-start gap-3 bg-surface/10 p-2 border border-border">
                        <span className="text-accent-red font-bold text-xs">{lp.order}.</span>
                        <div>
                           <span className="text-xs font-bold text-white block">{lp.action}</span>
                           <span className="text-[10px] text-text-muted">Durma: {lp.stopPoint}</span>
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {/* Courses */}
              {goal.courses.length > 0 && (
                <div>
                   <span className="text-[9px] uppercase tracking-widest text-text-muted mb-2 block mt-4">Kurslar & Kaynaklar:</span>
                   <ul className="space-y-2 text-xs">
                     {goal.courses.map((course, idx) => (
                       <li key={idx} className="flex flex-col gap-0.5 bg-surface/5 border border-border/50 p-2">
                          <div className="font-bold">{course.name}</div>
                          <div className="flex gap-2 text-[10px] text-text-muted uppercase tracking-widest">
                             <span>Platform: {course.platform}</span>
                             <span>•</span>
                             <span className={course.cost === 'free' ? 'text-accent-green' : 'text-accent-amber'}>{course.cost}</span>
                             <span>•</span>
                             <span>{course.level}</span>
                          </div>
                       </li>
                     ))}
                   </ul>
                </div>
              )}
           </div>

           {/* Metadata metrics */}
           <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              <div className="bg-surface/10 border border-border p-3">
                 <span className="text-[9px] uppercase tracking-widest text-text-muted block">Tahmini Süre</span>
                 <span className="text-xs font-bold">{goal.timeEstimate}</span>
              </div>
              <div className="bg-surface/10 border border-border p-3">
                 <span className="text-[9px] uppercase tracking-widest text-text-muted block">Günlük Efor</span>
                 <span className="text-xs font-bold">{goal.dailyHours}</span>
              </div>
           </div>
           
           <div className="bg-surface/10 border border-border border-l-4 border-l-blue-500 p-3">
              <span className="text-[9px] uppercase tracking-widest text-blue-400 font-bold block mb-1">🚀 İLK AKSİYON:</span>
              <span className="text-xs font-bold leading-relaxed">{goal.firstAction}</span>
           </div>

           <div className="bg-surface/10 border border-border border-l-4 border-l-accent-green p-3">
              <span className="text-[9px] uppercase tracking-widest text-accent-green font-bold block mb-1">✅ BAŞARI METRİĞİ:</span>
              <span className="text-xs font-bold leading-relaxed">{goal.successMetric}</span>
           </div>

           {(goal.nextUnlock.length > 0 || goal.prerequisites.length > 0) && (
             <div className="flex flex-col gap-2 pt-2 border-t border-border">
                {goal.nextUnlock.length > 0 && (
                  <div className="text-xs text-text-muted">
                    <span className="mr-2">🔓 Bu bitince açılacak:</span> 
                    <span className="font-bold text-white uppercase tracking-wider text-[10px] bg-surface px-1.5 py-0.5 border border-border">{goal.nextUnlock.join(", ")}</span>
                  </div>
                )}
                {goal.prerequisites.length > 0 && (
                  <div className="text-xs text-text-muted">
                    <span className="mr-2">🔒 Önkoşul:</span> 
                    <span className="font-bold text-accent-amber uppercase tracking-wider text-[10px] bg-surface px-1.5 py-0.5 border border-border">{goal.prerequisites.join(", ")}</span>
                  </div>
                )}
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
