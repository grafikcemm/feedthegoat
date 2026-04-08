"use client";
import SportsPlan from "./SportsPlan";
import Nutrition from "./Nutrition";

export default function HealthDashboard() {
  return (
    <div className="mt-4 mb-8 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 md:items-start">
      {/* Sol Panel — Spor Planı */}
      <div
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border-0)",
          borderRadius: "0px",
          padding: "20px",
        }}
      >
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
          }}
        >
          SPOR PLANI
        </div>
        <SportsPlan />
      </div>

      {/* Sağ Panel — Beslenme */}
      <div
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border-0)",
          borderRadius: "0px",
          padding: "20px",
        }}
      >
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
          }}
        >
          BESLENME
        </div>
        <Nutrition />
      </div>
    </div>
  );
}
