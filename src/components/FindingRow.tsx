"use client";

import { useState } from "react";
import type { Finding, Severity } from "@/lib/types";

const SEV_DOT: Record<Severity, string> = {
  critical: "#FF453A",
  high:     "#FF9F0A",
  medium:   "#FFD60A",
  low:      "#32D74B",
  info:     "#636366",
};

export function FindingRow({ finding, last = false }: { finding: Finding; last?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-[18px] py-[13px] flex items-start gap-3 hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors"
      >
        {/* Severity dot */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 mt-[3px]"
          style={{ background: SEV_DOT[finding.severity] }}
        />

        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-white/90 leading-snug tracking-[-0.01em]">
            {finding.title}
          </p>
          {finding.file && (
            <p className="text-[11px] font-mono text-white/28 mt-0.5 truncate">
              {finding.file}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg
          className="flex-shrink-0 mt-0.5 transition-transform duration-200 text-white/20"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          width="7" height="12" viewBox="0 0 7 12" fill="none"
        >
          <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Separator */}
      {!open && !last && (
        <div className="h-[0.5px] bg-white/[0.07] ml-[42px]" />
      )}

      {/* Expanded content */}
      {open && (
        <div
          className="px-[42px] pb-4 pt-2 space-y-3"
          style={{ borderBottom: last ? "none" : "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-[13px] text-white/55 leading-relaxed tracking-[-0.01em]">
            {finding.description}
          </p>

          {finding.ruleReference && (
            <p className="text-[11px] font-mono text-white/28">
              {finding.ruleReference}
            </p>
          )}

          <div
            className="rounded-[10px] px-4 py-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[10px] text-white/25 uppercase tracking-[0.1em] font-medium mb-1.5">
              Remediation
            </p>
            <p className="text-[13px] text-white/65 leading-relaxed tracking-[-0.01em]">
              {finding.remediation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
