import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        <ToastProvider>
          <div className="flex min-h-screen bg-[#000000]">
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
