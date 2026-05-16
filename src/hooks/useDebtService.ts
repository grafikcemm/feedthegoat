'use client';

import { useState, useCallback } from 'react';

export type DebtPriority = 'critical' | 'high' | 'medium' | 'low';
export type DebtStatus = 'pending' | 'paid' | 'deferred' | 'at_risk';
export type DebtType = 'credit_card' | 'restructured' | 'loan' | 'other';

export interface DebtServiceItem {
  id: string;
  title: string;
  amount: number;
  type: DebtType;
  priority: DebtPriority;
  status: DebtStatus;
  dueDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'feed-the-goat-debt-service-v1';

const DEFAULT_DEBT_SERVICE: DebtServiceItem[] = [
  {
    id: 'enpara-cc',
    title: 'Enpara Kredi Kartı',
    amount: 30000,
    type: 'credit_card',
    priority: 'high',
    status: 'pending',
    note: 'Kalan borç',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'denizbank-struct',
    title: 'Denizbank Yapılandırma İlk Taksit',
    amount: 10700,
    type: 'restructured',
    priority: 'high',
    status: 'pending',
    note: 'Yapılandırma taksidi — planlanan gider değil',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'kredi-1',
    title: 'Kredi 1 Son Taksit',
    amount: 10757,
    type: 'loan',
    priority: 'critical',
    status: 'pending',
    note: 'Bu taksit bitince Temmuz\'dan itibaren ~10.757 TL rahatlama sağlar',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'kredi-2',
    title: 'Kredi 2',
    amount: 9121,
    type: 'loan',
    priority: 'high',
    status: 'pending',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

export const DEBT_TYPE_LABELS: Record<DebtType, string> = {
  credit_card: 'Kredi Kartı',
  restructured: 'Yapılandırma',
  loan: 'Kredi',
  other: 'Diğer',
};

export const DEBT_PRIORITY_LABELS: Record<DebtPriority, string> = {
  critical: 'Kritik',
  high: 'Yüksek',
  medium: 'Orta',
  low: 'Düşük',
};

export const DEBT_STATUS_LABELS: Record<DebtStatus, string> = {
  pending: 'Bekliyor',
  paid: 'Ödendi',
  deferred: 'Ertelendi',
  at_risk: 'Riskli',
};

function load(): DebtServiceItem[] {
  if (typeof window === 'undefined') return DEFAULT_DEBT_SERVICE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DebtServiceItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_DEBT_SERVICE;
}

export type NewDebtInput = Omit<DebtServiceItem, 'id' | 'createdAt' | 'updatedAt'>;

export function useDebtService() {
  const [items, setItems] = useState<DebtServiceItem[]>(load);

  const persist = useCallback((next: DebtServiceItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addDebt = useCallback((input: NewDebtInput) => {
    const now = new Date().toISOString();
    const item: DebtServiceItem = {
      ...input,
      id: `debt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    persist([...items, item]);
  }, [items, persist]);

  const updateDebt = useCallback((id: string, updates: Partial<DebtServiceItem>) => {
    persist(items.map(d =>
      d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
    ));
  }, [items, persist]);

  const deleteDebt = useCallback((id: string) => {
    persist(items.filter(d => d.id !== id));
  }, [items, persist]);

  const markPaid = useCallback((id: string) => {
    persist(items.map(d =>
      d.id === id ? { ...d, status: 'paid' as DebtStatus, updatedAt: new Date().toISOString() } : d
    ));
  }, [items, persist]);

  const activeItems = items.filter(d => d.status !== 'paid');
  const totalDebt = activeItems.reduce((sum, d) => sum + d.amount, 0);

  return { items, activeItems, totalDebt, addDebt, updateDebt, deleteDebt, markPaid };
}
