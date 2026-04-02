import { WAKE_UP_MESSAGES, WakeUpMessage } from "@/data/wakeUpMessages";

// Simple un-cryptographic string hash function (cyrb53)
const hashString = (str: string, seed = 0): number => {
  let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const getDailyWakeUpMessage = (manualOffset: number = 0): WakeUpMessage => {
  if (!WAKE_UP_MESSAGES || WAKE_UP_MESSAGES.length === 0) {
    return {
      id: "fallback",
      category: "reality",
      text: "Makine çalışmaya devam ediyor.",
    };
  }

  // Use the local date as a string (YYYY-MM-DD)
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  
  // Create a hash using the date and any manual offset (for refreshing the message on the same day)
  const hash = hashString(`${dateStr}-seed-${manualOffset}`);
  
  // Grab the index deterministically
  const index = hash % WAKE_UP_MESSAGES.length;

  return WAKE_UP_MESSAGES[index];
};
