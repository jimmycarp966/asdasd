import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const displayFont = Press_Start_2P({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const uiFont = VT323({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "La historia de la luna",
  description: "Una aventura pixelada para el Dia de la Mujer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${displayFont.variable} ${uiFont.variable}`}>{children}</body>
    </html>
  );
}
