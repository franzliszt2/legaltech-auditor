import type { OverallScore } from "@/lib/types";
import { VERDICT_HEADLINE, VERDICT_SUBHEAD } from "@/lib/sections";

const COLOR: Record<OverallScore, string> = {
  FAIL:        "var(--ios-red)",
  CONDITIONAL: "var(--ios-orange)",
  PASS:        "var(--ios-green)",
};

const BG: Record<OverallScore, string> = {
  FAIL:        "rgba(255, 69, 58, 0.08)",
  CONDITIONAL: "rgba(255, 159, 10, 0.08)",
  PASS:        "rgba(50, 215, 75, 0.08)",
};

export function VerdictBand({ score }: { score: OverallScore }) {
  const color = COLOR[score];
  const bg = BG[score];

  return (
    <div
      className="rounded-[16px] p-5"
      style={{
        background: bg,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <p
        className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-2.5"
        style={{ color }}
      >
        {score}
      </p>
      <h2
        className="text-[21px] font-semibold leading-snug tracking-[-0.02em] mb-1.5"
        style={{ color: "var(--t1)" }}
      >
        {VERDICT_HEADLINE[score]}
      </h2>
      <p
        className="text-[14px] leading-relaxed tracking-[-0.01em]"
        style={{ color: "var(--t2)" }}
      >
        {VERDICT_SUBHEAD[score]}
      </p>
    </div>
  );
}
