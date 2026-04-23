import { cn } from "@/lib/cn";
import type { OverallScore } from "@/lib/types";

const SCORE_CONFIG: Record<OverallScore, { label: string; className: string }> = {
  PASS: {
    label: "PASS",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  CONDITIONAL: {
    label: "CONDITIONAL",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  FAIL: {
    label: "FAIL",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

export function ScoreBadge({ score }: { score: OverallScore }) {
  const { label, className } = SCORE_CONFIG[score];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-mono font-semibold tracking-widest uppercase",
        className
      )}
    >
      <span
        className={cn("w-2 h-2 rounded-full", {
          "bg-emerald-400": score === "PASS",
          "bg-amber-400": score === "CONDITIONAL",
          "bg-red-400": score === "FAIL",
        })}
      />
      {label}
    </span>
  );
}
