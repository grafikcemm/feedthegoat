"use client";

import { useMemo, useState, useEffect } from "react";

// The sports data extracted from the image
const SPOR_PROGRAMI = [
  {
    day: 1, // Monday
    title: "PAZARTESİ: ÜST VÜCUT \"ANA MERKEZ\"",
    items: [
      "ISINMA: Sabah evde koşu bandında 35 dakika hafif tempo yürüyüş.",
      "Machine Chest Press (Makinede Göğüs İtiş): 3 Set x 10-12 Tekrar",
      "Lat Pulldown (Geniş Tutuş Sırt Çekiş): 3 Set x 10-12 Tekrar",
      "Seated Dumbbell veya Machine Shoulder Press: 3 Set x 10-12 Tekrar",
      "Triceps Rope Pushdown (Halatla Arka Kol): 3 Set x 12-15 Tekrar",
      "Dumbbell Hammer Curl (Çekiç Tutuş Ön Kol): 3 Set x 12-15 Tekrar",
      "Face Pull: 3 Set x 15-20 Tekrar. (Tükeniş)",
      "ANTRENMAN SONU: 30 Dakika Eğimli Kardiyo",
      "EVE GELİNCE - Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 2, // Tuesday
    title: "SALI: PASİF DİNLENME",
    items: [
      "ISINMA: Sabah evde koşu bandında 35 dakika hafif tempo yürüyüş.",
      "Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 3, // Wednesday
    title: "ÇARŞAMBA: PASİF DİNLENME",
    items: [
      "ISINMA: Sabah evde koşu bandında 35 dakika hafif tempo yürüyüş.",
      "Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 4, // Thursday
    title: "PERŞEMBE: OMUZ & KOLLAR",
    items: [
      "ISINMA: Sabah evde koşu bandında 35 dakika hafif tempo yürüyüş.",
      "Leg Press: 4 Set x 10-12 Tekrar",
      "Lying Leg Curl (Yüzüstü Arka Bacak): 3 Set x 12-15 Tekrar",
      "Seated Calf Raise (Oturarak Kalf/Baldır): 3 Set x 15-20 Tekrar",
      "Plank (Fıtık Dostu Karın): 3 Set x Max (Titreyip düşene kadar).",
      "ANTRENMAN SONU: 30 Dakika Eğimli Kardiyo",
      "EVE GELİNCE - Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 5, // Friday
    title: "CUMA: PASİF DİNLENME",
    items: [
      "ISINMA: Sabah evde koşu bandında 35 dakika hafif tempo yürüyüş.",
      "Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 6, // Saturday
    title: "CUMARTESİ: EKSİK BÖLGE & CİLA",
    items: [
      "Incline Dumbbell Press (Üst Göğüs İtiş): 3 Set x 10-12 Tekrar",
      "Chest-Supported Row (Göğüs Destekli Sırt Çekiş Makinesi): 3 Set x 10-12 Tekrar",
      "Seated Lateral Raise (Oturarak Yan Omuz Açış): 3 Set x 15 Tekrar",
      "Cable Curl (Kablo ile): 3 Set x 12-15.",
      "Face Pull: 3 Set x 15-20 Tekrar.",
      "ANTRENMAN SONU: 30 Dakika Eğimli Kardiyo",
      "ANTRENMAN SONU: Plank – 3x (titreyene kadar)",
      "EVE GELİNCE - Bilek Aleti – 3x (tükenene kadar)"
    ]
  },
  {
    day: 0, // Sunday
    title: "PAZAR: ŞARJ GÜNÜ",
    items: [
      "Tam Dinlenme",
      "Pazar rutinine odaklan. (Şarj Günü)"
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
