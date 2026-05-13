import React from "react";

export function NutritionShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0A0A0B", padding: "32px 40px" }}
    >
      <div
        className="flex flex-col w-full mx-auto"
        style={{ maxWidth: "860px", gap: "16px" }}
      >
        <div>
          <span className="text-[#444444] text-[10px] uppercase tracking-widest block font-medium">
            BESLENME
          </span>
          <h1 className="text-white font-bold text-xl mt-0.5">
            Günlük Beslenme Planı
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
