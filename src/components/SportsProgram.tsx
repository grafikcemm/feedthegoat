"use client";

import { useMemo, useState, useEffect } from "react";

// The sports data extracted from the image
const SPOR_PROGRAMI = [
  {
    day: 1, // Monday
    title: "PAZARTESİ: Upper A",
    items: [
      "ISINMA: Koşu bandında 7 dakika hafif tempo yürüyüş.",
      "Machine Chest Press: 4 Set x 10-12 Tekrar",
      "Lat Pulldown: 3 Set x 10-12 Tekrar",
      "Chest Supported Row: 3 Set x 10-12 Tekrar",
      "Machine Shoulder Press: 3 Set x 10-12 Tekrar",
      "Rope Pushdown: 3 Set x 12-15 Tekrar",
      "Hammer Curl: 3 Set x 12-15 Tekrar",
      "Face Pull: 3 Set x 15-20 Tekrar. (Tükeniş)",
      "ANTRENMAN SONU: 20 Dakika Eğimli Kardiyo",
    ]
  },
  {
    day: 2, // Tuesday
    title: "SALI: Lower A",
    items: [
      "ISINMA: Koşu bandında 7 dakika hafif tempo yürüyüş.",
      "Leg Press: 4 Set x 10-12 Tekrar",
      "Seated Leg Curl: 4 Set x 10-12 Tekrar",
      "Leg Extension: 3 Set x 12-15 Tekrar",
      "Seated Calf Raise: 4 Set x 12-15 Tekrar",
      "Pall of Press: 3 Set x 12-15 Tekrar",
      "Side Plank: 2-3 Set",
      "ANTRENMAN SONU: 20 Dakika Eğimli Kardiyo"
    ]
  },
  {
    day: 3, // Wednesday
    title: "ÇARŞAMBA: AKTİF DİNLENME",
    items: [
      "Koşu bandında 35-45 dakika hafif tempo yürüyüş.",
      "Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 4, // Thursday
    title: "PERŞEMBE: Upper B",
    items: [
      "ISINMA: Koşu bandında 7 dakika hafif tempo yürüyüş.",
      "Incline Press: 4 Set x 8-10 Tekrar",
      "Seated Cable Row: 4 Set x 12-15 Tekrar",
      "Lat Pulldown: 3 Set x 15-20 Tekrar",
      "Seated Lateral Raise: 3x15-20",
      "Pec Deck: 2x12-15",
      "Cable Curl: 3x12-15",
      "Rope Pushdown: 3x12-15",
      "Face Pull: 2x15-20",
      "ANTRENMAN SONU: 20 Dakika Eğimli Kardiyo"
    ]
  },
  {
    day: 5, // Friday
    title: "CUMA: AKTİF DİNLENME",
    items: [
      "Koşu bandında 35-45 dakika hafif tempo yürüyüş.",
      "Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 6, // Saturday
    title: "CUMARTESİ: Lower B",
    items: [
      "Leg Press: 3x10-12",
      "Lying Leg Curl: 4x10-12",
      "Supported Split Squat: 2-3x10-12",
      "Seated Calf Raise: 4x15-20",
      "Dead Bug: 3 set",
      "Pallof Press: 2-3x10-12",
      "ANTRENMAN SONU: 20 Dakika Eğimli Kardiyo"
    ]
  },
  {
    day: 0, // Sunday
    title: "PAZAR: SADECE DİNLENME",
    items: [
      "Tam Dinlenme Günü"
    ]
  }
];

export default function SportsProgram() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dayCompleted, setDayCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const currentDayOfWeek = new Date().getDay();

  const todaysProgram = useMemo(() => {
    return SPOR_PROGRAMI.find(p => p.day === currentDayOfWeek);
  }, [currentDayOfWeek]);

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
    const saved = localStorage.getItem(`goat-sports-${todayStr}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setCheckedItems(parsed.items || {});
          setDayCompleted(parsed.completed || false);
        }, 0);
      } catch {}
    }
  }, [todayStr]);

  const saveState = (newChecked: Record<string, boolean>, newCompleted: boolean) => {
    localStorage.setItem(`goat-sports-${todayStr}`, JSON.stringify({ items: newChecked, completed: newCompleted }));
    
    // Automatically check off "Antrenman" in NeverBreak if dayCompleted changes to true
    if (newCompleted) {
      const nbSaved = localStorage.getItem("goat-never-break-v2");
      if (nbSaved) {
        try {
          const parsed = JSON.parse(nbSaved);
          if (parsed.date === todayStr) {
            parsed.data = { ...(parsed.data || {}), "nb-sports": true };
            if (parsed.failed) delete parsed.failed["nb-sports"];
            if (parsed.reasons) delete parsed.reasons["nb-sports"];
            localStorage.setItem("goat-never-break-v2", JSON.stringify(parsed));
            // Trigger global update
            window.dispatchEvent(new Event("dailyScoreUpdated"));
          }
        } catch {}
      }
    }
  };

  const toggleItem = (idx: number) => {
    const newChecked = { ...checkedItems, [idx]: !checkedItems[idx] };
    setCheckedItems(newChecked);
    saveState(newChecked, dayCompleted);
  };

  const toggleDayComplete = () => {
    const newCompleted = !dayCompleted;
    setDayCompleted(newCompleted);
    saveState(checkedItems, newCompleted);
  };

  if (!isClient || !todaysProgram) return null;

  return (
    <section className="mb-4">
      <div className="border border-border" style={{ backgroundColor: "#111111" }}>
        <div className="p-4 border-b border-border bg-black flex items-center gap-2">
            <span className="text-xl">🏋️‍♂️</span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                SPOR PROGRAMI
            </span>
        </div>

        <div className="p-4 bg-surface/10 space-y-4">
            <h3 className="text-accent-red font-bold text-sm tracking-wide uppercase border-b border-border/50 pb-2">
                {todaysProgram.title}
            </h3>

            <div className="space-y-2">
                {todaysProgram.items.map((item, idx) => {
                    const isDone = checkedItems[idx] || dayCompleted;
                    return (
                        <div 
                            key={idx}
                            onClick={() => toggleItem(idx)}
                            className={`flex items-start gap-3 p-2 border transition-colors cursor-pointer ${
                                isDone ? "border-text bg-surface/5" : "border-border/50 bg-black/20 hover:border-text-muted"
                            }`}
                        >
                            <div className={`w-5 h-5 shrink-0 flex items-center justify-center border font-bold text-[10px] mt-0.5 ${
                                isDone ? "bg-text border-text text-black" : "bg-transparent border-border text-transparent"
                            }`}>
                                ✓
                            </div>
                            <span className={`text-xs leading-relaxed ${isDone ? "text-text-muted line-through opacity-70" : "text-text"}`}>
                                {item}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
                <button 
                    onClick={toggleDayComplete}
                    className={`px-6 py-3 border font-bold text-xs uppercase tracking-widest transition-all ${
                        dayCompleted 
                        ? "bg-accent-green text-black border-accent-green" 
                        : "bg-background text-text border-text hover:bg-surface-hover hover:text-white"
                    }`}
                >
                    {dayCompleted ? "BU GÜNKÜ ANTRENMAN TAMAMLANDI ✓" : "GÜNÜ TAMAMLA"}
                </button>
            </div>
            {dayCompleted && (
                <p className="text-[9px] text-accent-green text-right mt-2 uppercase tracking-wide">
                    * Asla Kırma bileşenindeki Antrenman görevi otomatik işaretlendi.
                </p>
            )}
        </div>
      </div>
    </section>
  );
}
