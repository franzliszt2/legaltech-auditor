import { cn } from "@/lib/cn";
import type { Severity } from "@/lib/types";

const CONFIG: Record<Severity, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-red-500/15 text-red-400 border-red-500/25" },
  high:     { label: "High",     className: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
  medium:   { label: "Medium",   className: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  low:      { label: "Low",      className: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  info:     { label: "Info",     className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25" },
};

export function SeverityBadge({ severity, size = "sm" }: { severity: Severity; size?: "xs" | "sm" }) {
  const { label, className } = CONFIG[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono font-semibold tracking-wide uppercase",
        size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      {label}
    </span>
  );
}
