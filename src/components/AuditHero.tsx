import { ScoreBadge } from "./ScoreBadge";
import { VERDICT_HEADLINE, VERDICT_SUBHEAD } from "@/lib/sections";
import type { OverallScore } from "@/lib/types";

interface Props {
  score: OverallScore;
}

export function AuditHero({ score }: Props) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-white/40 text-xs font-mono mb-8 tracking-widest uppercase">
        Legal Tech Security Auditor
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white leading-tight">
        {VERDICT_HEADLINE[score]}
      </h1>
      <p className="text-white/45 text-base sm:text-lg leading-relaxed mb-6">
        {VERDICT_SUBHEAD[score]}
      </p>
      <ScoreBadge score={score} />
    </div>
  );
}
