import React from "react";

export function QuoteCard({ quote, author }: { quote?: string; author?: string | null }) {
  if (!quote) return null;
  return (
    <div className="border border-zinc-800 rounded-lg px-6 py-6 bg-ftg-surface/50">
      <p className="text-[10px] tracking-[0.2em] font-mono text-zinc-500 mb-4 uppercase">
        GÜNLÜK SÖZ
      </p>
      <p className="text-base text-zinc-300 italic leading-relaxed font-serif">
        "{quote}"
      </p>
      {author && (
        <p className="text-xs text-zinc-600 mt-4 font-mono text-right">
          — {author}
        </p>
      )}
    </div>
  );
}
