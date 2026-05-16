'use client';

import { useState, useCallback } from 'react';

export type SubscriptionCategory =
  | 'ai_saas'
  | 'apple_google'
  | 'education'
  | 'entertainment'
  | 'productivity'
  | 'design'
  | 'other';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial' | 'archived';
export type RevenueImpact = 'none' | 'indirect' | 'direct' | 'unknown';
export type AiRecommendation = 'keep' | 'cancel' | 'pause' | 'review';

export interface SubscriptionItem {
  id: string;
  name: string;
  amount: number;
  currency: 'TRY' | 'USD' | 'EUR';
  category: SubscriptionCategory;
  billingCycle: 'monthly' | 'yearly' | 'one_time';
  renewalDay?: number;
  status: SubscriptionStatus;
  purpose?: string;
  isEssential: boolean;
  revenueImpact: RevenueImpact;
  aiRecommendation?: AiRecommendation;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'feed-the-goat-subscriptions-v1';

const DEFAULT_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'claude-sub',
    name: 'Claude',
    amount: 799,
    currency: 'TRY',
    category: 'ai_saas',
    billingCycle: 'monthly',
    status: 'active',
    isEssential: true,
    revenueImpact: 'direct',
    aiRecommendation: 'keep',
    purpose: 'Asistan ve kod geliştirme',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'chatgpt-sub',
    name: 'ChatGPT',
    amount: 500,
    currency: 'TRY',
    category: 'ai_saas',
    billingCycle: 'monthly',
    status: 'active',
    isEssential: false,
    revenueImpact: 'indirect',
    aiRecommendation: 'review',
    purpose: 'Ek AI asistan',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

export const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  ai_saas: 'AI / SaaS',
  apple_google: 'Apple / Google',
  education: 'Eğitim',
  entertainment: 'Eğlence',
  productivity: 'Verimlilik',
  design: 'Tasarım',
  other: 'Diğer',
};

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: 'Aktif',
  paused: 'Donduruldu',
  cancelled: 'İptal Edildi',
  trial: 'Deneme',
  archived: 'Arşiv',
};

export const AI_REC_LABELS: Record<AiRecommendation, string> = {
  keep: 'Tut',
  cancel: 'İptal Et',
  pause: 'Dondur',
  review: 'Gözden Geçir',
};

function load(): SubscriptionItem[] {
  if (typeof window === 'undefined') return DEFAULT_SUBSCRIPTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SubscriptionItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_SUBSCRIPTIONS;
}

export type NewSubscriptionInput = Omit<SubscriptionItem, 'id' | 'createdAt' | 'updatedAt'>;

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(load);

  const persist = useCallback((next: SubscriptionItem[]) => {
    setSubscriptions(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addSubscription = useCallback((input: NewSubscriptionInput) => {
    const now = new Date().toISOString();
    const item: SubscriptionItem = {
      ...input,
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    persist([...subscriptions, item]);
  }, [subscriptions, persist]);

  const updateSubscription = useCallback((id: string, updates: Partial<SubscriptionItem>) => {
    persist(subscriptions.map(s =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    ));
  }, [subscriptions, persist]);

  const deleteSubscription = useCallback((id: string) => {
    persist(subscriptions.filter(s => s.id !== id));
  }, [subscriptions, persist]);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');
  const monthlyTotal = activeSubscriptions.reduce((sum, s) => sum + s.amount, 0);
  const aiSaasTotal = activeSubscriptions.filter(s => s.category === 'ai_saas').reduce((sum, s) => sum + s.amount, 0);

  return {
    subscriptions,
    activeSubscriptions,
    monthlyTotal,
    aiSaasTotal,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
