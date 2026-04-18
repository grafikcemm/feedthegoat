import React from "react";

interface QuoteCardProps {
  quote?: string;
  author?: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  const defaultQuote = "Hayat, fırtınanın dinmesini beklemek değil; yağmurda dans etmeyi öğrenmektir.";
  const defaultAuthor = "SENECA";

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[24px] px-6 py-5 relative overflow-hidden group"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
    >
      {/* Background decorative quote mark */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        <span className="text-[96px] font-black text-white leading-none select-none">"</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--border-subtle)]">
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
          GÜNLÜK SÖZ
        </span>
      </div>

      {/* Quote text */}
      <p className="text-sm italic text-[var(--text-secondary)] leading-relaxed relative z-10">
        "{quote || defaultQuote}"
      </p>

      {/* Author */}
      <div className="mt-6 flex justify-end">
        <div className="flex flex-col items-end">
          <div className="h-px w-8 bg-[var(--border-strong)] mb-2" />
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            {author || defaultAuthor}
          </span>
        </div>
      </div>
    </div>
  );
}
