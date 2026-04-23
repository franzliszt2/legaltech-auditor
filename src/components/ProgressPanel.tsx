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
    <div className="space-y-0.5">
      {STAGES.map((s) => {
        const idx    = ORDER.indexOf(s.id);
        const done   = current > idx;
        const active = current === idx;

        return (
          <div key={s.id} className="flex items-center gap-3 px-1 py-[9px]">
            {/* State indicator */}
            <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
              {done ? (
                /* Completed checkmark */
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle
                    cx="7" cy="7" r="6.5"
                    fill="rgba(52,199,89,0.12)"
                    stroke="var(--ios-green)"
                    strokeWidth="0.75"
                  />
                  <path
                    d="M4.5 7L6.5 9L9.5 5.5"
                    stroke="var(--ios-green)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : active ? (
                /* Animated spinner for active step */
                <svg
                  className="spin-progress"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                >
                  {/* Track */}
                  <circle
                    cx="7" cy="7" r="5.5"
                    stroke="var(--sep)"
                    strokeWidth="1.25"
                  />
                  {/* Arc */}
                  <path
                    d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
                    stroke="var(--t2)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Pending dot */
                <div
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: "var(--sep)" }}
                />
              )}
            </div>

            <span
              className="text-[14px] tracking-[-0.01em] transition-all duration-200"
              style={{
                color: done
                  ? "var(--t4)"
                  : active
                  ? "var(--t1)"
                  : "var(--t3)",
                textDecoration: done ? "line-through" : "none",
                fontWeight: active ? 500 : 400,
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
