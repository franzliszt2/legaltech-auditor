"use client";

import { AppShell } from "@/components/AppShell";
import Link from "next/link";

const elongationOptions = [
  {
    id: 1,
    scaleY: 1.0,
    label: "Normal (1.0x)",
    description: "Original proportions. Elegant but standard.",
  },
  {
    id: 2,
    scaleY: 1.1,
    label: "Subtle (1.1x)",
    description: "Slight vertical stretch. Taller and more refined.",
  },
  {
    id: 3,
    scaleY: 1.15,
    label: "Moderate (1.15x)",
    description: "Noticeably elongated. Imposing yet balanced.",
  },
  {
    id: 4,
    scaleY: 1.2,
    label: "Pronounced (1.2x)",
    description: "Strong vertical emphasis. Commanding presence.",
  },
  {
    id: 5,
    scaleY: 1.25,
    label: "Dramatic (1.25x)",
    description: "Maximum elongation. Bold and striking.",
  },
];

export default function FontPreview() {
  return (
    <>
      {/* Google Fonts preload */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap"
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
                Cormorant Garamond 700
              </p>
              <h1
                className="text-[28px] font-semibold tracking-[-0.02em]"
                style={{ color: "var(--t1)" }}
              >
                Choose vertical elongation
              </h1>
              <p className="text-[14px]" style={{ color: "var(--t3)" }}>
                Select the amount of vertical stretch for an imposing look.
              </p>
            </div>

            {/* Elongation Grid */}
            <div className="grid gap-8">
              {elongationOptions.map((option) => (
                <div
                  key={option.id}
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
                      Option {option.id}
                    </span>
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: "var(--t4)" }}
                    >
                      {option.label}
                    </span>
                  </div>

                  {/* Font preview */}
                  <div className="py-6 text-center overflow-hidden">
                    <span
                      className="leading-none inline-block"
                      style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontWeight: 700,
                        fontStyle: "normal",
                        fontSize: "clamp(64px, 12vw, 96px)",
                        letterSpacing: "0.02em",
                        color: "var(--t1)",
                        transform: `scaleY(${option.scaleY})`,
                        transformOrigin: "center center",
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
                    {option.description}
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
