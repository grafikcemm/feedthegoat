'use client';

import { useFinancePeak } from '@/hooks/useFinancePeak';

export function FinancePeakCard() {
  const { checks, toggle, allDone, doneCount, total } = useFinancePeak();

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Finans Peak</span>
          <p className="text-[10px] text-[#444] mt-0.5">Günlük finansal çizgi kontrolü</p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-mono font-bold ${allDone ? 'text-[#22c55e]' : 'text-[#888]'}`}>
            {doneCount}/{total}
          </span>
          <div className="h-1 w-16 bg-[#1a1a1a] rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(doneCount / total) * 100}%`,
                background: allDone ? '#22c55e' : '#f59e0b',
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {checks.map(check => (
          <button
            key={check.id}
            onClick={() => toggle(check.id)}
            className="w-full flex items-center gap-2.5 text-left py-1 group"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
              check.done
                ? 'bg-[#22c55e] border-[#22c55e]'
                : 'border-[#2a2a2a] group-hover:border-[#3a3a3a]'
            }`}>
              {check.done && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className={`text-[11px] transition-colors ${check.done ? 'text-[#444] line-through' : 'text-[#888] group-hover:text-white'}`}>
              {check.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
        {allDone ? (
          <p className="text-[10px] text-[#22c55e] font-medium">Bugün finansal çizgi korunuyor.</p>
        ) : (
          <p className="text-[10px] text-[#444] leading-relaxed">
            Sorun yok. Yeni harcama açmadan çizgiye dön.
          </p>
        )}
      </div>
    </div>
  );
}
