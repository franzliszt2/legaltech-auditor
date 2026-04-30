"use client";

import { AppShell } from "@/components/AppShell";
import Link from "next/link";

function SpecterLogo({ size = 120 }: { size?: number }) {
  const circleRadius = size / 2;
  const triangleHeight = size * 0.08;
  const triangleWidth = size * 0.25;
  const gap = size * 0.04;
  const totalStackHeight = triangleHeight * 4 + gap * 3;
  const startY = (size - totalStackHeight) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Black circle */}
      <circle cx={circleRadius} cy={circleRadius} r={circleRadius} fill="black" />

      {/* Four red triangles stacked vertically */}
      {[0, 1, 2, 3].map((i) => {
        const y = startY + i * (triangleHeight + gap);
        const x = size / 2;
        return (
          <polygon
            key={i}
            points={`${x},${y} ${x + triangleWidth / 2},${y + triangleHeight} ${x - triangleWidth / 2},${y + triangleHeight}`}
            fill="#EF4444"
          />
        );
      })}
    </svg>
  );
}

export default function FontPreview() {
  return (
    <>
      {/* Google Fonts preload */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap"
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
                Logo Preview
              </p>
              <h1
                className="text-[28px] font-semibold tracking-[-0.02em]"
                style={{ color: "var(--t1)" }}
              >
                Specter Logo Design
              </h1>
              <p className="text-[14px]" style={{ color: "var(--t3)" }}>
                Black circle with four red triangles + Share Tech 400 wordmark.
              </p>
            </div>

            {/* Logo Preview - Large */}
            <div
              className="rounded-[16px] p-12 space-y-8"
              style={{
                background: "var(--surface-1)",
                border: "0.5px solid var(--border)",
              }}
            >
              <div className="flex flex-col items-center gap-6">
                <SpecterLogo size={160} />
                <span
                  style={{
                    fontFamily: '"Share Tech", sans-serif',
                    fontWeight: 400,
                    fontSize: "32px",
                    letterSpacing: "0.15em",
                    color: "var(--t1)",
                  }}
                >
                  SPECTER
                </span>
              </div>
            </div>

            {/* Horizontal variant */}
            <div
              className="rounded-[16px] p-8 space-y-4"
              style={{
                background: "var(--surface-1)",
                border: "0.5px solid var(--border)",
              }}
            >
              <span
                className="text-[11px] tracking-[0.15em] uppercase font-medium block"
                style={{ color: "var(--t4)" }}
              >
                Horizontal Variant
              </span>
              <div className="flex items-center justify-center gap-4 py-4">
                <SpecterLogo size={48} />
                <span
                  style={{
                    fontFamily: '"Share Tech", sans-serif',
                    fontWeight: 400,
                    fontSize: "24px",
                    letterSpacing: "0.15em",
                    color: "var(--t1)",
                  }}
                >
                  SPECTER
                </span>
              </div>
            </div>

            {/* Size variations */}
            <div
              className="rounded-[16px] p-8 space-y-6"
              style={{
                background: "var(--surface-1)",
                border: "0.5px solid var(--border)",
              }}
            >
              <span
                className="text-[11px] tracking-[0.15em] uppercase font-medium block"
                style={{ color: "var(--t4)" }}
              >
                Size Variations
              </span>
              <div className="flex items-end justify-center gap-8 py-4">
                <div className="flex flex-col items-center gap-2">
                  <SpecterLogo size={80} />
                  <span className="text-[10px]" style={{ color: "var(--t4)" }}>80px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <SpecterLogo size={48} />
                  <span className="text-[10px]" style={{ color: "var(--t4)" }}>48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <SpecterLogo size={32} />
                  <span className="text-[10px]" style={{ color: "var(--t4)" }}>32px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <SpecterLogo size={24} />
                  <span className="text-[10px]" style={{ color: "var(--t4)" }}>24px</span>
                </div>
              </div>
            </div>

            {/* On dark background */}
            <div
              className="rounded-[16px] p-8 space-y-4"
              style={{
                background: "#0a0a0a",
                border: "0.5px solid var(--border)",
              }}
            >
              <span
                className="text-[11px] tracking-[0.15em] uppercase font-medium block"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                On Dark Background
              </span>
              <div className="flex items-center justify-center gap-4 py-4">
                <SpecterLogo size={48} />
                <span
                  style={{
                    fontFamily: '"Share Tech", sans-serif',
                    fontWeight: 400,
                    fontSize: "24px",
                    letterSpacing: "0.15em",
                    color: "white",
                  }}
                >
                  SPECTER
                </span>
              </div>
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
