"use client";

import { useState } from "react";
import type { AuditReport } from "@/lib/types";
import { groupBySection, defaultSection, type SectionId } from "@/lib/sections";
import { VerdictBand } from "./VerdictBand";
import { StatRow } from "./StatRow";
import { AuditSectionTabs } from "./AuditSectionTabs";
import { AuditSectionPanel } from "./AuditSectionPanel";

export function ReportView({ report }: { report: AuditReport }) {
  const groups = groupBySection(report.findings);
  const [activeId, setActiveId] = useState<SectionId>(() => defaultSection(groups));
  const activeGroup = groups.find((g) => g.section.id === activeId)!;

  const timestamp = new Date(report.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
    </div>
  );
}
