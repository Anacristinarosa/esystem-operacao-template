import type { Metadata } from "next";
import { PLATAFORMA } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: PLATAFORMA.nome,
  description: PLATAFORMA.fraseAncora,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
