import type { Metadata } from "next";
import { Crimson_Text, Lora } from "next/font/google";
import "./globals.css";

const serifFont = Crimson_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const bodyFont = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "La historia de la luna",
  description: "Una noche mágica dedicada a ti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${serifFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
