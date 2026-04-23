"use client";

import { useState, useEffect } from "react";

interface Props {
  context?: string;
  children: React.ReactNode;
}

export function AppShell({ context, children }: Props) {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-[52px] px-5"
        style={{
          background: "var(--shell-bg)",
          borderBottom: "0.5px solid var(--shell-border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Left: wordmark when context is active, empty otherwise */}
        <div className="w-20 flex-shrink-0">
          {context && (
            <span
              className="text-[15px] tracking-[0.04em]"
              style={{
                fontFamily: '"Rhymes Display", Georgia, serif',
                fontStyle: "normal",
                color: "var(--t2)",
              }}
            >
              Specter
            </span>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-4">
          {context ? (
            <p
              className="text-[11px] font-mono truncate"
              style={{ color: "var(--t4)" }}
            >
              {context}
            </p>
          ) : (
            <span
              className="text-[17px] tracking-[0.04em]"
              style={{
                fontFamily: '"Rhymes Display", Georgia, serif',
                fontStyle: "normal",
                color: "var(--t1)",
              }}
            >
              Specter
            </span>
          )}
        </div>

        {/* Right: theme toggle */}
        <div className="w-20 flex-shrink-0 flex justify-end">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "var(--surface-1)", color: "var(--t3)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.25" />
                <path
                  d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06"
                  stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M12.5 9.5A6 6 0 014.5 1.5a6 6 0 108 8z"
                  stroke="currentColor" strokeWidth="1.25"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="pt-[52px]">{children}</div>
    </>
  );
}
