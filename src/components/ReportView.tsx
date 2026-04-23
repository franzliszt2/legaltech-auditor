"use client";

import { useState } from "react";
import type { AuditReport } from "@/lib/types";
import { groupBySection, defaultSection, type SectionId } from "@/lib/sections";
import { AuditHero } from "./AuditHero";
import { AuditSnapshotCard } from "./AuditSnapshotCard";
import { AuditSectionTabs } from "./AuditSectionTabs";
import { AuditSectionPanel } from "./AuditSectionPanel";

export function ReportView({ report }: { report: AuditReport }) {
  const groups = groupBySection(report.findings);
  const [activeId, setActiveId] = useState<SectionId>(() => defaultSection(groups));
  const activeGroup = groups.find((g) => g.section.id === activeId)!;

  return (
    <div className="space-y-8">
      <AuditHero score={report.overallScore} />
      <AuditSnapshotCard report={report} />
      <AuditSectionTabs groups={groups} active={activeId} onChange={setActiveId} />
      <AuditSectionPanel group={activeGroup} />
    </div>
  );
}
