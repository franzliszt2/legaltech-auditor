"use client";

import { useState } from "react";
import type { Finding, Severity } from "@/lib/types";

const SEV_DOT: Record<Severity, string> = {
  critical: "var(--ios-red)",
  high:     "var(--ios-orange)",
  medium:   "var(--ios-yellow)",
  low:      "var(--ios-green)",
  info:     "var(--ios-gray)",
};

export function FindingRow({ finding, last = false }: { finding: Finding; last?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-[18px] py-[13px] flex items-start gap-3 transition-colors"
        style={{ background: open ? "var(--hover-bg)" : "transparent" }}
        onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "var(--hover-bg)"; }}
        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 mt-[3px]"
          style={{ background: SEV_DOT[finding.severity] }}
        />

        <div className="flex-1 min-w-0">
          <p
            className="text-[14px] leading-snug tracking-[-0.01em]"
            style={{ color: "var(--t1)" }}
          >
            {finding.title}
          </p>
          {finding.file && (
            <p
              className="text-[11px] font-mono mt-0.5 truncate"
              style={{ color: "var(--t4)" }}
            >
              {finding.file}
            </p>
          )}
        </div>

        <svg
          className="flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            color: "var(--t4)",
          }}
          width="7" height="12" viewBox="0 0 7 12" fill="none"
        >
          <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {!open && !last && (
        <div className="h-[0.5px] ml-[42px]" style={{ background: "var(--sep)" }} />
      )}

      {open && (
        <div
          className="px-[42px] pb-4 pt-2 space-y-3"
          style={{
            borderBottom: last ? "none" : "0.5px solid var(--sep)",
          }}
        >
          <p
            className="text-[13px] leading-relaxed tracking-[-0.01em]"
            style={{ color: "var(--t2)" }}
          >
            {finding.description}
          </p>

          {finding.ruleReference && (
            <p className="text-[11px] font-mono" style={{ color: "var(--t4)" }}>
              {finding.ruleReference}
            </p>
          )}

          <div
            className="rounded-[10px] px-4 py-3"
            style={{
              background: "var(--surface-2)",
              border: "0.5px solid var(--border)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.1em] font-medium mb-1.5"
              style={{ color: "var(--t4)" }}
            >
              Remediation
            </p>
            <p
              className="text-[13px] leading-relaxed tracking-[-0.01em]"
              style={{ color: "var(--t2)" }}
            >
              {finding.remediation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
