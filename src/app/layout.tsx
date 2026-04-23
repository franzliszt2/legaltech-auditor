import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalTech Auditor",
  description: "AI-powered security and legal ethics checkpoint for legal technology applications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-white antialiased">{children}</body>
    </html>
  );
}
