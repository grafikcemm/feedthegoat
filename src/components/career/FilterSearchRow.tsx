import React from "react";

export function FilterSearchRow() {
  return (
    <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface max-w-md">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ftg-text-mute">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="FİLTRELE & ARA"
        className="flex-1 bg-transparent border-none outline-none font-mono text-xs tracking-wider uppercase text-ftg-text placeholder:text-ftg-text-mute"
        disabled
      />
    </div>
  );
}
