"use client";

import { useState } from "react";

export type SportStatus = "planned" | "active" | "paused";

const LS_KEY = "feed-the-goat-sport-active-v1";

function load(): SportStatus {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw === "active" || raw === "paused") return raw;
  } catch {
    // localStorage unavailable
  }
  return "planned";
}

function save(status: SportStatus): void {
  try {
    localStorage.setItem(LS_KEY, status);
  } catch {
    // localStorage unavailable
  }
}

export function useSportStatus() {
  const [status, setStatus] = useState<SportStatus>(() => load());

  const update = (next: SportStatus) => {
    setStatus(next);
    save(next);
  };

  return { status, update };
}
