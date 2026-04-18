'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const MESSAGES = [
  "Bugün kimseyi aradın mı?",
  "Bugün 1 buluşma ayarladın mı?",
  "Bir kartvizit verdin mi?",
  "Yeni biriyle tanıştın mı?"
];

export function ActionReminderBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [todayStr, setTodayStr] = useState('');
  const [randomMessage, setRandomMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    setTodayStr(dateStr);

    const storageKey = `ftg_banner_dismissed_${dateStr}`;
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed === 'true') return;

    if (Math.random() < 0.4) {
      setRandomMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      setIsVisible(true);
    }
  }, []);

  if (!mounted || !isVisible) return null;

  const handleDismiss = () => {
    if (todayStr) {
      localStorage.setItem(`ftg_banner_dismissed_${todayStr}`, 'true');
    }
    setIsVisible(false);
  };

  return (
    <div className="w-full border-l-[3px] border-l-white bg-[var(--bg-card-elevated)] p-4 rounded-[12px] flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <AlertCircle size={20} className="text-white shrink-0" />
        <span className="text-[14px] font-medium text-[var(--text-primary)]">
          {randomMessage}
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1"
        aria-label="Kapat"
      >
        <X size={16} />
      </button>
    </div>
  );
}
