"use client";

import { useState } from "react";
import { Sunrise, Smile, Pill, Dumbbell, BookOpen } from "lucide-react";
import VitaminCheckModal from "@/components/VitaminCheckModal";
import { useToast } from "@/components/Toast";

interface RoutineItem {
  id: string;
  label: string;
  puan: number;
  icon: React.ElementType;
  activeDays?: number[];
  openVitaminModal?: boolean;
}

const ITEMS: RoutineItem[] = [
  {
    id: "wake_up",
    label: "06:30 Uyanış + Yüze Buz",
    puan: 15,
    icon: Sunrise,
  },
  {
    id: "teeth",
    label: "Dişlerini fırçala + gargara yap",
    puan: 5,
    icon: Smile,
  },
  {
    id: "vitamins",
    label: "Vitaminlerin tamamını iç",
    puan: 5,
    icon: Pill,
    openVitaminModal: true,
  },
  {
    id: "workout",
    label: "Antrenman (Pzt/Sal/Prş/Cmt)",
    puan: 20,
    icon: Dumbbell,
    activeDays: [1, 2, 4, 6],
  },
  {
    id: "reading",
    label: "15 sayfa kitap oku",
    puan: 10,
    icon: BookOpen,
  },
];

export default function NeverBreak({ streak = 0 }: { streak?: number }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("goat-never-break-v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === new Date().toISOString().split("T")[0]) {
          return parsed.data || {};
        }
      } catch {}
    }
    return {};
  });
  const [currentDay] = useState(() => new Date().getDay());
  const [vitaminModalOpen, setVitaminModalOpen] = useState(false);
  const { showToast } = useToast();

  const _ = streak;

  const saveState = (newChecked: Record<string, boolean>) => {
    localStorage.setItem(
      "goat-never-break-v2",
      JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        data: newChecked,
      })
    );
    window.dispatchEvent(new Event("dailyScoreUpdated"));
  };

  const toggleItem = (id: string, isDisabled: boolean) => {
    if (isDisabled) return;
    
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }
    
    const isNewDone = !checked[id];
    const newChecked = { ...checked, [id]: isNewDone };
    
    if (isNewDone) {
      const item = ITEMS.find((i) => i.id === id);
      if (item) showToast(`+${item.puan}p — iyi iş`);
      
      const allRoutines = ITEMS.filter((i) => !i.activeDays || i.activeDays.includes(currentDay));
      const allDone = allRoutines.every((i) => newChecked[i.id]);
      if (allDone) {
        setTimeout(() => showToast("Rutinlerin tamam. Güçlü bir başlangıç."), 500);
      }
    }
    
    setChecked(newChecked);
    saveState(newChecked);
  };

  const handleVitaminComplete = () => {
    toggleItem("vitamins", false);
  };

  const handleItemClick = (item: RoutineItem, isDisabled: boolean) => {
    if (isDisabled) return;
    if (item.openVitaminModal && !checked[item.id]) {
      setVitaminModalOpen(true);
      return;
    }
    toggleItem(item.id, isDisabled);
  };

  const orderedItems = [...ITEMS].sort((a, b) => {
    const aDone = checked[a.id] ? 1 : 0;
    const bDone = checked[b.id] ? 1 : 0;
    return aDone - bDone;
  });

  return (
    <>
      <VitaminCheckModal
        isOpen={vitaminModalOpen}
        onClose={() => setVitaminModalOpen(false)}
        onComplete={handleVitaminComplete}
      />

      <div className="flex flex-col">
        {orderedItems.map((item) => {
          const isDisabled = !!(item.activeDays && !item.activeDays.includes(currentDay));
          const isDone = checked[item.id];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item, isDisabled)}
              className="group flex items-center transition-all duration-200"
              style={{
                height: "40px",
                padding: "0 16px",
                borderBottom: "1px solid var(--border-1)",
                background: isDone ? "var(--bg-hover)" : "transparent",
                opacity: isDone ? 0.35 : isDisabled ? 0.2 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
                position: "relative",
              }}
              title={isDisabled ? "Bugün antrenman yok" : ""}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  border: `1px solid ${isDone ? "var(--amber)" : "var(--border-0)"}`,
                  background: isDone ? "var(--amber)" : "transparent",
                  marginRight: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {isDone && <span style={{ color: "black", fontSize: "9px", fontWeight: "bold" }}>✓</span>}
              </div>

              <Icon
                size={14}
                style={{
                  color: isDone ? "var(--amber)" : "var(--text-2)",
                  marginRight: "10px",
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--size-sm)",
                  color: isDone ? "var(--text-2)" : "var(--text-1)",
                  textDecoration: isDone ? "line-through" : "none",
                }}
              >
                {item.label}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--size-xs)",
                  color: "var(--text-3)",
                  flexShrink: 0,
                }}
              >
                {item.puan}p
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
