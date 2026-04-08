"use client";

import { X } from "lucide-react";

interface DayPlan {
  title: string;
  sure: string;
  program: string[];
  not: string;
}

const PLANS: Record<number, DayPlan> = {
  1: {
    title: "Pzt — Hafif Başlangıç",
    sure: "20-25 dk",
    program: [
      "10 dk Felse A1/A2 dersi",
      "5 dk 5 yeni kelime",
      "5-10 dk O günkü konuyla 4-5 cümle kurarak konuşma",
    ],
    not: "Kısa tut. Başladım hissi versin.",
  },
  3: {
    title: "Çar — Ana Çalışma Günü",
    sure: "40-45 dk",
    program: [
      "15 dk Felse Oxford / ana ders",
      "10 dk Not çıkarma",
      "10 dk Gemini ile konuşma pratiği",
      "5-10 dk Kısa yazı",
    ],
    not: "Haftanın en verimli İngilizce günü. Odaklan.",
  },
  5: {
    title: "Cum — Pekiştirme Günü",
    sure: "35-45 dk",
    program: [
      "10 dk Haftalık tekrar",
      "10 dk Eski kelimeleri test et",
      "10-15 dk Konuşma pratiği",
      "5-10 dk Hataları düzeltip yeniden söyleme",
    ],
    not: "Yeni konu yükleme. Öğrendiğini sağlamlaştır.",
  },
  6: {
    title: "Cmt — Opsiyonel Bonus",
    sure: "15-20 dk",
    program: [
      "Sadece konuşma pratiği VEYA sadece kısa yazma pratiği",
    ],
    not: "Yeni konu açma. Enerjin varsa pratik yap.",
  },
};

interface IngilizceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function IngilizceModal({
  isOpen,
  onClose,
  onComplete,
}: IngilizceModalProps) {
  const today = new Date().getDay();
  const plan = PLANS[today];

  if (!isOpen || !plan) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-in"
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "var(--bg-overlay)",
          border: "1px solid var(--border-0)",
          borderRadius: "4px",
          padding: "24px 32px",
          position: "relative",
        }}
      >
        {/* Kapat Butonu (Sağ Üst) */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "var(--text-2)",
            cursor: "pointer",
            padding: "4px",
          }}
          className="hover:text-(--text-0) transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "20px",
              fontWeight: 500,
              color: "var(--text-0)",
              marginBottom: "8px",
            }}
          >
            {plan.title.toUpperCase()}
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--size-xs)",
              border: "1px solid var(--amber-border)",
              color: "var(--amber)",
              padding: "2px 8px",
              borderRadius: "2px",
              display: "inline-block",
            }}
          >
            {plan.sure}
          </span>
        </div>

        {/* Program */}
        <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", marginBottom: "24px" }}>
          {plan.program.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start w-full"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--size-sm)",
                color: "var(--text-1)",
                borderBottom: "1px solid var(--border-1)",
                padding: "10px 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--size-xs)",
                  color: "var(--text-3)",
                  marginRight: "12px",
                  paddingTop: "2px",
                }}
              >
                {(idx + 1).toString().padStart(2, "0")}
              </span>
              <span style={{ flex: 1 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Not Kutusu */}
        <div
          style={{
            borderLeft: "1px solid var(--border-0)",
            paddingLeft: "12px",
            marginTop: "16px",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--size-sm)",
              color: "var(--text-2)",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {plan.not}
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--size-xs)",
              color: "var(--text-3)",
              border: "1px solid var(--border-0)",
              background: "transparent",
              padding: "0 16px",
              height: "40px",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}
            className="hover:border-(--border-1) hover:text-(--text-1)"
          >
            Kapat
          </button>
          
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            style={{
              flex: 1,
              fontFamily: "var(--font-mono)",
              fontSize: "var(--size-xs)",
              letterSpacing: "0.08em",
              color: "var(--amber)",
              border: "1px solid var(--amber-border)",
              background: "transparent",
              height: "40px",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "background 0.2s",
              textTransform: "uppercase",
            }}
            className="hover:bg-(--amber-dim)"
          >
            PROGRAMI GÖRDÜM — BAŞLIYORUM
          </button>
        </div>
      </div>
    </div>
  );
}
