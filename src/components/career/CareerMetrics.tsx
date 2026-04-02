"use client";

import { useState, useEffect } from "react";

interface Metric {
  id: string;
  label: string;
  description: string;
  value: string;
  unit: string;
}

const DEFAULT_METRICS: Metric[] = [
  { id: "mrr", label: "Aylık MRR", description: "Toplam aylık tekrarlayan gelir", value: "0", unit: "TL" },
  { id: "clients", label: "Aktif Müşteri", description: "Ücretli retainer müşteri sayısı", value: "0", unit: "Kişi" },
  { id: "discovery", label: "Discovery Call", description: "Yapılan keşif görüşmesi sayısı", value: "0", unit: "Adet" },
  { id: "outreach", label: "Outreach Gönderim", description: "Gönderilen cold email sayısı", value: "0", unit: "Adet" },
  { id: "case_study", label: "Case Study", description: "Yayınlanan vaka analizi sayısı", value: "0", unit: "Adet" },
  { id: "digital_product", label: "Dijital Ürün", description: "Üretilen template/prompt/şablon", value: "0", unit: "Adet" },
  { id: "drone", label: "Drone Uçuş Saati", description: "Toplam uçuş pratiği", value: "0", unit: "Saat" },
  { id: "newsletter", label: "Newsletter Abone", description: "E-posta listesi büyüklüğü", value: "0", unit: "Kişi" },
  { id: "focus_score", label: "Odak Skoru", description: "Haftalık öz değerlendirme", value: "0", unit: "/10" },
];

export default function CareerMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
      const saved = localStorage.getItem("ftg-career-metrics");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const mapped = DEFAULT_METRICS.map(m => {
            const matched = parsed.find((p: Metric) => p.id === m.id);
            return matched ? { ...m, value: matched.value } : m;
          });
          setMetrics(mapped);
        } catch {
          setMetrics(DEFAULT_METRICS);
        }
      } else {
        setMetrics(DEFAULT_METRICS);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("ftg-career-metrics", JSON.stringify(metrics));
  }, [metrics, isClient]);

  const updateValue = (id: string) => {
    const newValue = prompt(`Yeni değeri girin (${metrics.find(m => m.id === id)?.label}):`);
    if (newValue !== null && newValue.trim() !== "") {
      setMetrics(metrics.map(m => m.id === id ? { ...m, value: newValue } : m));
    }
  };

  if (!isClient) return null;

  return (
    <div className="mb-10 overflow-x-auto pb-4 scrollbar-thin">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
        <span>📊</span> KPI METRİKLERİ
      </h3>
      <div className="flex gap-4">
        {metrics.map(metric => (
          <div 
            key={metric.id} 
            className="shrink-0 w-40 brutalist-card border-border hover:border-text-muted transition-colors cursor-pointer p-4 flex flex-col justify-between"
            onClick={() => updateValue(metric.id)}
            title={metric.description}
          >
            <div>
              <span className="text-[9px] uppercase tracking-widest text-text-muted block mb-1">{metric.label}</span>
              <p className="text-2xl font-black text-white">{metric.value} <span className="text-[10px] text-text-muted font-normal ml-0.5">{metric.unit}</span></p>
            </div>
            <span className="text-[8px] uppercase mt-4 text-text-muted opacity-50 block hover:opacity-100 transition-opacity">
              Düzenle ✎
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
