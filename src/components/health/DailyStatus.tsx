"use client";
import { useState, useEffect } from "react";

export default function DailyStatus() {
  const [status, setStatus] = useState<Record<string, number>>({});
  const [savedToday, setSavedToday] = useState(false);

  useEffect(() => {
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-daily-status-v2-${d}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
            setStatus(parsed.status || {});
            setSavedToday(true);
        }, 0);
      } catch {}
    }
  }, []);

  const saveState = () => {
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-daily-status-v2-${d}`;
    localStorage.setItem(key, JSON.stringify({ status }));
    setSavedToday(true);
  };

  const METRICS = [
      { id: "uyku", label: "Uyku Kalitesi", low: "Kötü/Bölük", high: "Harika" },
      { id: "enerji", label: "Genel Enerji", low: "Tükenmiş", high: "Çok Yüksek" },
      { id: "stres", label: "Stres/Odak", low: "Çok Dağınık/Stresli", high: "Sakin ve Odaklı" },
  ];

  return (
    <div className="space-y-6">
       <div className="p-4 bg-background border border-border">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-2">Günlük Check-in</h3>
          <p className="text-xs text-text-muted">Günün başlangıcında sistemin durumunu kaydet. Bu basit habit, farkındalığı artırır.</p>
       </div>

       <div className="space-y-8 p-6 bg-surface border border-border">
          {METRICS.map((metric) => (
             <div key={metric.id}>
                 <div className="flex justify-between items-end mb-4">
                     <h4 className="font-bold text-text uppercase tracking-wide">{metric.label}</h4>
                     <span className="text-[10px] text-text-muted font-mono uppercase">Değer: {status[metric.id] || "?"} / 5</span>
                 </div>
                 
                 <div className="flex gap-2 h-12">
                     {[1,2,3,4,5].map((val) => {
                         const isActive = status[metric.id] === val;
                         return (
                             <button
                               key={val}
                               onClick={() => {
                                   setStatus({ ...status, [metric.id]: val });
                                   setSavedToday(false);
                               }}
                               className={`flex-1 flex items-center justify-center border transition-all ${
                                   isActive 
                                    ? 'border-accent-green bg-accent-green/10 text-accent-green font-bold text-lg' 
                                    : 'border-border bg-background text-text-muted hover:bg-surface-hover'
                               }`}
                             >
                                 {val}
                             </button>
                         )
                     })}
                 </div>
                 <div className="flex justify-between text-[10px] text-text-muted mt-2 uppercase tracking-widest px-1">
                     <span>{metric.low}</span>
                     <span>{metric.high}</span>
                 </div>
             </div>
          ))}
       </div>

       <div className="flex justify-end pt-4">
          <button 
             onClick={saveState}
             disabled={Object.keys(status).length < 3 || savedToday}
             className="px-8 py-3 bg-text text-black font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
             {savedToday ? "KAYDEDİLDİ ✓" : "DURUMU KAYDET"}
          </button>
       </div>
    </div>
  )
}
