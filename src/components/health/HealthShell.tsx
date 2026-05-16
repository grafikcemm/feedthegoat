import React from "react";

export function HealthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0A0A0B", padding: "32px 40px" }}
    >
      <div
        className="flex flex-col w-full mx-auto"
        style={{ maxWidth: "920px", gap: "16px" }}
      >
        {children}
      </div>
    </div>
  );
}
