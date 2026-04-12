import React from "react";

interface WeeklyShellProps {
  children: React.ReactNode;
}

export function WeeklyShell({ children }: WeeklyShellProps) {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 py-8 animate-in duration-700">
      <div className="flex flex-col w-full">
        {children}
      </div>
    </div>
  );
}
