"use client";

import { useState, useRef } from "react";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ReportView } from "@/components/ReportView";
import type { AuditReport, ProgressEvent, ProgressStage } from "@/lib/types";

type AppState = "idle" | "running" | "done" | "error";

const DEMO = "https://github.com/franzliszt2/vulnerable-legaltech-demo";

export default function Home() {
  const [repoUrl, setRepoUrl]           = useState("");
  const [appState, setAppState]         = useState<AppState>("idle");
  const [currentStage, setStage]        = useState<ProgressStage>("fetch");
  const [progressMsg, setProgressMsg]   = useState("");
  const [report, setReport]             = useState<AuditReport | null>(null);
  const [errorMsg, setErrorMsg]         = useState("");
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-5 py-16">

        {/* ── IDLE ── */}
        {appState === "idle" && (
          <div className="w-full max-w-[520px] space-y-12">
            {/* Wordmark */}
            <div className="text-center">
              <p className="text-[11px] text-white/22 tracking-[0.18em] uppercase">
                LegalTech Auditor
              </p>
            </div>

            {/* Hero */}
            <div className="text-center space-y-3">
              <h1
                className="font-bold leading-[1.06] tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(38px, 8vw, 54px)" }}
              >
                Audit any<br />legal app.
              </h1>
              <p className="text-[15px] text-white/40 leading-relaxed tracking-[-0.01em]">
                Security, ethics, and AI risk — grounded in OWASP,<br className="hidden sm:block" /> MITRE ATLAS, and ABA Formal Opinion 512.
              </p>
            </div>

            {/* Input */}
            <div className="space-y-3">
              <div
                className="flex items-center rounded-[14px] overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.10)",
                }}
              >
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runAudit()}
                  placeholder="github.com/owner/repo"
                  className="flex-1 bg-transparent px-4 py-3.5 text-[14px] text-white placeholder-white/20 font-mono focus:outline-none tracking-[-0.01em]"
                />
                <button
                  onClick={runAudit}
                  disabled={!repoUrl.trim()}
                  className="px-5 py-3.5 text-[14px] font-semibold text-black bg-white hover:bg-white/90 disabled:opacity-25 disabled:cursor-not-allowed transition-opacity mr-1 rounded-[10px] tracking-[-0.01em]"
                >
                  Audit
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setRepoUrl(DEMO)}
                  className="text-[12px] text-white/22 hover:text-white/45 transition-colors font-mono"
                >
                  Try demo repo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RUNNING ── */}
        {appState === "running" && (
          <div className="w-full max-w-[300px] space-y-10">
            <p className="text-[11px] text-white/22 tracking-[0.18em] uppercase text-center">
              Analyzing
            </p>
            <ProgressPanel currentStage={currentStage} message={progressMsg} />
            <div className="text-center">
              <button
                onClick={reset}
                className="text-[12px] text-white/20 hover:text-white/45 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {appState === "error" && (
          <div className="w-full max-w-[520px] text-center space-y-4">
            <p className="text-[15px] text-[#FF453A] font-medium tracking-[-0.01em]">
              Audit failed
            </p>
            <p className="text-[13px] text-white/30 font-mono leading-relaxed">
              {errorMsg}
            </p>
            <button
              onClick={reset}
              className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
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
                className="text-[12px] text-white/18 hover:text-white/40 transition-colors"
              >
                New audit
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
