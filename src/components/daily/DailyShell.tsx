import React from "react";

export function DailyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-8 xl:px-16 py-8">
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
