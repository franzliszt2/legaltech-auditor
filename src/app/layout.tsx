import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Specter",
  description: "Security, ethics, and AI risk audits for legal technology applications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" data-theme="light" suppressHydrationWarning>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
