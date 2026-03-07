"use client";

import { useState, useEffect } from "react";

type Quadrant = "MIND" | "BODY" | "SPIRIT" | "VOCATION";
type Stage =
  | "Discovery"
  | "Dissonance"
  | "Uncertain"
  | "Integrating"
  | "Mastery";

interface QuadrantData {
  quadrant: Quadrant;
  score: number;
  stage: Stage;
  label: string;
  borderColor: string;
  emoji: string;
}

const SCORE_COLORS: Record<string, string> = {
  "1": "#FF3B3B",
  "2": "#FFB800",
  "3": "#00FF88",
};

const STAGE_LABELS: Record<Stage, string> = {
  Discovery: "Keşif",
  Dissonance: "Uyumsuzluk",
  Uncertain: "Belirsiz",
  Integrating: "Entegrasyon",
  Mastery: "Ustalık",
};

const QUADRANT_LABELS: Record<Quadrant, string> = {
  MIND: "ZİHİN",
  BODY: "BEDEN",
  SPIRIT: "RUH",
  VOCATION: "İŞ/KARİYER",
};

const getScoreColor = (score: number): string => {
  const key = Math.floor(score).toString();
  return SCORE_COLORS[key] || "#666666";
};

const DEFAULT_QUADRANTS: QuadrantData[] = [
  {
    quadrant: "MIND",
    score: 2.1,
    stage: "Dissonance",
    label: "MIND",
    borderColor: "#3B82F6",
    emoji: "🧠",
  },
  {
    quadrant: "BODY",
    score: 2.3,
    stage: "Discovery",
    label: "BODY",
    borderColor: "#22C55E",
    emoji: "💪",
  },
  {
    quadrant: "SPIRIT",
    score: 1.3,
    stage: "Discovery",
    label: "SPIRIT",
    borderColor: "#A855F7",
    emoji: "🔮",
  },
  {
    quadrant: "VOCATION",
    score: 2.2,
    stage: "Uncertain",
    label: "VOCATION",
    borderColor: "#F97316",
    emoji: "⚡",
  },
];

const STAGES: Stage[] = [
  "Discovery",
  "Dissonance",
  "Uncertain",
  "Integrating",
  "Mastery",
];

interface QuadrantDashboardProps {
  activeQuadrantFilter: Quadrant | null;
  onQuadrantClick: (q: Quadrant | null) => void;
}

export default function QuadrantDashboard({
  activeQuadrantFilter,
  onQuadrantClick,
}: QuadrantDashboardProps) {
  const [quadrants, setQuadrants] = useState<QuadrantData[]>(DEFAULT_QUADRANTS);
  const [editingId, setEditingId] = useState<Quadrant | null>(null);
  const [editScore, setEditScore] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("goat-quadrants-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setQuadrants(parsed), 0);
      } catch {
        console.error("Failed to parse quadrant data");
      }
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("goat-quadrants-v1", JSON.stringify(quadrants));
    }
  }, [quadrants, isLoaded]);

  const handleScoreUpdate = (q: Quadrant) => {
    const val = parseFloat(editScore);
    if (isNaN(val) || val < 0 || val > 3.9) return;
    setQuadrants((prev) =>
      prev.map((qd) =>
        qd.quadrant === q ? { ...qd, score: Math.round(val * 10) / 10 } : qd,
      ),
    );
    setEditingId(null);
    setEditScore("");
  };

  const cycleStage = (q: Quadrant) => {
    setQuadrants((prev) =>
      prev.map((qd) => {
        if (qd.quadrant !== q) return qd;
        const idx = STAGES.indexOf(qd.stage);
        const nextIdx = (idx + 1) % STAGES.length;
        return { ...qd, stage: STAGES[nextIdx] };
      }),
    );
  };

  // Calculate overall HUMAN 3.0 score
  const overallScore =
    quadrants.reduce((sum, q) => sum + q.score, 0) / quadrants.length;

  if (!isLoaded) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted">
          HUMAN 3.0 — Quadrant Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-widest text-text-muted">
            Genel Skor
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: getScoreColor(overallScore) }}
          >
            {overallScore.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quadrants.map((qd) => {
          const isActive = activeQuadrantFilter === qd.quadrant;
          const scoreColor = getScoreColor(qd.score);

          return (
            <div
              key={qd.quadrant}
              onClick={() => onQuadrantClick(isActive ? null : qd.quadrant)}
              role="button"
              tabIndex={0}
              className={`
                                brutalist-card p-3 text-left transition-all duration-300 cursor-pointer
                                ${
                                  isActive
                                    ? "bg-surface-hover shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                    : "bg-surface/20 hover:bg-surface-hover"
                                }
                            `}
              style={{
                borderColor: isActive ? qd.borderColor : "var(--color-border)",
                borderWidth: isActive ? "2px" : "1px",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: qd.borderColor }}
                >
                  {qd.emoji} {QUADRANT_LABELS[qd.quadrant]}
                </span>
                {isActive && (
                  <span className="text-[8px] uppercase tracking-widest text-text-muted bg-surface px-1.5 py-0.5 border border-border">
                    FİLTRE AKTİF
                  </span>
                )}
              </div>

              {/* Score */}
              {editingId === qd.quadrant ? (
                <div
                  className="flex gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="3.9"
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleScoreUpdate(qd.quadrant);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="bg-background border border-border text-sm text-text px-1.5 py-0.5 w-14 focus:outline-none focus:border-text-muted font-bold"
                    autoFocus
                  />
                  <button
                    onClick={() => handleScoreUpdate(qd.quadrant)}
                    className="text-[9px] uppercase font-bold text-accent-green px-1"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div
                  className="text-2xl font-bold mb-1 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: scoreColor }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(qd.quadrant);
                    setEditScore(qd.score.toString());
                  }}
                  title="Skoru düzenlemek için tıkla"
                >
                  {qd.score.toFixed(1)}
                </div>
              )}

              {/* Stage */}
              <span
                className="text-[9px] uppercase tracking-widest text-text-muted hover:text-text transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  cycleStage(qd.quadrant);
                }}
                title="Aşamayı değiştirmek için tıkla"
              >
                {STAGE_LABELS[qd.stage]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Score Legend */}
      <div className="flex gap-4 mt-2 justify-end">
        <span className="text-[8px] uppercase tracking-widest flex items-center gap-1">
          <span
            className="w-2 h-2 inline-block"
            style={{ backgroundColor: "#FF3B3B" }}
          />
          <span className="text-text-muted">1.x Kritik</span>
        </span>
        <span className="text-[8px] uppercase tracking-widest flex items-center gap-1">
          <span
            className="w-2 h-2 inline-block"
            style={{ backgroundColor: "#FFB800" }}
          />
          <span className="text-text-muted">2.x Gelişiyor</span>
        </span>
        <span className="text-[8px] uppercase tracking-widest flex items-center gap-1">
          <span
            className="w-2 h-2 inline-block"
            style={{ backgroundColor: "#00FF88" }}
          />
          <span className="text-text-muted">3.x Güçlü</span>
        </span>
      </div>
    </section>
  );
}

export type { Quadrant };
