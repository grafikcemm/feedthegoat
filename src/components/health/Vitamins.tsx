"use client";
import { useState, useEffect } from "react";

export default function Vitamins() {
  const [checkedGroups, setCheckedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-vitamins-v2-${d}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setCheckedGroups(parsed.checked || {}), 0);
      } catch {}
    }
  }, []);

  const toggleGroup = (groupId: string) => {
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-vitamins-v2-${d}`;
    const newState = { ...checkedGroups, [groupId]: !checkedGroups[groupId] };
    setCheckedGroups(newState);
    localStorage.setItem(key, JSON.stringify({ checked: newState }));
  };

  const GROUPS = [
    {
        id: "sabah",
        title: "SABAH KOMBOSU",
        time: "Uyanınca - Aç Karna",
        items: ["B12", "C Vitamini", "Multivitamin", "D3K2 Damla"]
    },
    {
        id: "gun",
        title: "GÜN İÇİ KOMBOSU",
        time: "Öğle / Akşam Yemeği Sonrası",
        items: ["Omega 3 Jelibonu", "Çinko"]
    },
    {
        id: "gece_spor",
        title: "SPOR SONRASI (GECE)",
        time: "Yatmadan Önce / Spor Sonrası",
        items: ["Kreatin", "Magnezyum", "Glutamine", "ZMA"]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 border border-border bg-surface text-xs text-text-muted mb-6">
         <span className="text-text font-bold uppercase mr-2 tracking-widest text-[10px]">Sistem:</span>
         Tek tek maddeleri işaretlemek yerine seansları (Sabah, Gün İçi, Gece) blok halinde tamamla. Bilişsel yükü azalt.
      </div>

      <div className="space-y-4">
        {GROUPS.map((group) => {
            const isDone = checkedGroups[group.id];

            return (
                <div 
                  key={group.id}
                  onClick={() => toggleGroup(group.id)}
                  className={`border transition-all cursor-pointer p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isDone 
                        ? 'border-accent-green bg-accent-green/5' 
                        : 'border-border bg-surface hover:border-text-muted'
                  }`}
                >
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-6 h-6 shrink-0 border flex items-center justify-center transition-colors ${isDone ? 'border-accent-green bg-accent-green text-black' : 'border-border text-transparent'}`}>
                            <span className="text-sm font-bold mt-0.5">✓</span>
                        </div>
                        <h4 className={`text-lg font-bold tracking-wide ${isDone ? 'text-accent-green' : 'text-text'}`}>
                            {group.title}
                        </h4>
                      </div>
                      <div className="pl-9 space-y-2 text-sm text-text-muted">
                         <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Zaman: {group.time}</p>
                         <ul className={`space-y-1 ${isDone ? 'opacity-50' : ''}`}>
                             {group.items.map((item, idx) => (
                                 <li key={idx} className="flex items-center gap-2">
                                     <span className="w-1 h-1 rounded-full bg-text-muted"></span>
                                     {item}
                                 </li>
                             ))}
                         </ul>
                      </div>
                   </div>

                   <button 
                       className={`w-full md:w-auto px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors border ${
                           isDone ? 'border-transparent text-text-muted hover:text-text' : 'border-border bg-background text-text hover:bg-surface-hover hover:border-text-muted'
                       }`}
                   >
                       {isDone ? 'GERİ AL' : 'PAKETİ ALDIM'}
                   </button>
                </div>
            )
        })}
      </div>
    </div>
  );
}
