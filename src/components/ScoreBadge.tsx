import type { OverallScore } from "@/lib/types";

const SCORE_STYLE: Record<OverallScore, string> = {
  FAIL:        "text-[#FF453A]",
  CONDITIONAL: "text-[#FF9F0A]",
  PASS:        "text-[#32D74B]",
};

export function ScoreBadge({ score, size = "md" }: { score: OverallScore; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg"
    ? "text-4xl font-bold tracking-tight"
    : size === "sm"
    ? "text-xs font-semibold tracking-widest uppercase"
    : "text-sm font-semibold tracking-widest uppercase";

  return (
    <span className={`${sizeClass} ${SCORE_STYLE[score]}`}>
      {score}
    </span>
  );
}
