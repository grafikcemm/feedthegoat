import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "FEED THE GOAT",
  description:
    "Kişisel disiplin, büyüme ve hesap verebilirlik panosu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${jetbrains.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
