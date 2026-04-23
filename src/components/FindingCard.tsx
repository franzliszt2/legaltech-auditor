import { cn } from "@/lib/cn";
import type { Finding, Severity, Module } from "@/lib/types";

const SEVERITY_CONFIG: Record<Severity, { label: string; bar: string; text: string }> = {
  critical: { label: "CRITICAL", bar: "bg-red-500",    text: "text-red-400" },
  high:     { label: "HIGH",     bar: "bg-orange-500", text: "text-orange-400" },
  medium:   { label: "MEDIUM",   bar: "bg-amber-500",  text: "text-amber-400" },
  low:      { label: "LOW",      bar: "bg-blue-500",   text: "text-blue-400" },
  info:     { label: "INFO",     bar: "bg-zinc-500",   text: "text-zinc-400" },
};

const MODULE_CONFIG: Record<Module, { label: string; color: string }> = {
  security:  { label: "Security",    color: "text-violet-400" },
  ethics:    { label: "Legal Ethics", color: "text-sky-400" },
  "ai-risk": { label: "AI Risk",     color: "text-rose-400" },
};

export function FindingCard({ finding }: { finding: Finding }) {
  const sev = SEVERITY_CONFIG[finding.severity];
  const mod = MODULE_CONFIG[finding.module];

  return (
    <div className="relative flex gap-4 rounded-xl border border-white/8 bg-white/3 p-5 overflow-hidden hover:border-white/15 transition-colors">
      {/* Severity bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl", sev.bar)} />

      <div className="flex-1 min-w-0 pl-1">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={cn("font-mono text-xs font-semibold tracking-wider uppercase", sev.text)}>
            {sev.label}
          </span>
          <span className="text-white/20">·</span>
          <span className={cn("text-xs font-medium", mod.color)}>{mod.label}</span>
          {finding.ruleReference && (
            <>
              <span className="text-white/20">·</span>
              <span className="font-mono text-xs text-white/40">{finding.ruleReference}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold mb-1.5 leading-snug">{finding.title}</h3>

        {/* File path */}
        {finding.file && (
          <p className="font-mono text-xs text-white/40 mb-3 truncate">{finding.file}</p>
        )}

        {/* Description */}
        <p className="text-white/70 text-sm leading-relaxed mb-4">{finding.description}</p>

        {/* Remediation */}
        <div className="rounded-lg bg-white/4 border border-white/8 px-4 py-3">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
            Remediation
          </p>
          <p className="text-sm text-white/80 leading-relaxed">{finding.remediation}</p>
        </div>
      </div>
    </div>
  );
}
