'use client';

import React, { useState, useEffect } from "react";
import { saveRealityCheck } from "@/app/actions/realityCheckActions";
import { Check } from "lucide-react";

interface RealityCheckCardProps {
  score: number;
  tasksCompleted: number;
  tasksTotal: number;
  date: string;
  savedWorkHours?: number | null;
}

export function RealityCheckCard({
  score,
  tasksCompleted,
  tasksTotal,
  date,
  savedWorkHours,
}: RealityCheckCardProps) {
  const [workHours, setWorkHours] = useState<string>(
    savedWorkHours?.toString() || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(!!savedWorkHours);

  useEffect(() => {
    if (savedWorkHours !== undefined && savedWorkHours !== null) {
      setWorkHours(savedWorkHours.toString());
      setIsSaved(true);
    }
  }, [savedWorkHours]);

  const handleSave = async () => {
    if (!workHours || isSaving) return;

    setIsSaving(true);
    const result = await saveRealityCheck({
      date,
      workHours: parseFloat(workHours),
      tasksTotal,
      tasksCompleted,
      score,
    });

    if (result.success) {
      setIsSaved(true);
    } else {
      alert("Hata oluştu: " + result.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="mx-8 mb-12 p-6 bg-ftg-bg-card border border-ftg-border rounded-xl shadow-2xl relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-ftg-accent/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <h3 className="font-mono text-[10px] tracking-widest text-ftg-text-mute mb-6 uppercase">
        REALITY CHECK
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Score Metric */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-ftg-text-bright">{score}</span>
          <span className="text-[10px] font-mono text-ftg-text-dim mt-1 uppercase">PUAN</span>
        </div>

        {/* Work Hours Input */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={workHours}
              onChange={(e) => {
                setWorkHours(e.target.value);
                setIsSaved(false);
              }}
              className="w-16 bg-ftg-bg border border-ftg-border-subtle rounded px-2 py-1 text-center text-lg font-bold text-ftg-accent focus:outline-none focus:border-ftg-accent/50 transition-colors"
              placeholder="0.0"
            />
            <span className="text-xs text-ftg-text-dim">saat</span>
          </div>
          <span className="text-[10px] font-mono text-ftg-text-dim mt-1 uppercase">ÇALIŞMA</span>
        </div>

        {/* Task Metric */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-ftg-text-bright">
            {tasksCompleted}<span className="text-ftg-text-mute text-lg">/{tasksTotal}</span>
          </span>
          <span className="text-[10px] font-mono text-ftg-text-dim mt-1 uppercase">GÖREV</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={isSaved || isSaving || !workHours}
          className={`
            px-12 py-3 rounded-lg font-mono text-sm tracking-wider transition-all duration-300
            ${isSaved 
              ? "bg-ftg-accent/20 text-ftg-accent border border-ftg-accent/30 cursor-default" 
              : "bg-ftg-accent text-ftg-bg font-bold hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"}
            ${(isSaving || !workHours) && !isSaved ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {isSaving ? "KAYDEDİLİYOR..." : isSaved ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> KAYDEDİLDİ
            </span>
          ) : "KAYDET"}
        </button>
      </div>
    </div>
  );
}
