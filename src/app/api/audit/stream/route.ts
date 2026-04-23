import { fetchRepo } from "@/lib/github";
import { runTriage, runSecurityAudit, runEthicsAudit, assembleReport } from "@/lib/audit";
import type { ProgressEvent } from "@/lib/types";

export const maxDuration = 120;

function encode(event: ProgressEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
  const { repoUrl } = await request.json() as { repoUrl: string };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: ProgressEvent) =>
        controller.enqueue(encoder.encode(encode(event)));

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
        controller.close();
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
