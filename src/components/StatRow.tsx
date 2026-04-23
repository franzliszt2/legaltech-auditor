import type { AuditReport } from "@/lib/types";

export function StatRow({ report }: { report: AuditReport }) {
  const critical = report.findings.filter((f) => f.severity === "critical").length;
  const high     = report.findings.filter((f) => f.severity === "high").length;
  const medium   = report.findings.filter((f) => f.severity === "medium").length;

  return (
    <div className="flex items-baseline gap-1 px-1">
      <span
        className="text-[15px] font-semibold tabular-nums mr-0.5"
        style={{ color: "var(--ios-red)" }}
      >
        {critical}
      </span>
      <span className="text-[13px]" style={{ color: "var(--t3)" }}>Critical</span>

      <span className="text-[13px] mx-2" style={{ color: "var(--t4)" }}>·</span>

      <span
        className="text-[15px] font-semibold tabular-nums mr-0.5"
        style={{ color: "var(--ios-orange)" }}
      >
        {high}
      </span>
      <span className="text-[13px]" style={{ color: "var(--t3)" }}>High</span>

      <span className="text-[13px] mx-2" style={{ color: "var(--t4)" }}>·</span>

      <span
        className="text-[15px] font-semibold tabular-nums mr-0.5"
        style={{ color: "var(--ios-yellow)" }}
      >
        {medium}
      </span>
      <span className="text-[13px]" style={{ color: "var(--t3)" }}>Medium</span>
    </div>
  );
}
