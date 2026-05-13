"use client";

import { useState, useEffect } from "react";

export function useDailyScore() {
  const [score, setScore] = useState(0);
  const [maxPuan, setMaxPuan] = useState(80);
  const [puanRengi, setPuanRengi] = useState<"red" | "yellow" | "green">("red");
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const computeScore = () => {
      let currentScore = 0;
      const todayIso = new Date().toISOString().split("T")[0];
      const day = new Date().getDay();

      // Active days for workout: Pzt(1), Çrş(3), Cum(5), Cmt(6)
      const hasWorkout = [1, 3, 5, 6].includes(day);
      const computedMaxPuan = hasWorkout ? 100 : 80;
      setMaxPuan(computedMaxPuan);

      // 1. Kritik Rutinler
      try {
        const nbSaved = localStorage.getItem("goat-never-break-v2");
        if (nbSaved) {
          const parsed = JSON.parse(nbSaved);
          if (parsed.date === todayIso && parsed.data) {
            if (parsed.data["wake_up"]) currentScore += 15;
            if (parsed.data["teeth"]) currentScore += 5;
            if (parsed.data["vitamins"]) currentScore += 5;
            if (hasWorkout && parsed.data["workout"]) currentScore += 20;
            if (parsed.data["reading"]) currentScore += 10;
          }
        }
      } catch {}

      // 2. İçerik Paylaşımı
      try {
        const csSaved = localStorage.getItem("goat-content-sharing-v1");
        if (csSaved) {
          const parsed = JSON.parse(csSaved);
          if (parsed.date === todayIso && parsed.data?.["cs-grafikcem-x"]) {
            currentScore += 15;
          }
        }
      } catch {}

      // 3. Aktif Görevler
      try {
        const tasksSaved = localStorage.getItem("goat-active-tasks-v2");
        if (tasksSaved) {
          const parsed = JSON.parse(tasksSaved);
          if (Array.isArray(parsed)) {
            parsed.forEach((t: { is_completed: boolean; priority: string }) => {
              if (t.is_completed) {
                if (t.priority === "P1") currentScore += 20;
                else if (t.priority === "P2") currentScore += 8;
                else if (t.priority === "P3") currentScore += 4;
              }
            });
          }
        }
      } catch {}

      // 4. Bonus Görevler
      try {
        const bonusSaved = localStorage.getItem("goat-bonus-tasks-v1");
        if (bonusSaved) {
          const parsed = JSON.parse(bonusSaved);
          if (parsed.date === todayIso && parsed.data) {
            if (parsed.data["bn-sleep"]) currentScore += 5;
            if (parsed.data["bn-extra-read"]) currentScore += 5;
            if (parsed.data["bn-english"]) currentScore += 10;
            if (parsed.data["bn-treadmill"]) currentScore += 10;
          }
        }
      } catch {}

      setScore(currentScore);
      
      const computedPercentage = (currentScore / computedMaxPuan) * 100;
      setPercentage(computedPercentage);

      if (currentScore <= 40) {
        setPuanRengi("red");
      } else if (currentScore <= 65) {
        setPuanRengi("yellow");
      } else {
        setPuanRengi("green");
      }
    };

    computeScore();

    const handleUpdate = () => {
      computeScore();
    };

    window.addEventListener("dailyScoreUpdated", handleUpdate);
    return () => window.removeEventListener("dailyScoreUpdated", handleUpdate);
  }, []);

  return { score, maxPuan, puanRengi, percentage };
}
