"use client";
import { useState, useEffect } from "react";

export default function WeeklySummary() {
  const [completedSports, setCompletedSports] = useState<number[]>([]);

  useEffect(() => {
    const d = new Date();
    const day = d.getDay() || 7; 
    if (day !== 1) d.setHours(-24 * (day - 1)); 
    const weekKey = `goat-sports-wk-${d.toISOString().split("T")[0]}`;

    const saved = localStorage.getItem(weekKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.completed) {
            const arr = Object.keys(parsed.completed)
                .filter(k => parsed.completed[k])
                .map(Number);
            setTimeout(() => setCompletedSports(arr), 0);
        }
      } catch {}
    }
  }, []);

  const mandatoryTarget = 3;
  const currentMandatoryCount = completedSports.filter(d => [1,2,4].includes(d)).length;
  const hasBonus = completedSports.includes(6);

  let statusText = "Başla";
  let statusColor = "text-text-muted";

  if (currentMandatoryCount >= 3) {
      statusText = hasBonus ? "Harika (Bonus Alındı)" : "Başarılı (Zorunlu Tamam)";
      statusColor = "text-accent-green";
  } else if (currentMandatoryCount > 0) {
      statusText = "Devam Ediyor";
      statusColor = "text-accent-amber";
  }

  return (
    <div className="space-y-6">
       <div className="p-6 bg-surface border border-border text-center space-y-4">
           <h3 className="text-sm uppercase tracking-widest text-text font-bold mb-4">Haftalık Antrenman Hedefi</h3>
           
           <div className="text-6xl font-black font-mono">
               {currentMandatoryCount} <span className="text-2xl text-text-muted">/ {mandatoryTarget}</span>
           </div>

           <div className={`text-sm uppercase tracking-widest font-bold mt-4 ${statusColor}`}>
               Durum: {statusText}
           </div>
       </div>

       <div className="p-4 bg-background border border-border text-xs text-text-muted">
          Bu modül haftalık hedefler ile otomatik senkronize olur. Sadece gününü kurtarmaya odaklan, hafta zaten kurtulacak.
       </div>
    </div>
  )
}
