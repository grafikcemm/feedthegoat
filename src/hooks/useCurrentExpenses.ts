'use client';

import { useState, useCallback } from 'react';

export type CurrentExpenseCategory = 'education' | 'sport' | 'subscription' | 'food' | 'market' | 'debt' | 'personal' | 'other';
export type CurrentExpenseFrequency = 'monthly' | 'one_time' | 'quarterly' | 'unknown';
export type CurrentExpenseStatus = 'active' | 'paid' | 'archived';

export interface CurrentExpense {
  id: string;
  title: string;
  amount: number;
  currency: 'TRY';
  category: CurrentExpenseCategory;
  frequency: CurrentExpenseFrequency;
  status: CurrentExpenseStatus;
  durationMonths?: number;
  monthlyEquivalent?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'feed-the-goat-current-expenses-v1';
const OLD_STORAGE_KEY = 'feed-the-goat-planned-expenses-v1';

const DEFAULT_EXPENSES: CurrentExpense[] = [
  {
    id: 'saz-kursu',
    title: 'Saz Kursu',
    amount: 800,
    currency: 'TRY',
    category: 'education',
    frequency: 'monthly',
    status: 'active',
    note: 'Udemy başlangıç kursu — aylık',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'digital-academy',
    title: 'Digital Academy Kursu',
    amount: 1800,
    currency: 'TRY',
    category: 'education',
    frequency: 'one_time',
    status: 'active',
    note: 'Eğitim yatırımı',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'spor-salonu',
    title: 'Spor Salonu',
    amount: 5000,
    currency: 'TRY',
    category: 'sport',
    frequency: 'quarterly',
    status: 'active',
    durationMonths: 3,
    monthlyEquivalent: 1667,
    note: '3 ay 5.000 TL, ek harcama yok. Tatil/bayram sonrası başlayacak.',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

function migrateFromOldKey(): CurrentExpense[] | null {
  try {
    const raw = localStorage.getItem(OLD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<{
      id: string; title: string; amount: number; currency: 'TRY';
      category: string; frequency: string; status: string;
      note?: string; durationMonths?: number; monthlyOverride?: number;
      createdAt: string; updatedAt: string;
    }>;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const migrated: CurrentExpense[] = parsed
      .filter(e => !e.id.includes('denizbank') && e.category !== 'debt')
      .map(e => ({
        id: e.id,
        title: e.title,
        amount: e.amount,
        currency: 'TRY' as const,
        category: (e.category as CurrentExpenseCategory) || 'other',
        frequency: (e.frequency as CurrentExpenseFrequency) || 'monthly',
        status: 'active' as CurrentExpenseStatus,
        note: e.note,
        durationMonths: e.durationMonths,
        monthlyEquivalent: e.monthlyOverride,
        createdAt: e.createdAt,
        updatedAt: new Date().toISOString(),
      }));

    return migrated.length > 0 ? migrated : null;
  } catch {
    return null;
  }
}

function loadFromStorage(): CurrentExpense[] {
  if (typeof window === 'undefined') return DEFAULT_EXPENSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CurrentExpense[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const migrated = migrateFromOldKey();
    if (migrated) return migrated;
  } catch {}
  return DEFAULT_EXPENSES;
}

export function calcMonthlyEquivalent(expense: CurrentExpense): number {
  if (expense.monthlyEquivalent) return expense.monthlyEquivalent;
  if (expense.frequency === 'monthly') return expense.amount;
  if (expense.frequency === 'quarterly') return Math.round(expense.amount / 3);
  return expense.amount;
}

export type NewCurrentExpenseInput = Omit<CurrentExpense, 'id' | 'createdAt' | 'updatedAt'>;

export function useCurrentExpenses() {
  const [expenses, setExpenses] = useState<CurrentExpense[]>(loadFromStorage);

  const persist = useCallback((next: CurrentExpense[]) => {
    setExpenses(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addExpense = useCallback((input: NewCurrentExpenseInput) => {
    const now = new Date().toISOString();
    const newItem: CurrentExpense = {
      ...input,
      id: `expense-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    persist([...expenses, newItem]);
  }, [expenses, persist]);

  const updateExpense = useCallback((id: string, updates: Partial<CurrentExpense>) => {
    persist(expenses.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
  }, [expenses, persist]);

  const deleteExpense = useCallback((id: string) => {
    persist(expenses.filter(e => e.id !== id));
  }, [expenses, persist]);

  const markPaid = useCallback((id: string) => {
    persist(expenses.map(e =>
      e.id === id ? { ...e, status: 'paid' as CurrentExpenseStatus, updatedAt: new Date().toISOString() } : e
    ));
  }, [expenses, persist]);

  const activeExpenses = expenses.filter(e => e.status === 'active');
  const activeTotal = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

  return { expenses, activeExpenses, activeTotal, addExpense, updateExpense, deleteExpense, markPaid };
}
