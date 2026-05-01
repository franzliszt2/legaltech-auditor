"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ReportView } from "@/components/ReportView";
import type { AuditReport } from "@/lib/types";

export default function ReportPage() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setError("No report data found in this URL.");
      return;
    }
    try {
      // Decode the UTF-8-safe base64 report that was encoded in ReportView
      const json = decodeURIComponent(escape(atob(hash)));
      const parsed = JSON.parse(json) as AuditReport;
      if (!parsed.repo || !Array.isArray(parsed.findings)) {
        throw new Error("Invalid report structure");
      }
      setReport(parsed);
    } catch {
      setError("Could not load this report. The link may be malformed or incomplete.");
    }
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col items-center px-5 py-16" style={{ minHeight: "calc(100vh - 52px)" }}>
        {!report && !error && (
          <p className="text-[14px]" style={{ color: "var(--t3)" }}>
            Loading report…
          </p>
        )}

        {error && (
          <div className="text-center space-y-4">
            <p
              className="text-[14px] font-medium tracking-[-0.01em]"
              style={{ color: "var(--ios-red)" }}
            >
              Report not found
            </p>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--t3)" }}
            >
              {error}
            </p>
            <Link
              href="/"
              className="text-[12px] transition-colors"
              style={{ color: "var(--t4)" }}
            >
              Run a new audit →
            </Link>
          </div>
        )}

        {report && (
          <div className="w-full max-w-[580px]">
            <ReportView report={report} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
