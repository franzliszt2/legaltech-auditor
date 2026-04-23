"use client";

import { useState, useRef } from "react";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ReportView } from "@/components/ReportView";
import type { AuditReport, ProgressEvent, ProgressStage } from "@/lib/types";

type AppState = "idle" | "running" | "done" | "error";

const DEMO_REPOS = [
  "https://github.com/franzliszt2/vulnerable-legaltech-demo",
];

export default function Home() {
  const [repoUrl, setRepoUrl]               = useState("");
  const [appState, setAppState]             = useState<AppState>("idle");
  const [currentStage, setCurrentStage]     = useState<ProgressStage>("fetch");
  const [progressMessage, setProgressMessage] = useState("");
  const [report, setReport]                 = useState<AuditReport | null>(null);
  const [errorMsg, setErrorMsg]             = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function runAudit() {
    if (!repoUrl.trim()) return;
    setAppState("running");
    setReport(null);
    setErrorMsg("");
    setCurrentStage("fetch");
    setProgressMessage("Starting audit…");

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
          const json = part.replace(/^data:\s*/, "");
          const event: ProgressEvent = JSON.parse(json);
          setCurrentStage(event.stage);
          setProgressMessage(event.message);
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
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-900/15 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Legal Tech Security Auditor
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
            Is your legal app<br />safe to ship?
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Paste a GitHub repo URL. We audit it for security vulnerabilities,
            ABA ethics compliance, and AI-specific legal risks — grounded in
            OWASP, MITRE ATLAS, and ABA Formal Opinion 512.
          </p>
        </div>

        {/* ── IDLE ── */}
        {appState === "idle" && (
          <div className="w-full max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur">
              <label className="block text-xs text-white/40 font-mono uppercase tracking-widest mb-3">
                GitHub Repository URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runAudit()}
                  placeholder="https://github.com/example/legal-ai-app"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 font-mono focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
                />
                <button
                  onClick={runAudit}
                  disabled={!repoUrl.trim()}
                  className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  Run Audit
                </button>
              </div>
              <div className="mt-4">
                <p className="text-xs text-white/30 mb-2">Try a demo repo:</p>
                <div className="flex flex-wrap gap-2">
                  {DEMO_REPOS.map((url) => (
                    <button
                      key={url}
                      onClick={() => setRepoUrl(url)}
                      className="text-xs font-mono text-violet-400/70 hover:text-violet-400 underline underline-offset-2 transition-colors"
                    >
                      {url.replace("https://github.com/", "")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { emoji: "🔒", label: "Security",    desc: "OWASP Top 10 + LLM risks" },
                { emoji: "⚖️", label: "Legal Ethics", desc: "ABA Rules + Opinion 512" },
                { emoji: "🤖", label: "AI Risk",      desc: "MITRE ATLAS + prompt injection" },
              ].map(({ emoji, label, desc }) => (
                <div key={label} className="rounded-xl border border-white/8 bg-white/2 px-4 py-4">
                  <div className="text-xl mb-1">{emoji}</div>
                  <div className="text-xs font-semibold text-white/80 mb-0.5">{label}</div>
                  <div className="text-xs text-white/35">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RUNNING ── */}
        {appState === "running" && (
          <div className="w-full max-w-2xl space-y-4">
            <ProgressPanel currentStage={currentStage} message={progressMessage} />
            <div className="text-center">
              <button onClick={reset} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {appState === "error" && (
          <div className="w-full max-w-2xl">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
              <p className="text-red-400 font-semibold mb-2">Audit failed</p>
              <p className="text-sm text-white/50 font-mono mb-4">{errorMsg}</p>
              <button onClick={reset} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors">
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {appState === "done" && report && (
          <div className="w-full max-w-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest">Audit Results</h2>
              <button onClick={reset} className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono">
                ← New audit
              </button>
            </div>
            <ReportView report={report} />
          </div>
        )}
      </div>
    </div>
  );
}
