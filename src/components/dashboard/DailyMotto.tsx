'use client';

import React, { useEffect, useState } from 'react';
import { getTodayMotto } from '@/lib/mottos';

export function DailyMotto() {
  const [mounted, setMounted] = useState(false);
  const [day, setDay] = useState(0);
  const [dateStr, setDateStr] = useState('');
  const [motto, setMotto] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    setDay(today.getDay());

    const formatted = new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }).format(today);

    setDateStr(formatted);
    setMotto(getTodayMotto());
  }, []);

  if (!mounted) return null;
  if (!motto) return null;

  const isWeekend = day === 0 || day === 6;

  // Cumartesi/Pazar veya motto yoksa hiç render etme
  if (isWeekend) return null;

  return (
    <div className="flex flex-col items-center justify-center text-center py-2">
      <div className="italic text-[#888888] text-sm max-w-2xl mx-auto">
        "{motto}"
      </div>
    </div>
  );
}
