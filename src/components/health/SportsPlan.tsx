"use client";
import { useState, useEffect } from "react";
import CollapsibleBlock from "../CollapsibleBlock";

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
    successRule: "Isınma + ilk 2 hareket tamamlandıysa gün başarılı sayılır.",
    items: [
      "ISINMA: 7 dk hafif tempo yürüyüş",
      "Machine Chest Press: 3x8-10",
      "Lat Pulldown: 3x10-12",
      "Chest Supported Row: 3x10-12",
      "Machine Shoulder Press: 2x10-12",
      "Rope Pushdown: 2x12-15",
      "Hammer Curl: 2x12-15",
      "Face Pull: 2x15-20",
      "ANTRENMAN SONU: 10-15 dk eğimli kardiyo"
    ]
  },
  {
    dayId: 2,
    title: "SALI — Lower A",
    type: "MANDATORY",
    successRule: "Isınma + Leg Press + Seated Leg Curl + Leg Extension tamamlandıysa gün başarılı sayılır.",
    items: [
      "ISINMA: 7 dk hafif tempo yürüyüş",
      "Leg Press: 3x8-10",
      "Seated Leg Curl: 3x10-12",
      "Leg Extension: 2x12-15",
      "Seated Calf Raise: 3x12-15",
      "Pallof Press: 2x10-12",
      "Side Plank: 2 set",
      "ANTRENMAN SONU: 10-15 dk eğimli kardiyo"
    ]
  },
  {
    dayId: 3,
    title: "ÇARŞAMBA — Aktif Dinlenme",
    type: "ACTIVE_REST",
    successRule: "Bugün boş gün değil, aktif toparlanma günü.",
    items: [
       "20-30 dk hafif tempo yürüyüş",
       "İstersen bilek aleti: 2 set",
       "Amaç: sistemi koparmamak"
    ]
  },
  {
    dayId: 4,
    title: "PERŞEMBE — Upper B",
    type: "MANDATORY",
    successRule: "Isınma + ilk 2 hareket yeterlidir.",
    items: [
      "ISINMA: 7 dk hafif tempo yürüyüş",
      "Incline Press: 3x8-10",
      "Seated Cable Row: 3x10-12",
      "Lat Pulldown: 2x12-15",
      "Seated Lateral Raise: 3x15-20",
      "Pec Deck: 2x12-15",
      "Cable Curl: 2x12-15",
      "Rope Pushdown: 2x12-15",
      "Face Pull: 2x15-20",
      "ANTRENMAN SONU: 10-15 dk eğimli kardiyo"
    ]
  },
  {
    dayId: 5,
    title: "CUMA — Aktif Dinlenme",
    type: "ACTIVE_REST",
    successRule: "Amaç: sıfır çekmemek",
    items: [
      "20-30 dk yürüyüş",
      "Yoğun günse minimum 15-20 dakika"
    ]
  },
  {
    dayId: 6,
    title: "CUMARTESİ — Lower B",
    type: "BONUS",
    successRule: "Isınma + Leg Press + Lying Leg Curl tamamlandıysa gün başarılı sayılır.",
    items: [
      "ISINMA: 5-7 dk hafif tempo yürüyüş",
      "Leg Press: 3x10-12",
      "Lying Leg Curl: 3x10-12",
      "Leg Extension: 2x12-15",
      "Seated Calf Raise: 3x15-20",
      "Dead Bug: 2-3 set",
      "Pallof Press: 2x10-12",
      "ANTRENMAN SONU: 10 dk eğimli kardiyo"
    ]
  },
  {
    dayId: 0,
    title: "PAZAR — Sadece Dinlenme",
    type: "REST",
    items: [
      "Salon yok",
      "Tam dinlenme",
      "Erken uyku / haftaya hazırlık"
    ]
  }
];

export default function SportsPlan() {
  const [expandedDay, setExpandedDay] = useState<number>(new Date().getDay());
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dayCompleted, setDayCompleted] = useState<Record<number, boolean>>({});
  
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

    if (new Date().getDay() === dayId) {
      const nbKey = "goat-never-break-v2";
      const nbSaved = localStorage.getItem(nbKey);
      if (nbSaved) {
        try {
          const parsed = JSON.parse(nbSaved);
          if (parsed.date === new Date().toISOString().split("T")[0]) {
            if (newVal) {
                parsed.data = { ...(parsed.data || {}), "nb-sports": true };
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
    <div>
      <div 
        style={{
          borderLeft: "2px solid var(--amber)",
          background: "var(--bg-overlay)",
          padding: "16px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-1)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
            Haftalık İlerleme
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-xs)", color: "var(--text-2)", margin: 0 }}>
            3 zorunlu gün = Başarılı. Cumartesi = Bonus.
          </p>
        </div>
        <div className="flex items-center gap-6 text-center">
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
              ZORUNLU
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-md)", color: "var(--text-1)" }}>
              {mandatoryDoneCount} / 3
            </span>
          </div>
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
              BONUS
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-md)", color: isBonusDone ? "var(--amber)" : "var(--text-3)" }}>
              {isBonusDone ? '1 / 1' : '0 / 1'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[...PLAN].sort((a,b) => (a.dayId === 0 ? 7 : a.dayId) - (b.dayId === 0 ? 7 : b.dayId)).map(day => {
          const isToday = new Date().getDay() === day.dayId;
          const isExpanded = expandedDay === day.dayId;
          const isDone = dayCompleted[day.dayId];

          return (
            <div 
              key={day.dayId} 
              style={{
                border: "1px solid var(--border-0)",
                borderLeft: isToday ? "2px solid var(--amber)" : "1px solid var(--border-0)",
                background: "var(--bg-overlay)",
                borderRadius: 0,
              }}
            >
               <button 
                 onClick={() => setExpandedDay(isExpanded ? -1 : day.dayId)}
                 className="flex items-center justify-between transition-colors w-full cursor-pointer hover:bg-(--bg-hover)"
                 style={{
                   padding: "16px",
                   background: "transparent",
                   border: "none",
                   color: isDone ? "var(--text-2)" : "var(--text-0)",
                   textDecoration: isDone ? "line-through" : "none",
                   opacity: isDone ? 0.5 : 1,
                 }}
               >
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", fontWeight: isToday ? 500 : 400 }}>
                      {day.title}
                    </span>
                    {isToday && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", border: "1px solid var(--amber-border)", color: "var(--amber)", padding: "1px 6px", borderRadius: "2px", textTransform: "uppercase" }}>
                        Bugün
                      </span>
                    )}
                    {isDone && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", background: "var(--amber-dim)", color: "var(--amber)", padding: "2px 6px", borderRadius: "2px", textTransform: "uppercase" }}>
                        Tamamlandı             
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)" }}>
                    {isExpanded ? "AÇIK" : "KAPALI"}
                  </span>
               </button>

               {isExpanded && (
                 <div style={{ padding: "0", borderTop: "1px solid var(--border-1)" }}>
                    {day.successRule && (
                        <div style={{ padding: "12px 16px", background: "var(--bg-hover)", borderLeft: "3px solid var(--text-2)", fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-2)", fontStyle: "italic", marginBottom: "8px" }}>
                            {day.successRule}
                        </div>
                    )}
                    
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {day.items.map((item, idx) => {
                            const key = `${day.dayId}-${idx}`;
                            const isChecked = checkedItems[key] || isDone;

                            return (
                                <div 
                                    key={idx}
                                    onClick={() => day.type !== 'REST' && toggleItem(day.dayId, idx)}
                                    className={day.type !== 'REST' ? 'cursor-pointer hover:bg-(--bg-hover)' : ''}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      height: "40px",
                                      padding: "0 16px 0 0",
                                      borderBottom: "1px solid var(--border-1)",
                                    }}
                                >
                                    <div 
                                      style={{ 
                                        width: "2px", 
                                        height: "100%", 
                                        background: isChecked ? "var(--amber)" : "transparent",
                                        marginRight: "14px",
                                        transition: "background 0.2s" 
                                      }} 
                                    />
                                    <span 
                                      style={{
                                        flex: 1,
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "var(--size-sm)",
                                        color: isChecked ? "var(--text-2)" : "var(--text-1)",
                                        textDecoration: isChecked ? "line-through" : "none",
                                      }}
                                    >
                                        {item}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {day.type !== "REST" && (
                        <div style={{ padding: "16px", display: "flex", justifyContent: "flex-end" }}>
                            <button 
                                onClick={() => toggleDayComplete(day.dayId)}
                                className="hover:bg-(--amber-dim) transition-colors"
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "var(--size-xs)",
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  border: "1px solid",
                                  borderColor: isDone ? "var(--text-2)" : "var(--amber-border)",
                                  color: isDone ? "var(--text-2)" : "var(--amber)",
                                  background: "transparent",
                                  padding: "8px 20px",
                                  borderRadius: "2px",
                                  cursor: "pointer",
                                }}
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
