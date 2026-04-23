import { StatChip } from "./StatChip";
import type { AuditReport } from "@/lib/types";

export function AuditSnapshotCard({ report }: { report: AuditReport }) {
  const critical = report.findings.filter((f) => f.severity === "critical").length;
  const high     = report.findings.filter((f) => f.severity === "high").length;
  const medium   = report.findings.filter((f) => f.severity === "medium").length;

  return (
    <div
      className="rounded-[20px] p-5 backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.055)",
        border: "0.5px solid rgba(255,255,255,0.10)",
      }}
    >
      {/* Repo + timestamp */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-mono text-white/45 truncate">{report.repo}</span>
        <span className="text-[11px] text-white/22 tabular-nums ml-4 flex-shrink-0">
          {new Date(report.timestamp).toLocaleDateString(undefined, {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          })}
        </span>
      </div>

      {/* Summary */}
      <p
        className="text-[14px] text-white/60 leading-relaxed tracking-[-0.01em] mb-5"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}
      >
        {report.summary}
      </p>

      {/* Stats */}
      <div className="flex gap-6">
        <StatChip count={critical} label="Critical" valueColor="text-[#FF453A]" />
        <StatChip count={high}     label="High"     valueColor="text-[#FF9F0A]" />
        <StatChip count={medium}   label="Medium"   valueColor="text-[#FFD60A]" />
        <StatChip count={report.findings.length} label="Total" valueColor="text-white/60" />
      </div>
    </div>
  );
}
