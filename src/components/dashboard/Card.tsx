import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = "", noPadding = false }: CardProps) {
  return (
    <div
      className={`bg-[#111111] border border-[#1E1E1E] rounded-xl ${noPadding ? "p-0" : "p-4"} ${className}`}
    >
      {children}
    </div>
  );
}
