"use client";

import type { AuditReport, Module } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { FindingCard } from "./FindingCard";

const MODULES: { id: Module; label: string; emoji: string }[] = [
  { id: "security",  label: "Security",     emoji: "🔒" },
  { id: "ethics",    label: "Legal Ethics", emoji: "⚖️" },
  { id: "ai-risk",   label: "AI Risk",      emoji: "🤖" },
];

export function ReportView({ report }: { report: AuditReport }) {
  const criticalCount = report.findings.filter((f) => f.severity === "critical").length;
  const highCount     = report.findings.filter((f) => f.severity === "high").length;
  const mediumCount   = report.findings.filter((f) => f.severity === "medium").length;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Report Header */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-white/40 mb-1 uppercase tracking-widest">
              Audit Report
            </p>
            <h2 className="text-xl font-semibold text-white mb-1 font-mono">
              {report.repo}
            </h2>
            <p className="text-xs text-white/30 font-mono">
              {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <ScoreBadge score={report.overallScore} />
        </div>

        <p className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/8 pt-4">
          {report.summary}
        </p>

        {/* Stats row */}
        <div className="mt-4 flex gap-4 flex-wrap">
          {[
            { label: "Critical", count: criticalCount, color: "text-red-400" },
            { label: "High",     count: highCount,     color: "text-orange-400" },
            { label: "Medium",   count: mediumCount,   color: "text-amber-400" },
            { label: "Total",    count: report.findings.length, color: "text-white/60" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex flex-col items-center px-4 py-2 rounded-lg bg-white/5 min-w-[64px]">
              <span className={`text-xl font-bold font-mono ${color}`}>{count}</span>
              <span className="text-xs text-white/40 mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Findings by module */}
      {MODULES.map(({ id, label, emoji }) => {
        const findings = report.findings.filter((f) => f.module === id);
        if (!findings.length) return null;
        return (
          <section key={id}>
            <div className="flex items-center gap-2 mb-3">
              <span>{emoji}</span>
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                {label}
              </h3>
              <span className="ml-auto text-xs text-white/30 font-mono">
                {findings.length} finding{findings.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-3">
              {findings.map((f) => (
                <FindingCard key={f.id} finding={f} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
