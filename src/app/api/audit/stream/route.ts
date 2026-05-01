import { fetchRepo } from "@/lib/github";
import { runTriage, runAudit, assembleReport } from "@/lib/audit";
import type { ProgressEvent } from "@/lib/types";

export const maxDuration = 120;

// SSE timeout — sends a clean error just before Vercel's hard kill at 120s
const TOTAL_AUDIT_TIMEOUT_MS = 115_000;

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

      const timeoutId = setTimeout(() => {
        send({
          stage: "error",
          message: "Audit timed out.",
          error: "The audit exceeded the time limit. Try a smaller repository.",
        });
        close();
      }, TOTAL_AUDIT_TIMEOUT_MS);

      try {
        send({ stage: "fetch", message: "Fetching repository structure…" });
        const bundle = await fetchRepo(repoUrl);

        send({ stage: "triage", message: `Triaging ${bundle.files.length} relevant files…` });
        const triage = await runTriage(bundle);

        // Security and ethics now run in a single API call to stay within the 120s ceiling
        send({
          stage: "security",
          message: `Auditing ${[...new Set([...triage.securityPaths, ...triage.aiRiskPaths, ...triage.ethicsPaths])].length} files for security, AI risk, and ethics…`,
        });
        const findings = await runAudit(bundle, triage);

        // Advance the progress UI through ethics before assembly
        send({ stage: "ethics", message: "Applying legal ethics analysis…" });

        send({ stage: "assembly", message: "Assembling final report…" });
        const report = await assembleReport(bundle.repo, findings);

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
