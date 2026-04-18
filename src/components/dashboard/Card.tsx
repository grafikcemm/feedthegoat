import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = "", noPadding = false }: CardProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "#141416",
        border: "1px solid #242428",
        borderRadius: "20px",
        padding: noPadding ? "0" : "24px",
      }}
    >
      {children}
    </div>
  );
}
