import { cn } from "@/lib/cn";
import type { ProgressStage } from "@/lib/types";

const STAGES: { id: ProgressStage; label: string }[] = [
  { id: "fetch",    label: "Fetching repository" },
  { id: "triage",   label: "Triaging files" },
  { id: "security", label: "Security audit" },
  { id: "ethics",   label: "Legal ethics audit" },
  { id: "ai-risk",  label: "AI risk audit" },
  { id: "assembly", label: "Assembling report" },
];

const ORDER: ProgressStage[] = [
  "fetch", "triage", "security", "ethics", "ai-risk", "assembly", "complete",
];

export function ProgressPanel({ currentStage }: { currentStage: ProgressStage; message: string }) {
  const current = ORDER.indexOf(currentStage);

  return (
    <div className="space-y-1">
      {STAGES.map((s, i) => {
        const idx = ORDER.indexOf(s.id);
        const done   = current > idx;
        const active = current === idx;

        return (
          <div
            key={s.id}
            className={cn(
              "flex items-center gap-3 px-1 py-2 transition-all duration-200",
            )}
          >
            {/* State indicator */}
            <div className="w-[18px] flex items-center justify-center flex-shrink-0">
              {done ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" fill="#32D74B" fillOpacity="0.15" stroke="#32D74B" strokeWidth="0.75"/>
                  <path d="M4.5 7L6.5 9L9.5 5.5" stroke="#32D74B" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : active ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/12" />
              )}
            </div>

            <span className={cn(
              "text-[14px] tracking-[-0.01em] transition-all duration-200",
              done   ? "text-white/28 line-through decoration-white/15" :
              active ? "text-white/90 font-medium" :
                       "text-white/22"
            )}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
