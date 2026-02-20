export type Quote = {
    id: number;
    theme: string;
    aphorism: string;
    strategy: string;
};

import quotesData from "@/data/quotes.json";
const quotes = quotesData as Quote[];

export function getDailyQuote(): Quote {
    const now = new Date();
    const localMsSinceEpoch = now.getTime() - now.getTimezoneOffset() * 60000;
    const daysSinceEpoch = Math.floor(localMsSinceEpoch / 86400000);
    const index = daysSinceEpoch % quotes.length;
    return quotes[index] as Quote;
}
