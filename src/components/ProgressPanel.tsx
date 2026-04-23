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

const STAGE_ORDER: ProgressStage[] = [
  "fetch", "triage", "security", "ethics", "ai-risk", "assembly", "complete",
];

function stageIndex(stage: ProgressStage) {
  return STAGE_ORDER.indexOf(stage);
}

interface Props {
  currentStage: ProgressStage;
  message: string;
}

export function ProgressPanel({ currentStage, message }: Props) {
  const currentIndex = stageIndex(currentStage);
  const isError = currentStage === "error";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex h-3 w-3">
            {!isError && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            )}
            <span
              className={cn(
                "relative inline-flex rounded-full h-3 w-3",
                isError ? "bg-red-500" : "bg-violet-500"
              )}
            />
          </div>
          <p className="text-sm text-white/70 font-mono">{message}</p>
        </div>

        <div className="space-y-3">
          {STAGES.map((s) => {
            const idx = stageIndex(s.id);
            const done = currentIndex > idx;
            const active = currentIndex === idx;

            return (
              <div key={s.id} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all",
                    done
                      ? "bg-emerald-500 border-emerald-500"
                      : active
                      ? "border-violet-500 bg-violet-500/20"
                      : "border-white/15 bg-transparent"
                  )}
                >
                  {done && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    done ? "text-white/50" : active ? "text-white font-medium" : "text-white/25"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
