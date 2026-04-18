"use client";

import { useState, useEffect } from "react";

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DAYS = [
  'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
];

export function Greeting() {
  const [mounted, setMounted] = useState(false);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    setMounted(true);
    const d = new Date();
    const formatted = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${DAYS[d.getDay()]}`;
    setDateString(formatted);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-10 w-64 bg-[var(--bg-card)] rounded animate-pulse" />
        <div className="h-4 w-40 bg-[var(--bg-card)] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 
        className="text-white font-semibold tracking-tight"
        style={{ 
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: "32px",
          lineHeight: "1.2"
        }}
      >
        Merhaba, Ali Cem
      </h1>
      <div 
        className="text-[var(--text-tertiary)]"
        style={{ fontSize: "14px" }}
      >
        {dateString}
      </div>
    </div>
  );
}
