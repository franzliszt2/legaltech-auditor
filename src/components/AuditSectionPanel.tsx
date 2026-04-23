import { FindingRow } from "./FindingRow";
import type { SectionGroup } from "@/lib/sections";

interface Props {
  group: SectionGroup;
}

export function AuditSectionPanel({ group }: Props) {
  const { section, findings, topSeverity } = group;
  const summary = section.summaryTemplate(findings.length, topSeverity);

  if (findings.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/8 bg-white/2 px-6 py-10 text-center">
        <p className="text-sm text-white/25">{summary}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Section header */}
      <div className="px-1">
        <h2 className="text-lg font-semibold text-white mb-1">{section.label}</h2>
        <p className="text-sm text-white/45 leading-relaxed">{summary}</p>
      </div>

      {/* Finding rows */}
      <div className="space-y-2">
        {findings.map((f) => (
          <FindingRow key={f.id} finding={f} />
        ))}
      </div>
    </div>
  );
}
