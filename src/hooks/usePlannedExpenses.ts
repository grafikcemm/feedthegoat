'use client';

import { useState, useCallback } from 'react';

export type ExpenseCategory = 'education' | 'sport' | 'subscription' | 'debt' | 'personal' | 'other';
export type ExpenseFrequency = 'monthly' | 'one_time' | 'quarterly' | 'unknown';
export type ExpenseStatus = 'planned' | 'active' | 'paid' | 'archived';

export interface PlannedExpense {
  id: string;
  title: string;
  amount: number;
  currency: 'TRY';
  category: ExpenseCategory;
  frequency: ExpenseFrequency;
  status: ExpenseStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
  // Extra display fields
  durationMonths?: number;
  startNote?: string;
  monthlyOverride?: number;
}

const STORAGE_KEY = 'feed-the-goat-planned-expenses-v1';

const DEFAULT_EXPENSES: PlannedExpense[] = [
  {
    id: 'saz-kursu',
    title: 'Saz Kursu',
    amount: 800,
    currency: 'TRY',
    category: 'education',
    frequency: 'monthly',
    status: 'planned',
    note: 'Kişisel gelişim, yan hedef',
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
    status: 'planned',
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
    status: 'planned',
    note: '3 aylık üyelik. Tatil/bayram sonrası hemen.',
    durationMonths: 3,
    startNote: 'Tatil/bayram sonrası hemen',
    monthlyOverride: 1667,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

function loadFromStorage(): PlannedExpense[] {
  if (typeof window === 'undefined') return DEFAULT_EXPENSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PlannedExpense[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_EXPENSES;
}

export function calcMonthlyExpense(expense: PlannedExpense): number {
  if (expense.monthlyOverride) return expense.monthlyOverride;
  if (expense.frequency === 'monthly') return expense.amount;
  if (expense.frequency === 'one_time') return expense.amount;
  if (expense.frequency === 'quarterly') return Math.round(expense.amount / 3);
  return expense.amount;
}

export type NewExpenseInput = Omit<PlannedExpense, 'id' | 'createdAt' | 'updatedAt'>;

export function usePlannedExpenses() {
  const [expenses, setExpenses] = useState<PlannedExpense[]>(loadFromStorage);

  const persist = useCallback((next: PlannedExpense[]) => {
    setExpenses(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addExpense = useCallback((input: NewExpenseInput) => {
    const now = new Date().toISOString();
    const newItem: PlannedExpense = {
      ...input,
      id: `expense-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    persist([...expenses, newItem]);
  }, [expenses, persist]);

  const updateExpense = useCallback((id: string, updates: Partial<PlannedExpense>) => {
    persist(expenses.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
  }, [expenses, persist]);

  const deleteExpense = useCallback((id: string) => {
    persist(expenses.filter(e => e.id !== id));
  }, [expenses, persist]);

  return { expenses, addExpense, updateExpense, deleteExpense };
}
