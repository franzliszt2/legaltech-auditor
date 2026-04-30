"use client";

import { AppShell } from "@/components/AppShell";
import Link from "next/link";

const fontOptions = [
  {
    id: 1,
    name: "JetBrains Mono",
    weight: 700,
    fontFamily: '"JetBrains Mono", monospace',
    description: "Developer-favorite monospace. Clean, precise, and highly legible with coding ligatures.",
  },
  {
    id: 2,
    name: "IBM Plex Mono",
    weight: 600,
    fontFamily: '"IBM Plex Mono", monospace',
    description: "Corporate tech aesthetic. Industrial, neutral, and unmistakably technical.",
  },
  {
    id: 3,
    name: "Space Mono",
    weight: 700,
    fontFamily: '"Space Mono", monospace',
    description: "Retro-futuristic vibe. Geometric, quirky, and distinctly digital.",
  },
  {
    id: 4,
    name: "Fira Code",
    weight: 700,
    fontFamily: '"Fira Code", monospace',
    description: "Mozilla's coding font. Programming ligatures with a modern, sharp edge.",
  },
  {
    id: 5,
    name: "Source Code Pro",
    weight: 700,
    fontFamily: '"Source Code Pro", monospace',
    description: "Adobe's classic. Clean, professional, and universally recognized as code.",
  },
];

export default function FontPreview() {
  return (
    <>
      {/* Google Fonts preload */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=IBM+Plex+Mono:wght@600&family=Space+Mono:wght@700&family=Fira+Code:wght@700&family=Source+Code+Pro:wght@700&display=swap"
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
                Technical Fonts
              </p>
              <h1
                className="text-[28px] font-semibold tracking-[-0.02em]"
                style={{ color: "var(--t1)" }}
              >
                Code-inspired typefaces
              </h1>
              <p className="text-[14px]" style={{ color: "var(--t3)" }}>
                Monospace fonts with a technical, bit-esque aesthetic.
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
