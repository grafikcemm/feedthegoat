'use client';

import { useState, useCallback } from 'react';

export interface FinancePeakCheck {
  id: string;
  label: string;
  done: boolean;
}

const CHECK_DEFS: Omit<FinancePeakCheck, 'done'>[] = [
  { id: 'no_installment', label: 'Yeni taksit açmadım' },
  { id: 'no_cash_advance', label: 'Nakit avans / hazır limit kullanmadım' },
  { id: 'no_ecommerce', label: 'Gereksiz e-ticaret harcaması yapmadım' },
  { id: 'food_limit', label: 'Yemek sipariş limitini aşmadım' },
  { id: 'no_new_sub', label: 'Yeni dijital araç / abonelik başlatmadım' },
];

const STORAGE_KEY = 'feed-the-goat-finance-peak-v1';

interface StoredPeak {
  date: string;
  checks: Record<string, boolean>;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): FinancePeakCheck[] {
  if (typeof window === 'undefined') return CHECK_DEFS.map(c => ({ ...c, done: false }));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as StoredPeak;
      if (stored.date === getToday()) {
        return CHECK_DEFS.map(c => ({ ...c, done: stored.checks[c.id] ?? false }));
      }
    }
  } catch {}
  return CHECK_DEFS.map(c => ({ ...c, done: false }));
}

export function useFinancePeak() {
  const [checks, setChecks] = useState<FinancePeakCheck[]>(load);

  const persist = useCallback((next: FinancePeakCheck[]) => {
    setChecks(next);
    try {
      const stored: StoredPeak = {
        date: getToday(),
        checks: Object.fromEntries(next.map(c => [c.id, c.done])),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {}
  }, []);

  const toggle = useCallback((id: string) => {
    persist(checks.map(c => c.id === id ? { ...c, done: !c.done } : c));
  }, [checks, persist]);

  const allDone = checks.every(c => c.done);
  const doneCount = checks.filter(c => c.done).length;

  return { checks, toggle, allDone, doneCount, total: checks.length };
}
