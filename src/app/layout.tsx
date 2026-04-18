import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Inter_Tight, Instrument_Serif } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Feed The Goat",
  description: "Kişisel disiplin, büyüme ve hesap verebilirlik panosu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${interTight.variable} ${instrumentSerif.variable} antialiased font-sans theme-mid`} suppressHydrationWarning>
        <ToastProvider>
          <div className="flex min-h-screen bg-[var(--bg-primary)]">
            {/* Sol Sidebar */}
            <Sidebar />
            
            {/* Ana içerik */}
            <main className="flex-1 ml-[72px] min-h-screen">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
