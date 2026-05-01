import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
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
      <body className={`${inter.variable} antialiased font-sans bg-[#0A0A0A] text-white`} suppressHydrationWarning>
        <ToastProvider>
          <div className="flex min-h-screen bg-[#0A0A0A]">
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
