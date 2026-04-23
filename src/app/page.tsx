"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ReportView } from "@/components/ReportView";
import type { AuditReport, ProgressEvent, ProgressStage } from "@/lib/types";

type AppState = "idle" | "running" | "done" | "error";

// ── Sample report for instant demo ────────────────────────────────────
const SAMPLE_REPO = "github.com/meridian-legal/ai-platform";

const SAMPLE_REPORT: AuditReport = {
  repo: SAMPLE_REPO,
  timestamp: "2026-04-23T09:14:00.000Z",
  overallScore: "FAIL",
  summary:
    "This application presents serious security and legal ethics risks that must be addressed before deployment in a legal practice context.",
  findings: [
    {
      id: "sec-001",
      module: "security",
      severity: "critical",
      title: "API key hardcoded in source",
      description:
        "An OpenAI API key is committed directly to src/lib/ai.ts. Any party with repository access can extract and abuse this credential to exfiltrate data or run unauthorized queries.",
      file: "src/lib/ai.ts",
      ruleReference: "OWASP A07:2025 — Identification and Authentication Failures",
      remediation:
        "Rotate the exposed key immediately. Move all credentials to environment variables and add a secret scanner (e.g. Gitleaks) to the CI pipeline.",
    },
    {
      id: "sec-002",
      module: "security",
      severity: "high",
      title: "Unauthenticated document retrieval endpoint",
      description:
        "GET /api/documents/[id] returns client files by ID with no identity verification. Any unauthenticated actor can enumerate and access privileged matter documents.",
      file: "src/app/api/documents/[id]/route.ts",
      ruleReference: "OWASP A01:2025 — Broken Access Control",
      remediation:
        "Add session-based authentication middleware and verify that the requesting user is authorized to access the specific document ID before returning data.",
    },
    {
      id: "sec-003",
      module: "security",
      severity: "high",
      title: "No rate limiting on AI inference endpoint",
      description:
        "The /api/chat endpoint accepts unlimited concurrent requests. This exposes the application to prompt injection at scale and unbounded cost amplification against the operator's API key.",
      file: "src/app/api/chat/route.ts",
      ruleReference: "OWASP LLM04:2025 — Model Denial of Service",
      remediation:
        "Implement per-user rate limiting (20 req/min). Add request body size limits and anomalous usage alerting.",
    },
    {
      id: "sec-004",
      module: "security",
      severity: "medium",
      title: "System prompt returned in API response",
      description:
        "The full system prompt — including internal role definitions and instructions — is included in the API response body, leaking proprietary prompt engineering and surfacing adversarial attack vectors.",
      file: "src/app/api/chat/route.ts",
      ruleReference: "OWASP LLM07:2025 — System Prompt Leakage",
      remediation:
        "Strip system prompt content from all client-facing API responses. Return only the assistant message content.",
    },
    {
      id: "priv-001",
      module: "security",
      severity: "high",
      title: "Attorney-client conversations stored in plaintext",
      description:
        "Conversation histories are persisted to the database without encryption. A storage-layer compromise would expose privileged communications across all matters.",
      file: "src/lib/db.ts",
      ruleReference: "ABA Model Rule 1.6 — Confidentiality of Information",
      remediation:
        "Enable column-level encryption for conversation and document tables. Consider application-layer encryption for the most sensitive fields.",
    },
    {
      id: "priv-002",
      module: "security",
      severity: "medium",
      title: "Client PII written to application logs",
      description:
        "Client names, email addresses, and matter descriptions are written to stdout during upload and chat processing. These logs are accessible to infrastructure operators and may be retained indefinitely.",
      file: "src/app/api/upload/route.ts",
      ruleReference: "ABA Model Rule 1.6 — Confidentiality of Information",
      remediation:
        "Remove PII from all log statements. Replace identifiers with pseudonymized tokens for debugging purposes.",
    },
    {
      id: "priv-003",
      module: "security",
      severity: "medium",
      title: "No data retention or deletion mechanism",
      description:
        "Matter data accumulates indefinitely with no retention policy and no client-facing deletion workflow. There is no mechanism for attorneys or clients to exercise data subject rights.",
      file: "src/lib/db.ts",
      ruleReference: "ABA Model Rule 1.6(c) — Reasonable Data Security",
      remediation:
        "Document a retention policy and implement a deletion workflow. Provide attorneys with the ability to purge matter data on case close or client request.",
    },
    {
      id: "eth-001",
      module: "ethics",
      severity: "high",
      title: "No legal advice disclaimer on AI outputs",
      description:
        "AI-generated contract analysis and legal summaries are presented to end users without any disclaimer that the content is not legal advice and has not been reviewed by a licensed attorney.",
      file: "src/components/ChatInterface.tsx",
      ruleReference: "ABA Formal Opinion 512 (2024); ABA Model Rule 1.1 — Competence",
      remediation:
        "Add a persistent disclaimer to all AI-generated outputs: 'This analysis is AI-generated and does not constitute legal advice. Attorney review is required before reliance.'",
    },
    {
      id: "eth-002",
      module: "ethics",
      severity: "medium",
      title: "AI outputs not labeled as AI-generated",
      description:
        "Contract summaries and legal analysis are surfaced in the UI without indicating they are AI-generated. End users may mistake them for attorney-reviewed work product.",
      file: "src/components/ResultsView.tsx",
      ruleReference: "ABA Model Rule 1.4 — Communication; ABA Formal Opinion 512 §III.B",
      remediation:
        "Label all AI-generated content in the UI with the model name and generation timestamp. Distinguish AI output visually from attorney-authored content.",
    },
    {
      id: "eth-003",
      module: "ethics",
      severity: "medium",
      title: "No attorney review gate before client delivery",
      description:
        "AI-generated documents flow directly to the client-facing interface without a mandatory attorney review step. No workflow or UI gate enforces human-in-the-loop supervision before delivery.",
      file: "src/app/api/documents/generate/route.ts",
      ruleReference: "ABA Model Rule 5.3 — Responsibilities Regarding Nonlawyer Assistance",
      remediation:
        "Implement a review queue requiring attorney approval before any AI-generated content is delivered to a client. Log all approvals with timestamp and reviewer identity.",
    },
    {
      id: "legal-001",
      module: "ethics",
      severity: "high",
      title: "No conflicts of interest check on matter creation",
      description:
        "New matters can be opened and AI analysis can begin without any check against existing clients or adverse parties. Cross-matter conflicts go undetected by the system.",
      file: "src/app/api/matters/route.ts",
      ruleReference: "ABA Model Rule 1.7 — Conflict of Interest; ABA Model Rule 1.9",
      remediation:
        "Implement a mandatory conflicts clearance step before activating any new matter. Require attorney sign-off and maintain an auditable conflicts log.",
    },
    {
      id: "legal-002",
      module: "ethics",
      severity: "medium",
      title: "AI rendering jurisdiction-specific legal conclusions",
      description:
        "The system prompt instructs the model to provide jurisdiction-specific legal analysis and recommend courses of action without attorney oversight. This creates unauthorized practice of law exposure depending on deployment context.",
      file: "src/app/api/chat/route.ts",
      ruleReference: "ABA Model Rule 5.5 — Unauthorized Practice of Law",
      remediation:
        "Constrain AI outputs to factual summarization and issue-spotting. Add a system prompt prohibition on legal conclusions. Require attorney review for any actionable recommendation.",
    },
  ],
};

export default function Home() {
  const [repoUrl, setRepoUrl]         = useState("");
  const [appState, setAppState]       = useState<AppState>("idle");
  const [currentStage, setStage]      = useState<ProgressStage>("fetch");
  const [progressMsg, setProgressMsg] = useState("");
  const [report, setReport]           = useState<AuditReport | null>(null);
  const [errorMsg, setErrorMsg]       = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function runAudit() {
    if (!repoUrl.trim()) return;
    setAppState("running");
    setReport(null);
    setErrorMsg("");
    setStage("fetch");
    setProgressMsg("");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/audit/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error(`Server error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          const event: ProgressEvent = JSON.parse(part.replace(/^data:\s*/, ""));
          setStage(event.stage);
          setProgressMsg(event.message);
          if (event.stage === "complete" && event.report) {
            setReport(event.report);
            setAppState("done");
          } else if (event.stage === "error") {
            setErrorMsg(event.error ?? "Unknown error");
            setAppState("error");
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setAppState("error");
      }
    }
  }

  function reset() {
    abortRef.current?.abort();
    setAppState("idle");
    setReport(null);
    setErrorMsg("");
    setRepoUrl("");
  }

  const shellContext =
    appState === "running" || appState === "done" ? repoUrl.trim() : undefined;

  return (
    <AppShell context={shellContext}>
      <div
        className="flex flex-col items-center justify-center px-5 py-16"
        style={{ minHeight: "calc(100vh - 52px)" }}
      >

        {/* ── IDLE ── */}
        {appState === "idle" && (
          <div className="w-full max-w-[520px] space-y-10">

            {/* Wordmark hero */}
            <div className="text-center space-y-5">
              <h1
                className="leading-none"
                style={{
                  fontFamily: '"Rhymes Display", Georgia, serif',
                  fontStyle: "normal",
                  fontWeight: 300,
                  fontSize: "clamp(74px, 15vw, 110px)",
                  letterSpacing: "0.01em",
                  color: "var(--t1)",
                }}
              >
                Specter
              </h1>

              {/* Thin rule */}
              <div
                className="w-10 mx-auto"
                style={{ height: "0.5px", background: "var(--border-strong)" }}
              />

              <p
                className="text-[15px] leading-relaxed tracking-[-0.01em]"
                style={{ color: "var(--t3)" }}
              >
                Proprietary legal auditing engine. Trusted security,
                <br className="hidden sm:block" /> ethics, and AI risk analysis against OWASP, MITRE ATLAS, and ABA standards.
              </p>
            </div>

            {/* Input */}
            <div className="space-y-3">
              <div
                className="flex items-center rounded-[14px] overflow-hidden"
                style={{
                  background: "var(--surface-1)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runAudit()}
                  placeholder="github.com/owner/repo"
                  className="flex-1 bg-transparent px-4 py-3.5 text-[14px] font-mono focus:outline-none tracking-[-0.01em]"
                  style={{ color: "var(--t1)" }}
                />
                <button
                  onClick={runAudit}
                  disabled={!repoUrl.trim()}
                  className="px-5 py-3.5 text-[14px] font-semibold transition-opacity mr-1 rounded-[10px] tracking-[-0.01em] disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ background: "var(--t1)", color: "var(--bg)" }}
                >
                  Audit
                </button>
              </div>

              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => {
                    setRepoUrl(SAMPLE_REPO);
                    setReport(SAMPLE_REPORT);
                    setAppState("done");
                  }}
                  className="text-[12px] transition-colors"
                  style={{ color: "var(--t4)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t4)")}
                >
                  View sample report
                </button>
                <span style={{ color: "var(--t4)", fontSize: "11px" }}>·</span>
                <Link
                  href="/demo"
                  className="text-[12px] transition-colors"
                  style={{ color: "var(--t4)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t4)")}
                >
                  About Specter
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── RUNNING ── */}
        {appState === "running" && (
          <div className="w-full max-w-[300px] space-y-10">
            <p
              className="text-[11px] tracking-[0.18em] uppercase text-center"
              style={{ color: "var(--t4)" }}
            >
              Analyzing
            </p>
            <ProgressPanel currentStage={currentStage} message={progressMsg} />
            <div className="text-center">
              <button
                onClick={reset}
                className="text-[12px] transition-colors"
                style={{ color: "var(--t4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t3)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t4)")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {appState === "error" && (
          <div className="w-full max-w-[520px] text-center space-y-4">
            <p
              className="text-[15px] font-medium tracking-[-0.01em]"
              style={{ color: "var(--ios-red)" }}
            >
              Audit failed
            </p>
            <p
              className="text-[13px] font-mono leading-relaxed"
              style={{ color: "var(--t3)" }}
            >
              {errorMsg}
            </p>
            <button
              onClick={reset}
              className="text-[13px] transition-colors"
              style={{ color: "var(--t3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t2)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t3)")}
            >
              Try again
            </button>
          </div>
        )}

        {/* ── DONE ── */}
        {appState === "done" && report && (
          <div className="w-full max-w-[580px] space-y-2">
            <ReportView report={report} />
            <div className="text-center pt-8 pb-2">
              <button
                onClick={reset}
                className="text-[12px] transition-colors"
                style={{ color: "var(--t4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t3)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t4)")}
              >
                New audit
              </button>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
