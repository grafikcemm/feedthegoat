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
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--size-xs)",
          color: "var(--text-2)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderBottom: "1px solid var(--border-1)",
          paddingBottom: "12px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>📊</span> KPI METRİKLERİ
      </div>
      <div className="flex gap-4">
        {metrics.map(metric => (
          <div 
            key={metric.id} 
            className="shrink-0 w-40 hover:bg-(--bg-hover) transition-colors cursor-pointer flex flex-col justify-between"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border-0)",
              borderRadius: "0px",
              padding: "16px",
              minHeight: "120px",
            }}
            onClick={() => updateValue(metric.id)}
            title={metric.description}
          >
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                {metric.label}
              </span>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "24px", color: "var(--text-0)", lineHeight: 1 }}>
                {metric.value} <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", marginLeft: "2px" }}>{metric.unit}</span>
              </p>
            </div>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "16px", opacity: 0.5 }}>
              Düzenle ✎
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
