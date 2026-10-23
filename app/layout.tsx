import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoGestión PRO",
  description: "Sistema de gestión para concesionario",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
