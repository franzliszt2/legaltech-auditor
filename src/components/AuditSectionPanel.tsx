import { FindingRow } from "./FindingRow";
import type { SectionGroup } from "@/lib/sections";

export function AuditSectionPanel({ group }: { group: SectionGroup }) {
  const { section, findings, topSeverity } = group;
  const summary = section.summaryTemplate(findings.length, topSeverity);

  if (findings.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-[14px]" style={{ color: "var(--t4)" }}>{summary}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="px-1 pb-1">
        <p
          className="text-[13px] leading-relaxed tracking-[-0.01em]"
          style={{ color: "var(--t3)" }}
        >
          {summary}
        </p>
      </div>

      <div
        className="rounded-[14px] overflow-hidden"
        style={{
          background: "var(--surface-1)",
          border: "0.5px solid var(--border)",
        }}
      >
        {findings.map((f, i) => (
          <FindingRow key={f.id} finding={f} last={i === findings.length - 1} />
        ))}
      </div>
    </div>
  );
}
