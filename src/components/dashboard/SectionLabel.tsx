import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 500,
      color: "#52525B",
      marginBottom: "12px"
    }}>
      {children}
    </div>
  );
}
