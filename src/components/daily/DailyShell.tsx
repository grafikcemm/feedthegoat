import React from "react";

export function DailyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="rounded-ftg-shell border border-ftg-border-subtle bg-ftg-bg overflow-hidden flex flex-col shadow-2xl">
        {children}
      </div>
    </div>
  );
}
