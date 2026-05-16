'use client';

import { useState, useCallback } from 'react';

export type TransactionType = 'income' | 'expense';

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  currency: 'TRY';
  category: string;
  date: string;
  note?: string;
  linkedTo?: {
    currentExpenseId?: string;
    debtServiceId?: string;
    subscriptionId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'feed-the-goat-finance-transactions-v1';

const SEED_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'seed-maas',
    type: 'income',
    title: 'Maaş',
    amount: 42000,
    currency: 'TRY',
    category: 'salary',
    date: '2025-06-01',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'seed-freelance',
    type: 'income',
    title: 'Freelance kalan ödeme',
    amount: 16500,
    currency: 'TRY',
    category: 'freelance',
    date: '2025-06-01',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
  },
];

function loadFromStorage(): FinanceTransaction[] {
  if (typeof window === 'undefined') return SEED_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FinanceTransaction[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return SEED_TRANSACTIONS;
}

export type NewTransactionInput = Omit<FinanceTransaction, 'id' | 'createdAt' | 'updatedAt'>;

export function useFinanceTransactions() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(loadFromStorage);

  const persist = useCallback((next: FinanceTransaction[]) => {
    setTransactions(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addTransaction = useCallback((input: NewTransactionInput): FinanceTransaction => {
    const now = new Date().toISOString();
    const item: FinanceTransaction = {
      ...input,
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    persist([...transactions, item]);
    return item;
  }, [transactions, persist]);

  const deleteTransaction = useCallback((id: string) => {
    persist(transactions.filter(t => t.id !== id));
  }, [transactions, persist]);

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return {
    transactions,
    incomeTransactions,
    expenseTransactions,
    totalIncome,
    totalExpense,
    addTransaction,
    deleteTransaction,
  };
}
