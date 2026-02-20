export type Quote = {
    id: number;
    theme: string;
    aphorism: string;
    strategy: string;
};

import quotesData from "@/data/quotes.json";
const quotes = quotesData as Quote[];

export function getDailyQuote(): Quote {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Enforce 100 aphorisms modulo as requested
    const dailyAphorismIndex = dayOfYear % 100;
    return quotes[dailyAphorismIndex] as Quote;
}
