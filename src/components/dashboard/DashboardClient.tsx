"use client";

import { useState, useEffect } from "react";
import { GoatEvolution } from "@/components/dashboard/GoatEvolution";
import { EnergyCheckIn } from "@/components/daily/EnergyCheckIn";

interface DashboardClientProps {
  initialEnergy: "LOW" | "MID" | "HIGH" | null;
  bestStreak: number;
  dailyScore: number;
}

const ENERGY_CAP = {
  HIGH: 70,
  MID: 50,
  LOW: 30
} as const;

export function DashboardClient({
  initialEnergy,
  bestStreak,
  dailyScore
}: DashboardClientProps) {
  const [energyLevel, setEnergyLevel] = useState<"LOW" | "MID" | "HIGH" | null>(initialEnergy);

  // Tema class'ını body'e uygula
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-low', 'theme-mid', 'theme-high');
    if (energyLevel === 'LOW')  body.classList.add('theme-low');
    if (energyLevel === 'MID')  body.classList.add('theme-mid');
    if (energyLevel === 'HIGH') body.classList.add('theme-high');
  }, [energyLevel]);

  const cap = energyLevel ? ENERGY_CAP[energyLevel] : 70;

  const energyStatus =
    energyLevel === 'HIGH' ? 'Yüksek enerji. Maksimum çıktı.' :
    energyLevel === 'MID'  ? 'Orta enerji. Odaklı kal.'       :
    energyLevel === 'LOW'  ? 'Düşük enerji. Yavaş ve sakin.'  :
    undefined;

  const orbGlow =
    energyLevel === 'HIGH' ? 'rgba(16, 185, 129, 0.15)' :
    energyLevel === 'LOW'  ? 'rgba(239, 68, 68, 0.12)'  :
    'rgba(255, 255, 255, 0.06)';

  const orbBorder =
    energyLevel === 'HIGH' ? 'rgba(16, 185, 129, 0.35)' :
    energyLevel === 'LOW'  ? 'rgba(239, 68, 68, 0.30)'  :
    'var(--border-subtle)';

  return (
    <>
      <GoatEvolution
        streak={bestStreak}
        score={dailyScore}
        cap={cap}
        energyStatus={energyStatus}
        orbGlow={orbGlow}
        orbBorder={orbBorder}
      />
      <EnergyCheckIn
        currentEnergy={energyLevel}
        onSelect={(val) => setEnergyLevel(val)}
      />
    </>
  );
}
