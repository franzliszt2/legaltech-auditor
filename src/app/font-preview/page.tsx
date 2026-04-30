"use client";

import { AppShell } from "@/components/AppShell";
import Link from "next/link";

const fontOptions = [
  {
    id: 1,
    name: "Orbitron",
    weight: 700,
    fontFamily: '"Orbitron", sans-serif',
    description: "Geometric, futuristic typeface. Sharp angles evoke sci-fi interfaces and digital displays.",
  },
  {
    id: 2,
    name: "Rajdhani",
    weight: 700,
    fontFamily: '"Rajdhani", sans-serif',
    description: "Technical sans-serif with angular terminals. Compact and machine-like.",
  },
  {
    id: 3,
    name: "Exo 2",
    weight: 700,
    fontFamily: '"Exo 2", sans-serif',
    description: "Contemporary geometric with subtle tech flourishes. Clean yet distinctly digital.",
  },
  {
    id: 4,
    name: "Audiowide",
    weight: 400,
    fontFamily: '"Audiowide", sans-serif',
    description: "Wide, bold display face. Inspired by automotive and tech branding.",
  },
  {
    id: 5,
    name: "Share Tech",
    weight: 400,
    fontFamily: '"Share Tech", sans-serif',
    description: "Utilitarian tech aesthetic. Simple, readable, unmistakably technical.",
  },
];

export default function FontPreview() {
  return (
    <>
      {/* Google Fonts preload */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@700&family=Exo+2:wght@700&family=Audiowide&family=Share+Tech&display=swap"
        rel="stylesheet"
      />

      <AppShell>
        <div
          className="flex flex-col items-center justify-start px-5 py-16"
          style={{ minHeight: "calc(100vh - 52px)" }}
        >
          <div className="w-full max-w-[700px] space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <p
                className="text-[11px] tracking-[0.18em] uppercase"
                style={{ color: "var(--t4)" }}
              >
                Technical Typefaces
              </p>
              <h1
                className="text-[28px] font-semibold tracking-[-0.02em]"
                style={{ color: "var(--t1)" }}
              >
                Tech-inspired display fonts
              </h1>
              <p className="text-[14px]" style={{ color: "var(--t3)" }}>
                Sans-serif typefaces with a digital, futuristic aesthetic.
              </p>
            </div>

            {/* Font Grid */}
            <div className="grid gap-8">
              {fontOptions.map((font) => (
                <div
                  key={font.id}
                  className="rounded-[16px] p-8 space-y-4"
                  style={{
                    background: "var(--surface-1)",
                    border: "0.5px solid var(--border)",
                  }}
                >
                  {/* Option number */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] tracking-[0.15em] uppercase font-medium"
                      style={{ color: "var(--t4)" }}
                    >
                      Option {font.id}
                    </span>
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: "var(--t4)" }}
                    >
                      {font.name} {font.weight}
                    </span>
                  </div>

                  {/* Font preview */}
                  <div className="py-6 text-center overflow-hidden">
                    <span
                      className="leading-none inline-block"
                      style={{
                        fontFamily: font.fontFamily,
                        fontWeight: font.weight,
                        fontSize: "clamp(48px, 10vw, 72px)",
                        letterSpacing: "-0.02em",
                        color: "var(--t1)",
                      }}
                    >
                      Specter
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-[13px] text-center leading-relaxed"
                    style={{ color: "var(--t3)" }}
                  >
                    {font.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Current font reference */}
            <div
              className="rounded-[16px] p-8 space-y-4"
              style={{
                background: "var(--surface-2)",
                border: "0.5px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] tracking-[0.15em] uppercase font-medium"
                  style={{ color: "var(--t4)" }}
                >
                  Current
                </span>
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "var(--t4)" }}
                >
                  Rhymes Display 300
                </span>
              </div>
              <div className="py-6 text-center">
                <span
                  className="leading-none"
                  style={{
                    fontFamily: '"Rhymes Display", Georgia, serif',
                    fontWeight: 300,
                    fontStyle: "normal",
                    fontSize: "clamp(64px, 12vw, 96px)",
                    letterSpacing: "0.01em",
                    color: "var(--t1)",
                  }}
                >
                  Specter
                </span>
              </div>
              <p
                className="text-[13px] text-center leading-relaxed"
                style={{ color: "var(--t3)" }}
              >
                Your current font for comparison.
              </p>
            </div>

            {/* Back link */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="text-[12px] transition-colors"
                style={{ color: "var(--t4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t3)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t4)")}
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
