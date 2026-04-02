"use client";
import { useState, useEffect } from "react";

type DayPlan = {
  dayId: number; // 1=Mon, 2=Tue, 3=Wed... 0=Sun
  title: string;
  type: "MANDATORY" | "REST" | "ACTIVE_REST" | "BONUS";
  successRule?: string;
  items: string[];
};

const PLAN: DayPlan[] = [
  {
    dayId: 1,
    title: "PAZARTESİ — Upper A",
    type: "MANDATORY",
    successRule: "Isınma + ilk 3 hareket tamamlandıysa gün başarılı sayılır.",
    items: [
      "ISINMA: Koşu bandında 7 dakika hafif tempo yürüyüş",
      "Machine Chest Press: 4 set x 10-12 tekrar",
      "Lat Pulldown: 3 set x 10-12 tekrar",
      "Chest Supported Row: 3 set x 10-12 tekrar",
      "Machine Shoulder Press: 3 set x 10-12 tekrar",
      "Rope Pushdown: 3 set x 12-15 tekrar",
      "Hammer Curl: 3 set x 12-15 tekrar",
      "Face Pull: 3 set x 15-20 tekrar",
      "ANTRENMAN SONU: 10-15 dakika eğimli kardiyo"
    ]
  },
  {
    dayId: 2,
    title: "SALI — Lower A",
    type: "MANDATORY",
    successRule: "Isınma + Leg Press + Seated Leg Curl + Leg Extension tamamlandıysa gün başarılı sayılır.",
    items: [
      "ISINMA: Koşu bandında 7 dakika hafif tempo yürüyüş",
      "Leg Press: 4 set x 10-12 tekrar",
      "Seated Leg Curl: 4 set x 10-12 tekrar",
      "Leg Extension: 3 set x 12-15 tekrar",
      "Seated Calf Raise: 4 set x 12-15 tekrar",
      "Pallof Press: 3 set x 12-15 tekrar",
      "Side Plank: 2-3 set",
      "ANTRENMAN SONU: 10-15 dakika eğimli kardiyo"
    ]
  },
  {
    dayId: 3,
    title: "ÇARŞAMBA — Aktif Dinlenme",
    type: "ACTIVE_REST",
    successRule: "Bugün boş gün değil, aktif toparlanma günü.",
    items: [
       "20-30 dakika hafif tempo yürüyüş",
       "İstersen bilek aleti: 2-3 set",
       "Amaç: sistemi koparmamak"
    ]
  },
  {
    dayId: 4,
    title: "PERŞEMBE — Upper B",
    type: "MANDATORY",
    successRule: "Isınma + ilk 3 hareket yeterlidir.",
    items: [
      "ISINMA: Koşu bandında 7 dakika hafif tempo yürüyüş",
      "Incline Press: 4 set x 8-10 tekrar",
      "Seated Cable Row: 4 set x 12-15 tekrar",
      "Lat Pulldown: 3 set x 12-15 tekrar",
      "Seated Lateral Raise: 3 set x 15-20 tekrar",
      "Pec Deck: 2 set x 12-15 tekrar",
      "Cable Curl: 3 set x 12-15 tekrar",
      "Rope Pushdown: 3 set x 12-15 tekrar",
      "Face Pull: 2 set x 15-20 tekrar",
      "ANTRENMAN SONU: 10-15 dakika eğimli kardiyo"
    ]
  },
  {
    dayId: 5,
    title: "CUMA — Aktif Dinlenme",
    type: "ACTIVE_REST",
    successRule: "Amaç: sıfır çekmemek",
    items: [
      "20-30 dakika yürüyüş",
      "Yoğun günse minimum 15-20 dakika"
    ]
  },
  {
    dayId: 6,
    title: "CUMARTESİ — Lower B",
    type: "BONUS",
    successRule: "Bel rahatsız ederse Supported Split Squat yerine Leg ext. yapılabilir.",
    items: [
      "Leg Press: 3 set x 10-12 tekrar",
      "Lying Leg Curl: 4 set x 10-12 tekrar",
      "Supported Split Squat: 2-3 set x 10-12 tekrar",
      "Seated Calf Raise: 4 set x 15-20 tekrar",
      "Dead Bug: 3 set",
      "Pallof Press: 2-3 set x 10-12 tekrar",
      "ANTRENMAN SONU: 10-15 dakika eğimli kardiyo"
    ]
  },
  {
    dayId: 0,
    title: "PAZAR — Sadece Dinlenme",
    type: "REST",
    items: [
      "Salon yok",
      "İsteğe bağlı 15-20 dakika hafif yürüyüş",
      "Erken uyku / haftaya hazırlık"
    ]
  }
];

export default function SportsPlan() {
  const [expandedDay, setExpandedDay] = useState<number>(new Date().getDay());
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dayCompleted, setDayCompleted] = useState<Record<number, boolean>>({});
  
  // Basic generic key based on beginning of current week (Monday)
  const getWeekKey = () => {
    const d = new Date();
    const day = d.getDay() || 7; 
    if (day !== 1) d.setHours(-24 * (day - 1)); 
    return `goat-sports-wk-${d.toISOString().split("T")[0]}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem(getWeekKey());
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
            setCheckedItems(parsed.items || {});
            setDayCompleted(parsed.completed || {});
        }, 0);
      } catch {}
    }
  }, []);

  const saveState = (items: Record<string, boolean>, completed: Record<number, boolean>) => {
    localStorage.setItem(getWeekKey(), JSON.stringify({ items, completed }));
  };

  const toggleItem = (dayId: number, itemIdx: number) => {
    const key = `${dayId}-${itemIdx}`;
    const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newChecked);
    saveState(newChecked, dayCompleted);
  };

  const toggleDayComplete = (dayId: number) => {
    const newVal = !dayCompleted[dayId];
    const newCompleted = { ...dayCompleted, [dayId]: newVal };
    setDayCompleted(newCompleted);
    saveState(checkedItems, newCompleted);

    // Sync with NeverBreak ONLY if it's today
    if (new Date().getDay() === dayId) {
      const nbKey = "goat-never-break-v2";
      const nbSaved = localStorage.getItem(nbKey);
      if (nbSaved) {
        try {
          const parsed = JSON.parse(nbSaved);
          if (parsed.date === new Date().toISOString().split("T")[0]) {
            if (newVal) {
                parsed.data = { ...(parsed.data || {}), "nb-sports": true };
                if (parsed.failed) delete parsed.failed["nb-sports"];
                if (parsed.reasons) delete parsed.reasons["nb-sports"];
            } else {
                delete parsed.data["nb-sports"];
            }
            localStorage.setItem(nbKey, JSON.stringify(parsed));
            window.dispatchEvent(new Event("dailyScoreUpdated"));
          }
        } catch {}
      }
    }
  };

  const mandatoryDoneCount = [1, 2, 4].filter(d => dayCompleted[d]).length;
  const isBonusDone = dayCompleted[6];

  return (
    <div className="space-y-6">
       <div className="p-4 bg-surface border-l-4 border-accent-green mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-text uppercase tracking-widest text-sm mb-1">Haftalık İlerleme</h3>
            <p className="text-xs text-text-muted">3 zorunlu gün = Başarılı. Cumartesi = Bonus.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
                <span className="block text-[10px] text-text-muted uppercase tracking-widest mb-1">Zorunlu</span>
                <span className="text-sm font-bold font-mono text-text">{mandatoryDoneCount} / 3</span>
            </div>
            <div className="text-center">
                <span className="block text-[10px] text-text-muted uppercase tracking-widest mb-1">Bonus</span>
                <span className={`text-sm font-bold font-mono ${isBonusDone ? 'text-accent-green' : 'text-text-muted'}`}>
                    {isBonusDone ? '1 / 1' : '0 / 1'}
                </span>
            </div>
          </div>
       </div>

       <div className="border border-border/50 bg-black/50 p-4 space-y-2 text-xs text-text-muted">
         <div className="font-bold text-text uppercase tracking-widest mb-2 border-b border-border/50 pb-2">Kurallar</div>
         <p>• İlk 3 hafta hedef mükemmel antrenman değil, devamlılık.</p>
         <p>• Tükenişe gitme. Set sonunda 1-3 tekrar daha çıkarabilecek gibi kal.</p>
         <p>• Ağırlık artışı: Tüm setlerde üst tekrar sınırına ulaşınca küçük kilo artır.</p>
       </div>

       <div className="space-y-4">
         {/* Sort putting Sunday at the end */}
         {[...PLAN].sort((a,b) => (a.dayId === 0 ? 7 : a.dayId) - (b.dayId === 0 ? 7 : b.dayId)).map(day => {
            const isToday = new Date().getDay() === day.dayId;
            const isExpanded = expandedDay === day.dayId;
            const isDone = dayCompleted[day.dayId];

            return (
              <div key={day.dayId} className={`border border-border bg-surface transition-all ${isToday ? 'border-accent-green/50' : ''}`}>
                 <button 
                   onClick={() => setExpandedDay(isExpanded ? -1 : day.dayId)}
                   className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                 >
                    <div className="flex items-center gap-3">
                        {day.type === "MANDATORY" && <span className="w-2 h-2 rounded-full bg-accent-red mt-0.5" title="Zorunlu"></span>}
                        {day.type === "BONUS" && <span className="w-2 h-2 rounded-full bg-accent-amber mt-0.5" title="Bonus"></span>}
                        {day.type === "ACTIVE_REST" && <span className="w-2 h-2 rounded-full bg-accent-green mt-0.5" title="Aktif Dinlenme"></span>}
                        <span className={`font-bold text-sm tracking-wider ${isDone ? 'line-through text-text-muted opacity-50' : 'text-text'}`}>
                            {day.title}
                        </span>
                        {isToday && <span className="px-2 py-0.5 bg-accent-green/10 text-accent-green text-[9px] font-bold uppercase tracking-widest border border-accent-green/20">Bugün</span>}
                        {isDone && <span className="px-2 py-0.5 text-black bg-accent-green text-[9px] font-bold uppercase tracking-widest">Tamamlandı</span>}
                    </div>
                    <span className="text-text-muted">{isExpanded ? '▼' : '►'}</span>
                 </button>

                 {isExpanded && (
                     <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
                        {day.successRule && (
                            <div className="bg-surface-hover p-3 text-[11px] text-text-muted font-medium border-l-[3px] border-text-muted italic">
                                {day.successRule}
                            </div>
                        )}
                        
                        <div className="space-y-1">
                            {day.items.map((item, idx) => {
                                const key = `${day.dayId}-${idx}`;
                                const isChecked = checkedItems[key] || isDone;

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => day.type !== 'REST' && toggleItem(day.dayId, idx)}
                                        className={`flex items-start gap-3 p-2.5 transition-colors ${day.type !== 'REST' ? 'cursor-pointer hover:bg-surface-hover' : ''}`}
                                    >
                                        {day.type !== 'REST' && (
                                            <div className={`w-5 h-5 shrink-0 border flex items-center justify-center text-[10px] font-bold transition-colors mt-0.5 ${isChecked ? 'bg-text text-black border-text' : 'border-border text-transparent'}`}>
                                                ✓
                                            </div>
                                        )}
                                        <span className={`text-[13px] ${isChecked ? 'text-text-muted opacity-70 line-through' : 'text-text'}`}>
                                            {item}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {day.type !== "REST" && (
                            <div className="pt-4 border-t border-border/50 flex justify-end">
                                <button 
                                    onClick={() => toggleDayComplete(day.dayId)}
                                    className={`px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all border ${
                                        isDone ? "bg-accent-green text-black border-accent-green" : "bg-transparent text-text border-text hover:bg-surface-hover"
                                    }`}
                                >
                                    {isDone ? "GÜNÜ GERİ AL" : (day.type === "ACTIVE_REST" ? "RİTMİ KORUDUM (BİTİR)" : "GÜNÜ TAMAMLA")}
                                </button>
                            </div>
                        )}
                     </div>
                 )}
              </div>
            )
         })}
       </div>
    </div>
  )
}
