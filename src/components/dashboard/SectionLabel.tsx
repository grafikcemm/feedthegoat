import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[#444444] text-xs uppercase tracking-widest mb-2">
      {children}
    </div>
  );
}
