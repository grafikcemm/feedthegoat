"use client";

import { useState } from "react";

interface CollapsibleBlockProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export default function CollapsibleBlock({ 
  title, 
  defaultOpen = false, 
  children, 
  icon,
  className = "",
  headerClassName = ""
}: CollapsibleBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-border/40 bg-surface/20 transition-colors ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full flex items-center justify-between px-4 py-3.5 text-sm text-text-muted hover:text-text transition-colors hover:bg-surface/30 ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
            {icon && <span className="opacity-70 text-lg">{icon}</span>}
            <span className="font-bold tracking-wide uppercase text-[11px]">{title}</span>
        </div>
        <span className="text-lg leading-none opacity-50 block w-4 text-center">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="p-4 md:p-5 border-t border-border/40 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
