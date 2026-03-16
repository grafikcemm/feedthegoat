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
  { value: "no-time", label: "Zamanım olmadı", suggestion: "Yarın 15 dk erken başla. Hangi görevi kısaltabilirsin?" },
  { value: "no-energy", label: "Enerjim yoktu / hasta hissettim", suggestion: "Bu geçici. Yarın mini versiyon: sadece 5 dakika bile yap." },
  { value: "forgot", label: "Unuttum", suggestion: "Tetikleyici kur: Kahve = İngilizce, Spor çantası = Antrenman." },
  { value: "external", label: "Dış etken (seyahat, acil durum)", suggestion: "Mücbir sebep. Zincir kırılmadı, duraklatıldı. Yarın devam." },
  { value: "motivation", label: "İsteksizlik / motivasyon eksikliği", suggestion: "Sistemi hislerine bırakma. 2 dakika kural: Sadece başla." },
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
    <section className="mt-6 border border-border bg-surface/10 p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-text">
            Asla Kırma
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">
            &ldquo;Zinciri değil, kimliğini koru.&rdquo;
            </p>
        </div>
        <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-text-muted block">SERİ</span>
            <span className="text-sm font-bold text-accent-red">🔥 {streak} GÜN</span>
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
                className={`flex items-center gap-3 p-3 border transition-colors ${
                  isDisabled 
                    ? "opacity-30 cursor-not-allowed border-border" 
                    : isFailed
                      ? "border-accent-red/50"
                      : isDone
                        ? "border-text bg-surface/5"
                        : "border-border bg-surface/20"
                }`}
                style={isFailed ? { backgroundColor: "#1A0808" } : undefined}
              >
                {/* Success Button */}
                <button
                  onClick={() => !isDisabled && toggleSuccess(item.id)}
                  disabled={isDisabled}
                  className={`w-11 h-11 shrink-0 flex items-center justify-center border-2 transition-colors ${
                    isDone
                      ? "border-accent-green bg-accent-green text-background"
                      : "border-border bg-transparent text-transparent hover:border-accent-green/50"
                  } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  title="Yaptım"
                >
                  <span className="text-xl font-bold">✓</span>
                </button>

                {/* Fail Button */}
                <button
                  onClick={() => !isDisabled && toggleFail(item.id)}
                  disabled={isDisabled}
                  className={`w-11 h-11 shrink-0 flex items-center justify-center border-2 transition-colors ${
                    isFailed
                      ? "border-accent-red bg-accent-red text-background"
                      : "border-border bg-transparent text-transparent hover:border-accent-red/50"
                  } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  title="Yapamadım"
                >
                  <span className="text-xl font-bold">✗</span>
                </button>

                {/* Label */}
                <span
                  className={`text-sm md:text-base font-bold select-none flex-1 ${
                    isDone 
                      ? "line-through text-text-muted opacity-70" 
                      : isFailed
                        ? "text-accent-red/80"
                        : "text-text"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Reason Picker - Inline */}
              {isFailed && showReasonPicker === item.id && !currentReason && (
                <div className="ml-4 p-3 border border-accent-red/30 bg-surface/50 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-accent-red font-bold">
                    Neden yapamadın?
                  </p>
                  <div className="space-y-1">
                    {FAIL_REASONS.map((reason) => (
                      <button
                        key={reason.value}
                        onClick={() => selectReason(item.id, reason.value, item.label)}
                        className="w-full text-left px-3 py-2 text-xs text-text-muted hover:text-text hover:bg-surface/80 border border-border hover:border-text-muted transition-colors"
                      >
                        {reason.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Reason + Suggestion */}
              {isFailed && currentReason && reasonData && (
                <div className="ml-4 p-3 border border-accent-red/20 bg-surface/30 space-y-2">
                  <p className="text-[10px] text-accent-red/70">
                    <span className="font-bold">Sebep:</span> {reasonData.label}
                  </p>
                  <p className="text-[11px] text-accent-green italic">
                    💡 {reasonData.suggestion}
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
