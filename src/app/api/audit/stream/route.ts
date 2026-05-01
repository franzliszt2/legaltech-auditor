import { fetchRepo } from "@/lib/github";
import { runTriage, runSecurityAudit, runEthicsAudit, assembleReport } from "@/lib/audit";
import type { ProgressEvent } from "@/lib/types";

export const maxDuration = 60;

// Overall audit timeout — sends a clean error message before Vercel hard-kills at 60s
const TOTAL_AUDIT_TIMEOUT_MS = 55_000;

function encode(event: ProgressEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
  const { repoUrl } = await request.json() as { repoUrl: string };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const send = (event: ProgressEvent) => {
        if (closed) return;
        try { controller.enqueue(encoder.encode(encode(event))); } catch { /* stream closed */ }
      };

      const close = () => {
        if (closed) return;
        closed = true;
        try { controller.close(); } catch { /* already closed */ }
      };

      // Timeout guard — provides a clean error before Vercel's hard cut at 120s
      const timeoutId = setTimeout(() => {
        send({
          stage: "error",
          message: "Audit timed out.",
          error: "The audit exceeded the time limit. Try a smaller repository or reduce file count.",
        });
        close();
      }, TOTAL_AUDIT_TIMEOUT_MS);

      try {
        send({ stage: "fetch", message: "Fetching repository structure…" });
        const bundle = await fetchRepo(repoUrl);

        send({ stage: "triage", message: `Triaging ${bundle.files.length} relevant files…` });
        const triage = await runTriage(bundle);

        send({
          stage: "security",
          message: `Running security audit (${triage.securityPaths.length + triage.aiRiskPaths.length} files)…`,
        });
        const secFindings = await runSecurityAudit(bundle, triage);

        send({
          stage: "ethics",
          message: `Running legal ethics audit (${triage.ethicsPaths.length} files)…`,
        });
        const ethicsFindings = await runEthicsAudit(bundle, triage);

        send({ stage: "assembly", message: "Assembling final report…" });
        const report = await assembleReport(
          bundle.repo,
          [...secFindings, ...ethicsFindings]
        );

        send({ stage: "complete", message: "Audit complete.", report });
      } catch (err) {
        send({
          stage: "error",
          message: "Audit failed.",
          error: err instanceof Error ? err.message : String(err),
        });
      } finally {
        clearTimeout(timeoutId);
        close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
