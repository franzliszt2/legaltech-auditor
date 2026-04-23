import { FindingRow } from "./FindingRow";
import type { SectionGroup } from "@/lib/sections";

export function AuditSectionPanel({ group }: { group: SectionGroup }) {
  const { section, findings, topSeverity } = group;
  const summary = section.summaryTemplate(findings.length, topSeverity);

  if (findings.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-[14px] text-white/22">{summary}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section intro */}
      <div className="px-1 pb-1">
        <p className="text-[13px] text-white/38 leading-relaxed tracking-[-0.01em]">
          {summary}
        </p>
      </div>

      {/* Findings list — iOS grouped list style */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "0.5px solid rgba(255,255,255,0.09)",
        }}
      >
        {findings.map((f, i) => (
          <FindingRow key={f.id} finding={f} last={i === findings.length - 1} />
        ))}
      </div>
    </div>
  );
}
