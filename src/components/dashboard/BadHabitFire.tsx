'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Check, X } from 'lucide-react';
import { getStreakMessage } from '@/lib/streakMessages';
import { recordBadHabit, getBadHabitData } from '@/app/actions/streaks';

const HABITS = [
  { key: 'no_outside_food', label: 'Dışarıdan yemek yemedim' },
  { key: 'no_porn', label: 'Pornografi izlemedim' },
  { key: 'started_not_postponed', label: 'Ertelemedim, başladım' },
  { key: 'selective_sharing', label: 'Herkese her şeyi anlatmadım' }
];

const DAY_LABELS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

export function BadHabitFire() {
  const [checkedHabits, setCheckedHabits] = useState<Record<string, boolean>>({});
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [last7Days, setLast7Days] = useState<string[]>(Array(7).fill('none')); // 'success' | 'fail' | 'none'

  const loadData = useCallback(async () => {
    try {
      const { streaks, logs } = await getBadHabitData();

      if (streaks.length > 0) {
        const maxStreak = Math.max(...streaks.map(s => s.current_streak || 0));
        setCurrentStreak(maxStreak);
      } else {
        setCurrentStreak(0);
      }

      const today = new Date();
      const currDay = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (currDay === 0 ? 6 : currDay - 1));
      monday.setHours(0, 0, 0, 0);

      const days = Array(7).fill('none').map((_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        const dayLogs = logs.filter(l => l.log_date === dStr);
        const successCount = dayLogs.filter(l => l.success).length;
        
        const isPast = d < today;
        if (successCount >= 4) return 'success';
        if (isPast && d.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) return 'fail';
        return 'none';
      });
      setLast7Days(days);

      const todayStr = today.toISOString().split('T')[0];
      const todayLogs = logs.filter(l => l.log_date === todayStr);
      const initialChecked: Record<string, boolean> = {};
      todayLogs.forEach(l => { initialChecked[l.habit_key] = l.success; });
      setCheckedHabits(initialChecked);
    } catch (err) {
      console.error('loadData error:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (key: string) => {
    const newValue = !checkedHabits[key];
    setCheckedHabits(prev => ({ ...prev, [key]: newValue }));
    
    try {
      const result = await recordBadHabit(key, newValue);
      if (result?.success && result.newStreak !== undefined) {
        setCurrentStreak(result.newStreak); // Fixed: math.max removal
      }
      // Re-load data to ensure sync
      await loadData();
    } catch (err) {
      console.error('Toggle error:', err);
      // Revert local state on error
      setCheckedHabits(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  const isActive = currentStreak > 0;

  return (
    <div
      className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-subtle)] p-7"
    >
      <div style={{ 
        display: "flex", 
        gap: "32px", 
        alignItems: "center" // Change 3: center alignment
      }}>
        
        {/* SOL — Streak */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          minWidth: "140px"
        }}>
          <div className={isActive ? 'animate-pulse' : 'opacity-35'}>
            <Flame
              size={48}
              style={{
                fill: 'var(--fire)',
                stroke: 'var(--fire)',
                strokeWidth: 0.5,
              }}
            />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "var(--text-primary)", lineHeight: "1" }}>{currentStreak}</div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-tertiary)", marginTop: "4px" }}>GÜN STREAK</div>
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "var(--text-secondary)", marginTop: "8px", textAlign: "center" }}>{getStreakMessage(currentStreak)}</div>
          
          {/* 7 daire */}
          <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
            {last7Days.map((status, idx) => (
              <div key={idx} style={{ 
                width: "22px", height: "22px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: status === 'success' ? 'var(--success)' : (status === 'fail' ? 'var(--bg-card-elevated)' : 'transparent'),
                border: status === 'fail' ? '1px solid var(--border-subtle)' : (status === 'none' ? '1px solid var(--border-subtle)' : 'none')
              }}>
                {status === 'success' && <Check size={12} className="text-white" strokeWidth={3} />}
                {status === 'fail' && <X size={10} className="text-[var(--text-tertiary)]" />}
              </div>
            ))}
          </div>
          
          {/* Gün harfleri */}
          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
            {DAY_LABELS.map((label, idx) => (
              <div key={idx} style={{ 
                width: "22px", textAlign: "center",
                fontSize: "10px", color: "var(--text-tertiary)"
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* AYIRICI */}
        <div style={{ 
          width: "1px", 
          backgroundColor: "#242428",
          alignSelf: "stretch"
        }} />

        {/* SAĞ — Checkboxlar */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px",
          flex: 1
        }}>
          {HABITS.map(habit => {
            const isChecked = !!checkedHabits[habit.key];
            return (
              <button
                key={habit.key}
                onClick={() => handleToggle(habit.key)}
                className="flex items-center gap-4 text-left w-full group outline-none"
              >
                <div
                  className={`w-[18px] h-[18px] shrink-0 rounded-md flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-[var(--success)] border-[var(--success)]'
                      : 'border-[1.5px] border-[var(--border-strong)] bg-transparent group-hover:border-white/40'
                  }`}
                >
                  {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-[14px] text-[var(--text-primary)] font-normal">
                  {habit.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
