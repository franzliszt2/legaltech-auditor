"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SeverityBadge } from "./SeverityBadge";
import type { Finding } from "@/lib/types";

export function FindingRow({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-150",
      open ? "border-white/15 bg-white/4" : "border-white/8 bg-white/2 hover:border-white/12"
    )}>
      {/* Collapsed row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left"
      >
        <div className="flex-shrink-0 pt-0.5">
          <SeverityBadge severity={finding.severity} size="xs" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white leading-snug">{finding.title}</p>
          {finding.file && (
            <p className="text-xs font-mono text-white/30 mt-0.5 truncate">{finding.file}</p>
          )}
        </div>
        <span className={cn(
          "flex-shrink-0 text-xs font-mono text-white/30 mt-0.5 transition-transform duration-150",
          open ? "rotate-180" : ""
        )}>
          ▾
        </span>
      </button>

      {/* Expanded drawer */}
      {open && (
        <div className="px-5 pb-5 border-t border-white/8 pt-4 space-y-4">
          <p className="text-sm text-white/70 leading-relaxed">{finding.description}</p>

          {finding.ruleReference && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-white/30 font-mono uppercase tracking-wider pt-0.5 flex-shrink-0">Ref</span>
              <span className="text-xs font-mono text-white/50">{finding.ruleReference}</span>
            </div>
          )}

          <div className="rounded-lg bg-white/4 border border-white/8 px-4 py-3">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">Remediation</p>
            <p className="text-sm text-white/75 leading-relaxed">{finding.remediation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
