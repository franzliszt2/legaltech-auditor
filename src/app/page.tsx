"use client";

import { useState, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ReportView } from "@/components/ReportView";
import type { AuditReport, ProgressEvent, ProgressStage } from "@/lib/types";

type AppState = "idle" | "running" | "done" | "error";

const DEMO = "https://github.com/franzliszt2/vulnerable-legaltech-demo";

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
                Security, ethics, and AI risk — grounded in OWASP,
                <br className="hidden sm:block" /> MITRE ATLAS, and ABA Formal Opinion 512.
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

              <div className="text-center">
                <button
                  onClick={() => setRepoUrl(DEMO)}
                  className="text-[12px] font-mono transition-colors"
                  style={{ color: "var(--t4)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t4)")}
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
