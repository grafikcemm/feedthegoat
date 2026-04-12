import React from "react";

interface SportShellProps {
  children: React.ReactNode;
}

export function SportShell({ children }: SportShellProps) {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 py-8 animate-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {children}
      </div>
    </div>
  );
}
