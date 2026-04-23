import type { Severity } from "@/lib/types";

const SEV: Record<Severity, { dot: string; label: string }> = {
  critical: { dot: "bg-[#FF453A]", label: "Critical" },
  high:     { dot: "bg-[#FF9F0A]", label: "High" },
  medium:   { dot: "bg-[#FFD60A]", label: "Medium" },
  low:      { dot: "bg-[#32D74B]", label: "Low" },
  info:     { dot: "bg-[#636366]", label: "Info" },
};

export function SeverityBadge({ severity }: { severity: Severity; size?: "xs" | "sm" }) {
  const { dot, label } = SEV[severity];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${dot}`} />
      <span className="text-xs text-white/50 tabular-nums">{label}</span>
    </span>
  );
}
