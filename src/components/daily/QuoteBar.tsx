import React from "react";

interface QuoteBarProps {
  quote: { quote: string; author: string | null } | null;
}

export function QuoteBar({ quote }: QuoteBarProps) {
  if (!quote) return null;
  return (
    <div className="px-8 py-4 border-b border-ftg-border-subtle">
      <p className="font-mono text-sm italic text-ftg-text-dim text-center">
        "{quote.quote}"
        {quote.author && (
          <span className="not-italic text-ftg-text-mute ml-2">— {quote.author}</span>
        )}
      </p>
    </div>
  );
}
