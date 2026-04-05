"use client";

import { useState, useEffect } from "react";

interface FailRecord {
  reason: string;
  suggestion: string;
  date: string;
  taskId: string;
  taskLabel: string;
}

const FAIL_REASONS = [
  { value: "no-time", label: "Zamanım olmadı", suggestion: "Sorun değil. Yarın 15 dk erken başla veya görevi kısalt." },
  { value: "no-energy", label: "Enerjim yoktu / hasta hissettim", suggestion: "Bu geçici. Yarın mini versiyon: sadece 5 dakika bile yap." },
  { value: "forgot", label: "Unuttum", suggestion: "Tetikleyici kur: Kahve = İngilizce, Spor çantası = Antrenman." },
  { value: "external", label: "Dış etken (seyahat, acil durum)", suggestion: "Olağanüstü durum. Zincir kopmadı, sadece durakladı. Yarın devam." },
  { value: "motivation", label: "İsteksizlik / dikkat dağınıklığı", suggestion: "Olur böyle günler. Yarın 2 dakika kuralıyla sadece başlamayı dene." },
];

export default function NeverBreak({ streak = 0 }: { streak?: number }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [showReasonPicker, setShowReasonPicker] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<Record<string, string>>({});
  const [currentDay, setCurrentDay] = useState(new Date().getDay());

  useEffect(() => {
    setTimeout(() => {
      setCurrentDay(new Date().getDay());
    }, 0);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("goat-never-break-v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only load if it's the same day
        if (parsed.date === new Date().toISOString().split("T")[0]) {
          setTimeout(() => {
            setChecked(parsed.data || {});
            setFailed(parsed.failed || {});
            setSelectedReason(parsed.reasons || {});
          }, 0);
        }
      } catch { }
    }
  }, []);

  const saveState = (newChecked: Record<string, boolean>, newFailed: Record<string, boolean>, newReasons: Record<string, string>) => {
    localStorage.setItem(
      "goat-never-break-v2",
      JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        data: newChecked,
        failed: newFailed,
        reasons: newReasons,
      })
    );
    // Dispatch event to recalculate score
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  const toggleSuccess = (id: string) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
    const newChecked = { ...checked, [id]: !checked[id] };
    const newFailed = { ...failed };
    delete newFailed[id]; // Clear fail state if marking as done
    const newReasons = { ...selectedReason };
    delete newReasons[id];
    
    setChecked(newChecked);
    setFailed(newFailed);
    setSelectedReason(newReasons);
    setShowReasonPicker(null);
    saveState(newChecked, newFailed, newReasons);
  };

  const toggleFail = (id: string) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
    if (failed[id]) {
      // If already failed, clear it
      const newFailed = { ...failed };
      delete newFailed[id];
      const newReasons = { ...selectedReason };
      delete newReasons[id];
      setFailed(newFailed);
      setSelectedReason(newReasons);
      setShowReasonPicker(null);
      saveState(checked, newFailed, newReasons);
    } else {
      // Mark as failed and show reason picker
      const newChecked = { ...checked };
      delete newChecked[id]; // Clear success state
      const newFailed = { ...failed, [id]: true };
      setChecked(newChecked);
      setFailed(newFailed);
      setShowReasonPicker(id);
      saveState(newChecked, newFailed, selectedReason);
    }
  };

  const selectReason = (taskId: string, reasonValue: string, taskLabel: string) => {
    const newReasons = { ...selectedReason, [taskId]: reasonValue };
    setSelectedReason(newReasons);
    saveState(checked, failed, newReasons);

    // Save fail record to history
    const reason = FAIL_REASONS.find(r => r.value === reasonValue);
    if (reason) {
      const failRecord: FailRecord = {
        reason: reason.label,
        suggestion: reason.suggestion,
        date: new Date().toISOString(),
        taskId,
        taskLabel,
      };
      
      const historyKey = "goat-never-break-fails-history";
      const existingHistory = localStorage.getItem(historyKey);
      const history: FailRecord[] = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(failRecord);
      // Keep only last 30 records
      if (history.length > 30) history.shift();
      localStorage.setItem(historyKey, JSON.stringify(history));
    }
  };

  const ITEMS = [
    { id: "nb-morning", label: "07:00 Uyanış + Yüze Buz" },
    { id: "nb-teeth", label: "Dişlerini fırçala + listerine gargara yap" },
    { id: "nb-deepwork", label: "Vitaminlerin tamamını iç" },
    { id: "nb-sports", label: "Antrenman (Pzt-Salı-Prş-Cmt)", activeDays: [1, 2, 4, 6] },
    { id: "nb-book", label: "20 sayfa kitap oku" },
  ];

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between border-b border-border pb-2">
        <div>
            <h2 className="text-xl font-bold tracking-wide text-text mb-1 flex items-center gap-2">
              <span className="opacity-80 text-lg">🛡️</span> Kritik Rutinler
            </h2>
            <p className="text-xs text-text-muted">
              Günü kurtaracak temel adımlar. Yarım kalsa da devam et.
            </p>
        </div>
        <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-text-muted block mb-0.5">Mevcut Seri</span>
            <span className="text-base font-bold text-accent-green">{streak} GÜN</span>
        </div>
      </div>

      <div className="space-y-3">
        {ITEMS.map((item) => {
          const isDisabled = item.activeDays && !item.activeDays.includes(currentDay);
          const isDone = checked[item.id];
          const isFailed = failed[item.id];
          const currentReason = selectedReason[item.id];
          const reasonData = FAIL_REASONS.find(r => r.value === currentReason);

          return (
            <div key={item.id} className="space-y-2">
              <div
                className={`flex items-center gap-4 p-4 border transition-all ${
                  isDisabled 
                    ? "opacity-40 cursor-not-allowed border-transparent bg-transparent" 
                    : isFailed
                      ? "border-border bg-surface/5"
                      : isDone
                        ? "border-transparent bg-surface/30"
                        : "border-border bg-surface hover:bg-surface-hover"
                }`}
              >
                {/* Success Button */}
                <button
                  onClick={() => !isDisabled && toggleSuccess(item.id)}
                  disabled={isDisabled}
                  className={`w-10 h-10 shrink-0 flex items-center justify-center border transition-colors ${
                    isDone
                      ? "border-accent-green bg-accent-green text-black"
                      : "border-border bg-transparent text-transparent hover:border-text-muted"
                  } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer rounded-sm"}`}
                  title="Tamamlandı"
                >
                  <span className="text-xl font-bold">✓</span>
                </button>

                {/* Fail Button */}
                <button
                  onClick={() => !isDisabled && toggleFail(item.id)}
                  disabled={isDisabled}
                  className={`w-10 h-10 shrink-0 flex items-center justify-center border transition-colors ${
                    isFailed
                      ? "border-accent-red bg-surface/50 text-accent-red"
                      : "border-border bg-transparent text-transparent hover:border-accent-red/50"
                  } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer rounded-sm"}`}
                  title="Eksik Kaldı"
                >
                  <span className="text-xl font-bold">✗</span>
                </button>

                {/* Label */}
                <div className="flex flex-col flex-1">
                  <span
                    className={`text-[15px] font-medium select-none ${
                        isDone 
                        ? "line-through text-text-muted opacity-50" 
                        : isFailed
                            ? "text-text-muted"
                            : "text-text"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isDisabled && (
                    <span className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Bugün dinlenme / Deaktif</span>
                  )}
                </div>
              </div>

              {/* Reason Picker - Inline */}
              {isFailed && showReasonPicker === item.id && !currentReason && (
                <div className="ml-4 p-4 border border-border bg-surface mt-2 space-y-3">
                  <p className="text-xs text-text-muted font-bold mb-2">
                    Neden eksik kaldı? (Zinciri onarmaya başlayalım)
                  </p>
                  <div className="space-y-1">
                    {FAIL_REASONS.map((reason) => (
                      <button
                        key={reason.value}
                        onClick={() => selectReason(item.id, reason.value, item.label)}
                        className="w-full text-left px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                      >
                        {reason.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Reason + Suggestion */}
              {isFailed && currentReason && reasonData && (
                <div className="ml-4 p-4 bg-surface mt-2 space-y-2 border-l-[3px] border-text-muted">
                  <p className="text-xs text-text-muted">
                    <span className="font-bold text-text">Sebep:</span> {reasonData.label}
                  </p>
                  <p className="text-sm text-text">
                    💡 <span className="opacity-80">{reasonData.suggestion}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
