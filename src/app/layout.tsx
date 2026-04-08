import type { Metadata } from "next";
import { Lexend, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
    <html lang="tr">
      <body className={`${lexend.variable} ${jetbrainsMono.variable}`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
