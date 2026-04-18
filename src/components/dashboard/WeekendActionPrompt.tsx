'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { saveWeeklyAction, getThisWeekAction } from '@/app/actions/weeklyAction';

export function WeekendActionPrompt() {
  const [actionText, setActionText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const originalTextRef = useRef('');

  useEffect(() => {
    async function init() {
      const val = await getThisWeekAction();
      if (val) {
        setActionText(val);
        setIsSaved(true);
        originalTextRef.current = val;
      }
    }
    init();
  }, []);

  const handleSave = async () => {
    const result = await saveWeeklyAction(actionText);
    if (result.success) {
      setIsSaved(true);
      setIsEditing(false);
      originalTextRef.current = actionText;
    }
  };

  const handleCancel = () => {
    setActionText(originalTextRef.current);
    setIsEditing(false);
  };

  if (!isSaved || isEditing) {
    return (
      <div
        className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-subtle)] p-6"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
      >
        <div className="text-[11px] uppercase tracking-[0.15em] font-medium text-[var(--text-tertiary)]">
          HAFTANIN AKSİYONU
        </div>

        <div className="font-serif italic text-[20px] text-[var(--text-primary)] mt-3 mb-4">
          Bu hafta hangi aksiyonu aldın?
        </div>

        <textarea
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
          placeholder="Örn: 3 potansiyel müşteriyle toplantı ayarladım."
          className="w-full bg-[var(--bg-primary)] rounded-[12px] border border-[var(--border-subtle)] p-3 text-[15px] text-[var(--text-primary)] focus:border-white/20 focus:ring-1 focus:ring-white/10 outline-none resize-none min-h-[80px] transition-colors"
        />

        <div className="flex justify-end gap-3 mt-3">
          {isEditing && (
            <button
              onClick={handleCancel}
              className="px-5 py-2 text-[14px] rounded-[12px] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              İptal
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={actionText.trim().length === 0}
            className="px-5 py-2 text-[14px] rounded-[12px] bg-white text-black font-semibold disabled:opacity-40 hover:bg-white/90 transition-all"
          >
            Kaydet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-subtle)] p-6 relative"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
    >
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-6 right-6 text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        Düzenle
      </button>

      <div className="text-[11px] uppercase tracking-[0.15em] font-medium text-[var(--text-tertiary)]">
        HAFTANIN AKSİYONU
      </div>

      <div className="font-serif italic text-[20px] text-[var(--text-primary)] mt-3 mb-4">
        Bu hafta hangi aksiyonu aldın?
      </div>

      <div className="bg-[var(--bg-primary)] rounded-[12px] border border-[var(--border-subtle)] p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-[var(--success)]" />
          <span className="text-[12px] text-[var(--text-secondary)]">Bu hafta kaydedilen aksiyon:</span>
        </div>
        <div className="text-[15px] text-[var(--text-primary)]">
          {actionText}
        </div>
      </div>
    </div>
  );
}
