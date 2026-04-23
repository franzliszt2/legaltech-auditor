import { VERDICT_HEADLINE, VERDICT_SUBHEAD } from "@/lib/sections";
import { ScoreBadge } from "./ScoreBadge";
import type { OverallScore } from "@/lib/types";

export function AuditHero({ score }: { score: OverallScore }) {
  return (
    <div className="text-center">
      <p className="text-[11px] text-white/25 tracking-[0.15em] uppercase mb-5">
        Audit complete
      </p>
      <h1
        className="font-bold leading-[1.08] tracking-[-0.04em] mb-3"
        style={{ fontSize: "clamp(36px, 6vw, 52px)" }}
      >
        {VERDICT_HEADLINE[score]}
      </h1>
      <p className="text-[15px] text-white/45 leading-relaxed tracking-[-0.01em] mb-6 max-w-lg mx-auto">
        {VERDICT_SUBHEAD[score]}
      </p>
      <ScoreBadge score={score} size="sm" />
    </div>
  );
}
