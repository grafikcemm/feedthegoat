"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const GROUPS = [
  {
    id: "sabah",
    title: "SABAH KOMBOSU",
    time: "Uyanınca — Aç Karna",
    items: ["B12", "C Vitamini", "Multivitamin", "D3K2 Damla"],
  },
  {
    id: "gun",
    title: "GÜN İÇİ KOMBOSU",
    time: "Öğle / Akşam Yemeği Sonrası",
    items: ["Omega 3 Jelibonu", "Çinko"],
  },
  {
    id: "gece_spor",
    title: "SPOR SONRASI / GECE",
    time: "Yatmadan Önce / Spor Sonrası",
    items: ["Kreatin", "Magnezyum", "Glutamine", "ZMA"],
  },
];

interface VitaminCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function VitaminCheckModal({
  isOpen,
  onClose,
  onComplete,
}: VitaminCheckModalProps) {
  const [checkedGroups, setCheckedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-vitamins-v2-${d}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const newData = parsed.checked || {};
        setCheckedGroups((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(newData)) return prev;
          return newData;
        });
      } catch {}
    }
  }, [isOpen]);

  const save = (newState: Record<string, boolean>) => {
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-vitamins-v2-${d}`;
    const existing = localStorage.getItem(key);
    let parsed: Record<string, unknown> = {};
    if (existing) {
      try {
        parsed = JSON.parse(existing);
      } catch {}
    }
    localStorage.setItem(key, JSON.stringify({ ...parsed, checked: newState }));
  };

  const toggleGroup = (groupId: string) => {
    const newState = { ...checkedGroups, [groupId]: !checkedGroups[groupId] };
    setCheckedGroups(newState);
    save(newState);

    const allDone = GROUPS.every((g) => newState[g.id]);
    if (allDone && !GROUPS.every((g) => checkedGroups[g.id])) {
      setTimeout(() => {
        onComplete();
        onClose();
      }, 400);
    }
  };

  if (!isOpen) return null;

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
        className="animate-in relative"
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--bg-overlay)",
          border: "1px solid var(--border-0)",
          borderRadius: "4px",
          padding: "24px 20px",
        }}
      >
        {/* Kapat İkonu */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            padding: "4px",
            background: "transparent",
            border: "none",
            color: "var(--text-2)",
            cursor: "pointer",
          }}
          className="hover:text-(--text-0) transition-colors"
        >
          <X size={14} />
        </button>

        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-sm)", color: "var(--text-1)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            VİTAMİN & SUPPLEMENT
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {GROUPS.map((group) => {
            const isDone = checkedGroups[group.id];
            
            return (
              <div key={group.id} className="flex flex-col">
                {/* Blok Başlığı */}
                <div 
                  className="flex justify-between items-end"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--size-xs)",
                    color: "var(--text-2)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid var(--border-1)",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <span style={{ color: "var(--text-1)" }}>{group.title}</span>
                    <span style={{ fontSize: "9px" }}>{group.time}</span>
                  </div>
                  <button
                    onClick={() => toggleGroup(group.id)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--size-xs)",
                      border: "1px solid",
                      borderColor: isDone ? "var(--amber-border)" : "var(--border-0)",
                      color: isDone ? "var(--amber)" : "var(--text-2)",
                      padding: "4px 12px",
                      borderRadius: "2px",
                      background: isDone ? "var(--amber-dim)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    className={!isDone ? "hover:border-(--amber-border) hover:text-(--amber)" : ""}
                  >
                    {isDone ? "ALINDI" : "PAKETİ ALDIM"}
                  </button>
                </div>

                {/* Vitamin Satırları */}
                <div className="flex flex-col">
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleGroup(group.id)}
                      className="flex items-center"
                      style={{
                        height: "36px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "var(--size-sm)",
                        color: "var(--text-1)",
                        opacity: isDone ? 0.3 : 1,
                        textDecoration: isDone ? "line-through" : "none",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                    >
                      <span style={{ color: "var(--text-3)", marginRight: "8px" }}>•</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
