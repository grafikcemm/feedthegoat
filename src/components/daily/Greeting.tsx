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
      <div className="flex flex-col gap-1">
        <div className="h-8 w-64 bg-[#111111] rounded animate-pulse" />
        <div className="h-4 w-40 bg-[#111111] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-2">
      <div className="text-[#888888] text-sm">
        {dateString}
      </div>
      <h1 className="text-white text-3xl font-bold mt-1">
        Merhaba Cem,
      </h1>
    </div>
  );
}
