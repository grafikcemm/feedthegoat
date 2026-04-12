import React from "react";

interface CareerShellProps {
  children: React.ReactNode;
}

export function CareerShell({ children }: CareerShellProps) {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 py-8 animate-in duration-700">
      <div className="flex flex-col gap-8 w-full">
        {children}
      </div>
    </div>
  );
}
