"use client";

import React, { useState, useEffect, createContext, useContext, useCallback } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          className={`fixed bottom-6 right-6 z-100 px-4 py-3 shadow-2xl transition-all duration-300 ease-in-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          style={{
            background: "#2A2A2A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            color: "#E0E0E0",
            fontSize: "13px",
            minWidth: "200px",
          }}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
