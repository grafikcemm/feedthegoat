'use client';

import { useState, useCallback } from 'react';

export interface CreditCard {
  id: string;
  bankName: string;
  cardLabel?: string;
  totalDebt: number;
  minPayment?: number;
  dueDay?: number;
  cardLimit?: number;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export type NewCreditCardInput = Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>;

const STORAGE_KEY = 'feed-the-goat-credit-cards-v1';

function load(): CreditCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CreditCard[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function useCreditCards() {
  const [cards, setCards] = useState<CreditCard[]>(load);

  const persist = useCallback((next: CreditCard[]) => {
    setCards(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addCard = useCallback((input: NewCreditCardInput) => {
    const now = new Date().toISOString();
    const card: CreditCard = {
      ...input,
      id: `cc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    persist([...cards, card]);
  }, [cards, persist]);

  const updateCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    persist(cards.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  }, [cards, persist]);

  const deleteCard = useCallback((id: string) => {
    persist(cards.filter(c => c.id !== id));
  }, [cards, persist]);

  return { cards, addCard, updateCard, deleteCard };
}
