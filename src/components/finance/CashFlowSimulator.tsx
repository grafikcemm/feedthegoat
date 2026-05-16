'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CASH_FLOW_SCENARIOS } from '@/data/financeSeed';

export function CashFlowSimulator() {
  const [open, setOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string>('all');

  const scenario = CASH_FLOW_SCENARIOS.find(s => s.id === activeScenario) ?? CASH_FLOW_SCENARIOS[0];
  const net = scenario.net;
  const netColor = net >= 0 ? '#22c55e' : '#ef4444';
  const netSign = net >= 0 ? '+' : '';

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full p-3 flex items-center justify-between text-left">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Haziran Simülatörü</span>
          <p className="text-[10px] text-[#444] mt-0.5">Harcama senaryosu seç, açığı gör</p>
        </div>
        {open
          ? <ChevronUp size={14} className="text-[#444]" />
          : <ChevronDown size={14} className="text-[#444]" />
        }
      </button>

      {open && (
        <div className="border-t border-[#1a1a1a] p-3 space-y-3">
          {/* Scenario selector */}
          <div className="space-y-1.5">
            {CASH_FLOW_SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveScenario(s.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left ${
                  activeScenario === s.id
                    ? 'border-[#F5C518]/30 bg-[#F5C518]/5'
                    : 'border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#2a2a2a]'
                }`}
              >
                <span className={`text-[11px] ${activeScenario === s.id ? 'text-white' : 'text-[#666]'}`}>{s.label}</span>
                <span className="text-[11px] font-mono" style={{ color: s.net >= 0 ? '#22c55e' : '#ef4444' }}>
                  {s.net >= 0 ? '+' : ''}{s.net.toLocaleString('tr-TR')} TL
                </span>
              </button>
            ))}
          </div>

          {/* Result panel */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold">Seçili Senaryo</span>
              <span className="text-[11px] text-[#555]">{scenario.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] text-[#333] uppercase tracking-wider block">Gelir</span>
                <span className="text-xs font-mono text-[#22c55e]">{scenario.income.toLocaleString('tr-TR')} TL</span>
              </div>
              <div>
                <span className="text-[9px] text-[#333] uppercase tracking-wider block">Gider</span>
                <span className="text-xs font-mono text-[#ef4444]">{scenario.expense.toLocaleString('tr-TR')} TL</span>
              </div>
              <div>
                <span className="text-[9px] text-[#333] uppercase tracking-wider block">Net</span>
                <span className="text-xs font-mono font-bold" style={{ color: netColor }}>
                  {netSign}{net.toLocaleString('tr-TR')} TL
                </span>
              </div>
            </div>
            {net < 0 && (
              <p className="text-[9px] text-[#444] mt-2 leading-relaxed">
                Bu senaryoda {Math.abs(net).toLocaleString('tr-TR')} TL açık var. Borç servisi öncelikli.
              </p>
            )}
            {net >= 0 && (
              <p className="text-[9px] text-[#22c55e] mt-2">
                Bu senaryoda pozitif bakiye. Fazlayı borç ödemesine aktar.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
