'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type Category = 'clothing' | 'tech' | 'food' | 'education' | 'subscription' | 'other';
type Verdict = 'approve' | 'defer' | 'reject' | 'july';

interface CheckForm {
  name: string;
  amount: number;
  category: Category;
  hasInstallment: boolean;
  isEssential: boolean;
  neededThisMonth: boolean;
}

interface Result {
  verdict: Verdict;
  message: string;
}

const CATEGORY_LABELS: Record<Category, string> = {
  clothing: 'Giyim',
  tech: 'Teknoloji',
  food: 'Gıda / Market',
  education: 'Eğitim',
  subscription: 'Abonelik',
  other: 'Diğer',
};

const VERDICT_STYLES: Record<Verdict, { color: string; bg: string; label: string }> = {
  approve: { color: '#22c55e', bg: 'bg-[#22c55e]/10 border-[#22c55e]/20', label: 'Onayla' },
  defer: { color: '#f59e0b', bg: 'bg-[#f59e0b]/10 border-[#f59e0b]/20', label: 'Ertele' },
  reject: { color: '#ef4444', bg: 'bg-[#ef4444]/10 border-[#ef4444]/20', label: 'Reddet' },
  july: { color: '#3b82f6', bg: 'bg-[#3b82f6]/10 border-[#3b82f6]/20', label: 'Temmuz\'a Taşı' },
};

function evaluate(form: CheckForm): Result {
  // Haziran kuralı: Yeni taksit yok
  if (form.hasInstallment) {
    return {
      verdict: 'reject',
      message: 'Haziran kuralı: Yeni taksit yok. Bu alımı ertele veya taksitsiz yap.',
    };
  }

  // Yeni abonelik - Haziran kuralı
  if (form.category === 'subscription') {
    return {
      verdict: 'reject',
      message: 'Haziran kuralı: Yeni araç aboneliği yok. Temmuz\'da tekrar değerlendir.',
    };
  }

  // Zorunlu değil ve bu ay gerekmiyorsa Temmuz'a taşı
  if (!form.isEssential && !form.neededThisMonth) {
    return {
      verdict: 'july',
      message: 'Zorunlu değil, bu ay acil de değil. Temmuz listesine ekle.',
    };
  }

  // Yüksek tutar + zorunlu değil = ertele
  if (form.amount > 2000 && !form.isEssential) {
    return {
      verdict: 'defer',
      message: `${form.amount.toLocaleString('tr-TR')} TL önemli bir miktar. Nakit akışı netleşince al.`,
    };
  }

  // Zorunlu veya bu ay gerekli
  if (form.isEssential && form.neededThisMonth) {
    return {
      verdict: 'approve',
      message: 'Zorunlu ve bu ay gerekli. Taksitsiz, nakit veya tek çekim ile al.',
    };
  }

  // Genel: bu ay gerekli ama zorunlu değil
  return {
    verdict: 'defer',
    message: 'Haziran bütçesi sıkışık. Mümkünse ertele veya daha düşük alternatif bul.',
  };
}

const EMPTY: CheckForm = {
  name: '',
  amount: 0,
  category: 'other',
  hasInstallment: false,
  isEssential: false,
  neededThisMonth: false,
};

export function PurchaseCheckCard() {
  const [form, setForm] = useState<CheckForm>(EMPTY);
  const [result, setResult] = useState<Result | null>(null);

  const set = <K extends keyof CheckForm>(k: K, v: CheckForm[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) return;
    setResult(evaluate(form));
  };

  const reset = () => {
    setForm(EMPTY);
    setResult(null);
  };

  const inputClass = 'w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors';
  const labelClass = 'text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-1';

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Satın Alma Öncesi Kontrol</span>
          <p className="text-[10px] text-[#444] mt-0.5">Haziran kurallarına göre değerlendir</p>
        </div>
        {result && (
          <button onClick={reset} className="text-[#444] hover:text-white transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {result ? (
        <div className={`border rounded-lg p-3 ${VERDICT_STYLES[result.verdict].bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ color: VERDICT_STYLES[result.verdict].color }}
            >
              {VERDICT_STYLES[result.verdict].label}
            </span>
            <span className="text-[11px] text-[#888]">{form.name} · {form.amount.toLocaleString('tr-TR')} TL</span>
          </div>
          <p className="text-xs text-[#777] leading-relaxed">{result.message}</p>
          <button
            onClick={reset}
            className="mt-3 text-[10px] text-[#444] hover:text-[#666] transition-colors border border-[#1f1f1f] px-3 py-1.5 rounded-lg"
          >
            Yeni kontrol
          </button>
        </div>
      ) : (
        <form onSubmit={handleCheck} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Harcama Adı</label>
              <input className={inputClass} placeholder="Ne almak istiyorsun?" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Tutar (TL)</label>
              <input type="number" className={inputClass} placeholder="0" min={0} value={form.amount || ''} onChange={e => set('amount', Number(e.target.value))} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Kategori</label>
            <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value as Category)}>
              {(Object.keys(CATEGORY_LABELS) as Category[]).map(k => (
                <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            {[
              { key: 'hasInstallment' as const, label: 'Taksitli alım' },
              { key: 'isEssential' as const, label: 'Zorunlu harcama' },
              { key: 'neededThisMonth' as const, label: 'Bu ay gerekli' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={e => set(key, e.target.checked)}
                  className="accent-[#F5C518]"
                />
                <span className="text-[11px] text-[#666]">{label}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[11px] font-medium rounded-lg hover:border-[#F5C518]/30 transition-all"
          >
            Değerlendir
          </button>
        </form>
      )}
    </div>
  );
}
