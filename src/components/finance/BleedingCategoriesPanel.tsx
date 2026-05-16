'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BleedingCategory {
  id: string;
  title: string;
  approxAmount: string;
  risk: 'critical' | 'high' | 'caution';
  rule: string;
  description: string;
}

const BLEEDING_CATEGORIES: BleedingCategory[] = [
  {
    id: 'ecommerce',
    title: 'Taksitli E-Ticaret / Amazon / Trendyol / MediaMarkt',
    approxAmount: '35.700 TL+',
    risk: 'critical',
    rule: 'Yeni taksit yok',
    description: 'En büyük kanama alanı. Her taksitli alım gelecek ayların yükünü artırır.',
  },
  {
    id: 'cash_advance',
    title: 'Nakit Avans / Hazır Limit / Borç Çevirme',
    approxAmount: '~18.000 TL',
    risk: 'critical',
    rule: 'Kullanım sıfır',
    description: 'Faiz yükü çok yüksek. Bu ayı sıfır kullanımla geçirmek kritik.',
  },
  {
    id: 'ai_saas',
    title: 'AI / SaaS / Dijital Araçlar',
    approxAmount: '~11.200 TL',
    risk: 'high',
    rule: '1–2 ana araca düşür',
    description: 'Çok sayıda araç birikiyor. Her yeni araç önce 30 gün dene, sonra karar ver.',
  },
  {
    id: 'gaming_cafe',
    title: 'Oyun / Kafe',
    approxAmount: '~6.360 TL',
    risk: 'caution',
    rule: 'Sert limit',
    description: 'Haziran için sabit limit koy ve aşma.',
  },
  {
    id: 'food_delivery',
    title: 'Yemek Siparişi',
    approxAmount: '~4.900 TL',
    risk: 'high',
    rule: 'Haziran hedef: 1.750 TL',
    description: 'Getir/Yemeksepeti harcaması yüksek. 1.750 TL üstü her sipariş bütçeyi etkiler.',
  },
  {
    id: 'subscriptions',
    title: 'Apple / YouTube / X / Dijital Abonelikler',
    approxAmount: '~3.900 TL',
    risk: 'caution',
    rule: 'Gereksizleri iptal et',
    description: 'Her ay otomatik çekilen kalemler. Bir kez gözden geçir, gereksizleri kes.',
  },
  {
    id: 'ads',
    title: 'Reklam / Sosyal Medya Harcamaları',
    approxAmount: '~3.800 TL',
    risk: 'caution',
    rule: 'Sadece ölçülebilir gelir varsa',
    description: 'Reklam yatırımı gelire dönüşmüyorsa bu ay durdur.',
  },
  {
    id: 'interest',
    title: 'Faiz / Ücret / Vergi',
    approxAmount: '2.400 TL+',
    risk: 'caution',
    rule: 'Gecikmeye düşme',
    description: 'Gecikme faizleri kartopu gibi büyür. Asgari ödemeleri zamanında yap.',
  },
];

const RISK_STYLES = {
  critical: { badge: 'bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444]', dot: 'bg-[#ef4444]', label: 'Kritik' },
  high: { badge: 'bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b]', dot: 'bg-[#f59e0b]', label: 'Yüksek' },
  caution: { badge: 'bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6]', dot: 'bg-[#3b82f6]', label: 'Dikkat' },
};

export function BleedingCategoriesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full p-3 flex items-center justify-between text-left"
      >
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block">Kanayan Yaralar</span>
          <p className="text-[10px] text-[#444] mt-0.5">8 kategori — farkındalık paneli</p>
        </div>
        {open ? <ChevronUp size={14} className="text-[#444]" /> : <ChevronDown size={14} className="text-[#444]" />}
      </button>

      {open && (
        <div className="border-t border-[#1a1a1a] p-3 space-y-2">
          <p className="text-[10px] text-[#444] leading-relaxed mb-3">
            Bu panel sadece bilgilendiricidir. Suçlama değil, farkındalık. Haziran kuralı: yeni borç yok.
          </p>
          {BLEEDING_CATEGORIES.map(cat => (
            <BleedingCategoryRow key={cat.id} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
}

function BleedingCategoryRow({ cat }: { cat: BleedingCategory }) {
  const [expanded, setExpanded] = useState(false);
  const style = RISK_STYLES[cat.risk];

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full p-2.5 flex items-center gap-2 text-left"
      >
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#888] leading-tight">{cat.title}</span>
            <span className={`text-[9px] px-1.5 py-px rounded font-bold uppercase tracking-wide ${style.badge}`}>
              {style.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] font-mono text-[#ef4444]">{cat.approxAmount}</span>
            <span className="text-[9px] text-[#555]">Kural: {cat.rule}</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={11} className="text-[#444] shrink-0" /> : <ChevronDown size={11} className="text-[#444] shrink-0" />}
      </button>
      {expanded && (
        <div className="px-3 pb-2.5 border-t border-[#1a1a1a]">
          <p className="text-[11px] text-[#555] leading-relaxed mt-2">{cat.description}</p>
        </div>
      )}
    </div>
  );
}
