'use client';

import React, { useEffect, useState } from 'react';

export function SundayChargeMode() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const today = new Date();
    const formatted = new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
    }).format(today);
    setDateStr(formatted);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] w-full">
      <div className="max-w-2xl mx-auto py-[80px] px-6 flex flex-col items-center">

        <div className="text-[var(--text-tertiary)] text-[13px] uppercase tracking-wider text-center mb-2">
          {dateStr}
        </div>

        <h1 className="font-display text-[48px] font-bold tracking-tight text-center text-[var(--text-primary)] leading-tight mb-3">
          ŞARJ GÜNÜ
        </h1>

        <p className="text-[var(--text-secondary)] text-[16px] italic text-center max-w-md mx-auto">
          Bugün üretmek yok. Bugün sadece toparlan.
        </p>

        <div className="flex flex-col gap-5 mt-12 w-full">

          {/* Kart 1 — RETROSPEKTİF */}
          <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-subtle)] p-7" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div className="text-[11px] uppercase tracking-[0.15em] font-medium text-white/40">
              RETROSPEKTİF
            </div>
            <div className="font-serif italic text-[20px] text-[var(--text-primary)] mt-3 mb-4">
              Geçen hafta neyi iyi yaptın? Tek cümle.
            </div>
            <textarea
              placeholder="Örn: Hafta içi sporu hiç aksatmadım."
              className="w-full bg-[var(--bg-primary)] rounded-[12px] border border-[var(--border-subtle)] p-3 text-[15px] text-[var(--text-primary)] focus:border-white/20 outline-none resize-none min-h-[80px] transition-colors"
            />
          </div>

          {/* Kart 2 — GELECEK HAFTA */}
          <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-subtle)] p-7" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div className="text-[11px] uppercase tracking-[0.15em] font-medium text-white/40">
              GELECEK HAFTA
            </div>
            <div className="font-serif italic text-[20px] text-[var(--text-primary)] mt-3 mb-4">
              Gelecek haftanın tek odak noktası.
            </div>
            <textarea
              placeholder="Örn: Yeni projeyi canlıya almak."
              className="w-full bg-[var(--bg-primary)] rounded-[12px] border border-[var(--border-subtle)] p-3 text-[15px] text-[var(--text-primary)] focus:border-white/20 outline-none resize-none min-h-[80px] transition-colors"
            />
          </div>

          {/* Kart 3 — DİNLEN */}
          <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-subtle)] p-7" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div className="text-[11px] uppercase tracking-[0.15em] font-medium text-white/40 mb-4">
              DİNLEN
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[var(--text-primary)] text-[16px]">Salon yok. Üretim yok. Ekran zamanını azalt.</p>
              <p className="text-[var(--text-primary)] text-[16px]">En geç 23:00 yat.</p>
              <p className="text-[var(--text-primary)] text-[16px]">Pazartesi güçlü başla.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
