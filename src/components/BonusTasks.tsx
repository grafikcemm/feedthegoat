"use client";

import { useState, useEffect } from "react";

interface BonusItem {
  id: string;
  label: string;
  activeDays?: number[]; // Days of week (0=Sunday, 1=Monday, etc.)
  hasModal?: boolean;
}

const ENGLISH_PLANS: Record<number, { title: string; duration: string; type: string; tasks: string[] }> = {
  1: {
    title: "Pazartesi | Hafif Başlangıç",
    duration: "20–25 dk",
    type: "Haftaya “başladım” hissi versin, yormasın.",
    tasks: [
      "10 dk: Felse A1/A2 dersi",
      "5 dk: 5 yeni kelime",
      "5–10 dk: O günkü konuyla 4–5 cümle kurarak konuşma"
    ]
  },
  3: {
    title: "Çarşamba | Ana Çalışma",
    duration: "40–45 dk",
    type: "Haftanın en verimli İngilizce günü.",
    tasks: [
      "15 dk: Felse Oxford / ana ders",
      "10 dk: Not çıkarma",
      "10 dk: Gemini ile konuşma pratiği",
      "5–10 dk: Kısa yazı (Örn: Today I studied simple present...)"
    ]
  },
  5: {
    title: "Cuma | Pekiştirme",
    duration: "35–45 dk",
    type: "Yeni konu yükleme, öğrendiğini sağlamlaştır.",
    tasks: [
      "10 dk: Haftalık tekrar",
      "10 dk: Eski kelimeleri test et",
      "10–15 dk: Konuşma pratiği",
      "5–10 dk: Hataları düzeltip yeniden söyleme/yazma"
    ]
  },
  6: {
    title: "Cumartesi | Opsiyonel Bonus",
    duration: "15–20 dk",
    type: "Enerjin varsa pratik yap.",
    tasks: [
      "Seçenek 1: Sadece konuşma pratiği",
      "Seçenek 2: Sadece kısa yazma pratiği"
    ]
  }
};

export default function BonusTasks() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCurrentDay(new Date().getDay());
    }, 0);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("goat-bonus-tasks-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === new Date().toISOString().split("T")[0]) {
          setTimeout(() => {
            setChecked(parsed.data || {});
          }, 0);
        }
      } catch { }
    }
  }, []);

  const toggle = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
    const newChecked = { ...checked, [id]: !checked[id] };
    setChecked(newChecked);
    localStorage.setItem(
      "goat-bonus-tasks-v1",
      JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        data: newChecked,
      })
    );
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  const openEnglishModal = () => {
    setShowModal(true);
  };

  const ITEMS: BonusItem[] = [
    { id: "bn-walk", label: "Sabah 20 dk yürüyüş", activeDays: [2, 3, 5] },
    { id: "bn-english", label: "İngilizce Programı", activeDays: [1, 3, 5, 6], hasModal: true },
    { id: "bn-course", label: "Kişisel bakım" },
  ];

  const todayEnglishPlan = ENGLISH_PLANS[currentDay];

  return (
    <>
      <section className="mt-8 border-t border-border pt-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-wide text-text mb-1 flex items-center gap-2">
            İkincil Aksiyonlar
          </h2>
          <p className="text-xs text-text-muted">
            Bu bölüm opsiyoneldir. Sadece enerji fazlası varsa uygulanır.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ITEMS.map((item) => {
            const isDisabled = item.activeDays && !item.activeDays.includes(currentDay);
            const isDone = checked[item.id];
            
            return (
              <div
                key={item.id}
                onClick={item.hasModal && !isDisabled ? openEnglishModal : () => !isDisabled && toggle(item.id)}
                className={`relative flex items-center justify-between p-4 border transition-all ${
                  isDisabled 
                    ? "opacity-30 cursor-not-allowed border-transparent bg-transparent" 
                    : "cursor-pointer border-border bg-surface hover:bg-surface-hover"
                } ${
                  isDone && !isDisabled
                    ? "border-transparent bg-surface/30"
                    : ""
                }`}
              >
                <div className="flex flex-col flex-1 min-w-0 pr-4">
                  <span
                    className={`text-sm font-medium truncate ${
                      isDisabled 
                        ? "text-text-muted" 
                        : isDone 
                          ? "line-through text-text-muted opacity-50" 
                          : "text-text"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isDisabled && (
                    <span className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Bugün Deaktif</span>
                  )}
                  {item.hasModal && !isDisabled && (
                    <span className="text-[10px] text-accent-amber mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse block"></span> 
                      {todayEnglishPlan ? todayEnglishPlan.duration : "Programı Gör"}
                    </span>
                  )}
                </div>

                {!isDisabled && (
                  <div className={`w-6 h-6 shrink-0 border flex items-center justify-center text-sm rounded-full transition-all ${checked[item.id] ? 'bg-accent-green border-accent-green text-black' : 'border-border bg-transparent'}`}>
                    {checked[item.id] && '✓'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* English Modal Overlay */}
      {showModal && todayEnglishPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in">
          <div className="bg-surface border border-border w-full max-w-sm rounded p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-1">
                  İngilizce
                </h3>
                <h4 className="text-lg font-bold text-accent-green">
                  {todayEnglishPlan.title}
                </h4>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-text-muted italic bg-surface-hover p-2 border-l-2 border-border mb-4">
              {todayEnglishPlan.type}
            </p>

            <ul className="space-y-3 mb-6">
              {todayEnglishPlan.tasks.map((t, idx) => (
                <li key={idx} className="text-sm text-text flex items-start gap-2">
                  <span className="text-accent-amber mt-0.5">•</span>
                  {t}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => {
                 toggle("bn-english");
                 setShowModal(false);
              }}
              className="w-full py-3 bg-text text-black font-bold text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              TAMAMLANDI İŞARETLE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
