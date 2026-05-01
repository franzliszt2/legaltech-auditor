"use client";

import { useState, useEffect, useRef } from "react";
import type { ProgressStage } from "@/lib/types";

// Simulated process log lines per stage — represents observable scan activity,
// not actual model reasoning or chain-of-thought.
const STAGE_LINES: Partial<Record<ProgressStage, string[]>> = {
  fetch: [
    "git ls-tree HEAD --recursive",
    "→ traversing object tree",
    "→ filtering high-signal paths",
    "→ found package.json",
    "→ found .env.example",
    "→ found src/app/api/**",
    "→ found middleware.ts",
    "→ pruning build artifacts",
    "fetch complete · files queued",
  ],
  triage: [
    "classify src/app/api/**/*.ts → code",
    "classify prisma/schema.prisma → config",
    "classify .env.example → config",
    "classify src/prompts/system.md → prompt",
    "→ detected auth middleware boundary",
    "→ detected client-to-server data flow",
    "→ detected AI inference surface",
    "triage complete · routing to auditors",
  ],
  security: [
    "scan ./app/api/**/*.ts",
    "parse auth middleware boundary",
    "inspect package manifest for exposed scripts",
    "trace client-to-server data flow",
    "review env var handling",
    "flag potential secret exposure vector",
    "map deployment surface",
    "check rate limiting on inference endpoints",
    "review session token handling",
    "cross-reference OWASP Top 10 2025",
    "cross-reference OWASP LLM Top 10",
    "cross-reference MITRE ATLAS",
    "synthesize compliance risk notes",
  ],
  ethics: [
    "locate user-facing AI output components",
    "check for legal advice disclaimers",
    "check AI disclosure labels in UI",
    "review client data transmission paths",
    "scan for human-in-the-loop review gates",
    "check conflicts of interest workflow",
    "review data retention controls",
    "cross-reference ABA Model Rules",
    "cross-reference ABA Opinion 512 (2024)",
    "synthesize ethics risk notes",
  ],
  "ai-risk": [
    "scan prompt injection surfaces",
    "check system prompt exposure",
    "review model output validation",
    "check inference endpoint auth",
  ],
  assembly: [
    "deduplicating findings",
    "sorting by severity: critical → high → medium → low",
    "calculating overall verdict",
    "generating remediation guidance",
    "assembling audit report",
  ],
};

const STAGE_CONFIG: { id: ProgressStage; label: string }[] = [
  { id: "fetch",    label: "Scanning repository structure" },
  { id: "triage",   label: "Identifying high-risk files" },
  { id: "security", label: "Mapping API routes & auth flows" },
  { id: "ethics",   label: "Reviewing legal compliance" },
  { id: "ai-risk",  label: "Checking deployment configuration" },
  { id: "assembly", label: "Synthesizing audit findings" },
];

const ORDER: ProgressStage[] = [
  "fetch", "triage", "security", "ethics", "ai-risk", "assembly", "complete",
];

export function AuditLoadingPanel({
  currentStage,
}: {
  currentStage: ProgressStage;
  message: string;
}) {
  const [manuallyOpened, setManuallyOpened] = useState<Set<ProgressStage>>(new Set());
  const [activeClosedByUser, setActiveClosedByUser] = useState(false);
  const [stageLines, setStageLines] = useState<Partial<Record<ProgressStage, string[]>>>({});

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lineIndexRef = useRef<number>(0);
  const prevStageRef = useRef<ProgressStage | null>(null);

  useEffect(() => {
    if (prevStageRef.current === currentStage) return;
    prevStageRef.current = currentStage;

    setActiveClosedByUser(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
    lineIndexRef.current = 0;

    const pool = STAGE_LINES[currentStage] ?? [];
    if (pool.length === 0) return;

    intervalRef.current = setInterval(() => {
      const idx = lineIndexRef.current;
      if (idx >= pool.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setStageLines((prev) => ({
        ...prev,
        [currentStage]: [...(prev[currentStage] ?? []), pool[idx]],
      }));
      lineIndexRef.current++;
    }, 200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentStage]);

  const currentIdx = ORDER.indexOf(currentStage);

  function toggleStage(stageId: ProgressStage, isDone: boolean, isActive: boolean) {
    if (isActive) {
      setActiveClosedByUser((prev) => !prev);
      return;
    }
    if (!isDone) return;
    setManuallyOpened((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  }

  function isExpanded(stageId: ProgressStage, isDone: boolean, isActive: boolean): boolean {
    if (isActive) return !activeClosedByUser;
    if (isDone) return manuallyOpened.has(stageId);
    return false;
  }

  return (
    <div className="space-y-0">
      {STAGE_CONFIG.map((s) => {
        const stageIdx = ORDER.indexOf(s.id);
        const isDone   = currentIdx > stageIdx;
        const isActive = currentIdx === stageIdx;
        const isPending = currentIdx < stageIdx;
        const expanded = isExpanded(s.id, isDone, isActive);
        const lines    = stageLines[s.id] ?? [];
        const canToggle = (isDone || isActive) && lines.length > 0;

        return (
          <div key={s.id}>
            <button
              className="w-full flex items-center gap-3 px-1 py-[9px] text-left"
              onClick={() => canToggle && toggleStage(s.id, isDone, isActive)}
              disabled={isPending}
              style={{ cursor: canToggle ? "pointer" : "default" }}
            >
              {/* State indicator */}
              <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                {isDone ? (
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
                ) : isActive ? (
                  <svg
                    className="spin-progress"
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                  >
                    <circle cx="7" cy="7" r="5.5" stroke="var(--sep)" strokeWidth="1.25" />
                    <path
                      d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
                      stroke="var(--t2)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: "var(--sep)" }}
                  />
                )}
              </div>

              <span
                className="flex-1 text-[14px] tracking-[-0.01em] transition-all duration-200"
                style={{
                  color: isDone ? "var(--t4)" : isActive ? "var(--t1)" : "var(--t3)",
                  textDecoration: isDone ? "line-through" : "none",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {s.label}
              </span>

              {/* Expand chevron — only shown for stages with log output */}
              {canToggle && (
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{
                    color: "var(--t4)",
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {/* Simulated terminal log output — expand/collapse per stage */}
            {expanded && lines.length > 0 && (
              <div
                className="ml-[30px] mb-2 rounded-[8px] px-3 py-2.5"
                style={{
                  background: "var(--surface-1)",
                  border: "0.5px solid var(--border)",
                }}
              >
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className="terminal-line text-[11px] font-mono leading-relaxed"
                    style={{
                      color: line.startsWith("→") ? "var(--t3)" : "var(--t2)",
                    }}
                  >
                    {line}
                  </div>
                ))}
                {isActive && (
                  <span
                    className="text-[11px] font-mono"
                    style={{
                      color: "var(--t4)",
                      animation: "cursor-blink 1s step-end infinite",
                      display: "inline-block",
                    }}
                  >
                    ▋
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
