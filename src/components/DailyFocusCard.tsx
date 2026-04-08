"use client";

import React from "react";

interface WeeklyFocus {
  tema: string;
  color: string;
  antrenman: boolean;
  antrenmanAdi?: string;
  desc: string;
}

const weeklyFocusConfig: Record<string, WeeklyFocus> = {
  Pazartesi: { tema: "Ajans + Kariyer", color: "#6B8EBF", antrenman: true, antrenmanAdi: "Upper A", desc: "Haftaya güçlü giriş, ana projeler." },
  Salı: { tema: "Üniversite + Ajans", color: "#8B7AC4", antrenman: true, antrenmanAdi: "Lower A", desc: "Akademik ve operasyon dengesi." },
  Çarşamba: { tema: "Üniversite + Deep Work", color: "#5B9E9E", antrenman: false, desc: "Pürüzsüz odak ve üretim." },
  Perşembe: { tema: "Ajans + Kariyer", color: "#6B8EBF", antrenman: true, antrenmanAdi: "Upper B", desc: "Müşteri işleri ve büyüme hedefleri." },
  Cuma: { tema: "Üniversite + İçerik", color: "#7C9A72", antrenman: false, desc: "Eğitim ve marka inşası." },
  Cumartesi: { tema: "Serbest Üretim", color: "#D4A574", antrenman: true, antrenmanAdi: "Lower B", desc: "Kişisel ilgi alanları ve esneklik." },
  Pazar: { tema: "Şarj Günü", color: "#606060", antrenman: false, desc: "Dinlenme, toparlanma ve haftalık plan." },
};

const TR_DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function DailyFocusCard() {
  const todayIndex = new Date().getDay();
  const todayName = TR_DAYS[todayIndex];
  const config = weeklyFocusConfig[todayName];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70% 30%",
        background: "var(--bg-raised)",
        border: "1px solid var(--border-0)",
        borderLeft: `2px solid ${config.color}`,
        padding: "20px 20px 20px 18px",
        borderRadius: 0,
        boxShadow: "none",
      }}
    >
      {/* Sol Sütun %70 */}
      <div className="flex flex-col justify-center">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-xs)",
            color: "var(--text-2)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          BUGÜNÜN ODAĞI
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            color: "var(--text-0)",
            fontWeight: "normal",
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          {config.tema}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--size-sm)",
            color: "var(--text-2)",
            margin: 0,
          }}
        >
          {config.desc}
        </p>
      </div>

      {/* Sağ Sütun %30 */}
      <div className="flex flex-col items-end justify-center text-right">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-xs)",
            color: "var(--text-2)",
            marginBottom: "4px",
            textTransform: "uppercase",
          }}
        >
          {todayName.substring(0, 3)}
        </span>
        {config.antrenman ? (
          <div className="flex items-center gap-2">
            <div style={{ width: "12px", height: "1px", background: "var(--amber)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--size-xs)",
                color: "var(--amber)",
              }}
            >
              {config.antrenmanAdi}
            </span>
          </div>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--size-xs)",
              color: "var(--text-3)",
            }}
          >
            — dinlenme
          </span>
        )}
      </div>
    </div>
  );
}
