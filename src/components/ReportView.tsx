"use client";

import { useState } from "react";
import type { AuditReport } from "@/lib/types";
import { groupBySection, defaultSection, type SectionId } from "@/lib/sections";
import { VerdictBand } from "./VerdictBand";
import { StatRow } from "./StatRow";
import { AuditSectionTabs } from "./AuditSectionTabs";
import { AuditSectionPanel } from "./AuditSectionPanel";

interface Props {
  report: AuditReport;
  showShareButton?: boolean;
}

export function ReportView({ report, showShareButton = false }: Props) {
  const groups = groupBySection(report.findings);
  const [activeId, setActiveId] = useState<SectionId>(() => defaultSection(groups));
  const [copied, setCopied] = useState(false);
  const activeGroup = groups.find((g) => g.section.id === activeId)!;

  const timestamp = new Date(report.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function copyReportUrl() {
    try {
      // Encode report as UTF-8-safe base64 for a portable, stable shareable URL.
      // The full report JSON is stored in the URL hash (client-side only — never sent to the server).
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(report))));
      const url = `${window.location.origin}/report#${encoded}`;

      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // Fallback for environments without clipboard API permission
        const el = document.createElement("textarea");
        el.value = url;
        el.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        try { document.execCommand("copy"); } catch { /* ignore */ }
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch { /* ignore encoding errors on malformed report data */ }
  }

  return (
    <div className="space-y-5">
      <VerdictBand score={report.overallScore} />

      <StatRow report={report} />

      {/* Repo + timestamp */}
      <div className="flex items-center justify-between px-1">
        <span
          className="text-[12px] font-mono truncate"
          style={{ color: "var(--t3)" }}
        >
          {report.repo}
        </span>
        <span
          className="text-[11px] tabular-nums ml-4 flex-shrink-0"
          style={{ color: "var(--t4)" }}
        >
          {timestamp}
        </span>
      </div>

      {/* Summary */}
      {report.summary && (
        <p
          className="px-1 text-[14px] leading-relaxed tracking-[-0.01em]"
          style={{ color: "var(--t2)" }}
        >
          {report.summary}
        </p>
      )}

      <AuditSectionTabs groups={groups} active={activeId} onChange={setActiveId} />
      <AuditSectionPanel group={activeGroup} />

      {/* Save / share report URL */}
      {showShareButton && (
        <div
          className="px-1 pt-4 flex items-center gap-3"
          style={{ borderTop: "0.5px solid var(--sep)" }}
        >
          <span className="text-[12px]" style={{ color: "var(--t3)" }}>
            Save this report URL:
          </span>
          <button
            onClick={copyReportUrl}
            className="text-[12px] px-3 py-1.5 rounded-[8px] transition-colors"
            style={{
              background: "var(--surface-1)",
              border: "0.5px solid var(--border)",
              color: copied ? "var(--ios-green)" : "var(--t2)",
              cursor: "pointer",
            }}
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
