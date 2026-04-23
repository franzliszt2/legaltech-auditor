import { ScoreBadge } from "./ScoreBadge";
import { StatChip } from "./StatChip";
import type { AuditReport } from "@/lib/types";

interface Props {
  report: AuditReport;
}

export function AuditSnapshotCard({ report }: Props) {
  const critical = report.findings.filter((f) => f.severity === "critical").length;
  const high     = report.findings.filter((f) => f.severity === "high").length;
  const medium   = report.findings.filter((f) => f.severity === "medium").length;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs text-white/30 font-mono mb-1 uppercase tracking-widest">Repository</p>
          <p className="font-mono text-sm text-white/80">{report.repo}</p>
          <p className="text-[11px] text-white/25 font-mono mt-1">
            {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
        <ScoreBadge score={report.overallScore} />
      </div>

      <p className="text-sm text-white/60 leading-relaxed border-t border-white/8 pt-5 mb-5">
        {report.summary}
      </p>

      <div className="flex gap-3 flex-wrap">
        <StatChip count={critical} label="Critical" color="text-red-400" />
        <StatChip count={high}     label="High"     color="text-orange-400" />
        <StatChip count={medium}   label="Medium"   color="text-amber-400" />
        <StatChip count={report.findings.length} label="Total" color="text-white/50" />
      </div>
    </div>
  );
}
