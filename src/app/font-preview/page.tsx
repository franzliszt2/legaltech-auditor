"use client";

import { AppShell } from "@/components/AppShell";
import Link from "next/link";

const fontOptions = [
  {
    id: 1,
    name: "Playfair Display",
    weight: 900,
    style: "italic",
    fontFamily: '"Playfair Display", Georgia, serif',
    description: "Dramatic serif with high contrast. The italic adds gravitas and motion.",
  },
  {
    id: 2,
    name: "Cormorant Garamond",
    weight: 700,
    style: "normal",
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    description: "Elegant, sharp serifs with an editorial, almost haunting quality.",
  },
  {
    id: 3,
    name: "Crimson Pro",
    weight: 800,
    style: "normal",
    fontFamily: '"Crimson Pro", Georgia, serif',
    description: "Bold serif with refined letterforms. Professional yet commanding.",
  },
  {
    id: 4,
    name: "EB Garamond",
    weight: 700,
    style: "italic",
    fontFamily: '"EB Garamond", Georgia, serif',
    description: "Classic old-style italic. Sophisticated and slightly ominous.",
  },
  {
    id: 5,
    name: "Cinzel",
    weight: 700,
    style: "normal",
    fontFamily: '"Cinzel", Georgia, serif',
    description: "Roman-inspired capitals. Monumental, authoritative, and powerful.",
  },
  {
    id: 6,
    name: "Old Standard TT",
    weight: 700,
    style: "italic",
    fontFamily: '"Old Standard TT", Georgia, serif',
    description: "19th-century aesthetic. Evokes legal documents and old institutions.",
  },
];

export default function FontPreview() {
  return (
    <>
      {/* Google Fonts preload */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&family=Cormorant+Garamond:wght@700&family=Crimson+Pro:wght@800&family=EB+Garamond:ital,wght@1,700&family=Cinzel:wght@700&family=Old+Standard+TT:ital,wght@1,700&display=swap"
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
                Font Options
              </p>
              <h1
                className="text-[28px] font-semibold tracking-[-0.02em]"
                style={{ color: "var(--t1)" }}
              >
                Choose a typeface for &ldquo;Specter&rdquo;
              </h1>
              <p className="text-[14px]" style={{ color: "var(--t3)" }}>
                Here are 6 imposing serif options. Each conveys authority and gravitas.
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
                      {font.name} {font.weight} {font.style !== "normal" ? font.style : ""}
                    </span>
                  </div>

                  {/* Font preview */}
                  <div className="py-6 text-center">
                    <span
                      className="leading-none"
                      style={{
                        fontFamily: font.fontFamily,
                        fontWeight: font.weight,
                        fontStyle: font.style,
                        fontSize: "clamp(64px, 12vw, 96px)",
                        letterSpacing: "0.02em",
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
                Your current font. Light and elegant, but less imposing.
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
