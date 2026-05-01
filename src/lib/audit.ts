import Anthropic from "@anthropic-ai/sdk";
import type { RepoBundle, TriageMap, Finding, AuditReport, OverallScore } from "./types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Model selection: override via AUDIT_MODEL env var.
// Use claude-haiku-4-5-20251001 for faster/cheaper runs.
const MODEL = (process.env.AUDIT_MODEL as string | undefined) ?? "claude-sonnet-4-6";

// Input budget constants — keep cost per audit bounded
const MAX_FILE_CHARS = 6_000;        // per-file char limit in prompts (~1.5k tokens)
const MAX_TOTAL_INPUT_CHARS = 80_000; // total char budget across all files in one call (~20k tokens)

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFiles(
  bundle: RepoBundle,
  paths?: string[]
): string {
  const files = paths
    ? bundle.files.filter((f) => paths.includes(f.path))
    : bundle.files;

  // Enforce per-file and total char budgets to keep API costs bounded
  let totalChars = 0;
  const blocks: string[] = [];
  for (const f of files) {
    const content = f.content.slice(0, MAX_FILE_CHARS);
    const block = `### ${f.path}\n\`\`\`\n${content}\n\`\`\``;
    if (totalChars + block.length > MAX_TOTAL_INPUT_CHARS) break;
    blocks.push(block);
    totalChars += block.length;
  }
  return blocks.join("\n\n");
}

function recoverPartialArray(text: string): unknown[] {
  const results: unknown[] = [];
  let depth = 0, inString = false, escape = false, start = -1;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (escape)              { escape = false; continue; }
    if (c === "\\" && inString) { escape = true; continue; }
    if (c === '"')           { inString = !inString; continue; }
    if (inString)            continue;
    if (c === "{") { if (depth++ === 0) start = i; }
    else if (c === "}") {
      if (--depth === 0 && start !== -1) {
        try { results.push(JSON.parse(text.slice(start, i + 1))); } catch { /* skip malformed */ }
        start = -1;
      }
    }
  }
  return results;
}

function extractJson<T>(text: string): T {
  // Try a complete code block first
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]+?)```/);
  // Try a complete raw JSON structure
  const completeMatch = blockMatch
    ? blockMatch[1].trim()
    : (text.match(/(\{[\s\S]+\}|\[[\s\S]+\])/) ?? [])[1];

  // Fallback: if output was truncated (no closing ``` or ]), grab everything
  // from the first [ or { and let recoverPartialArray salvage complete objects
  const startIdx = text.search(/[\[{]/);
  const raw = completeMatch ?? (startIdx !== -1 ? text.slice(startIdx) : null);

  if (!raw) throw new Error("No JSON found in model response");
  try {
    return JSON.parse(raw) as T;
  } catch {
    if (raw.trimStart().startsWith("[")) {
      const recovered = recoverPartialArray(raw);
      if (recovered.length > 0) return recovered as T;
    }
    throw new Error(`JSON parse error — response may have been truncated`);
  }
}

function scoreFindings(findings: Finding[]): OverallScore {
  const hasCritical = findings.some((f) => f.severity === "critical");
  const highCount = findings.filter((f) => f.severity === "high").length;
  if (hasCritical || highCount >= 3) return "FAIL";
  if (highCount >= 1 || findings.some((f) => f.severity === "medium")) return "CONDITIONAL";
  return "PASS";
}

// ── Stage 1: Triage ───────────────────────────────────────────────────────────

const TRIAGE_SCHEMA = `{
  "securityPaths": ["path/to/file"],
  "ethicsPaths": ["path/to/file"],
  "aiRiskPaths": ["path/to/file"],
  "notableFeatures": ["brief description of notable feature"],
  "probableAppType": "e.g. AI contract reviewer / client intake assistant",
  "isLegalTech": true
}`;

export async function runTriage(bundle: RepoBundle): Promise<TriageMap> {
  const manifest = bundle.files.map((f) => `${f.type.padEnd(10)} ${f.path}`).join("\n");
  const snippets = bundle.files
    .slice(0, 10)
    .map((f) => `### ${f.path}\n${f.content.slice(0, 600)}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      "You are a legal-tech security auditor performing an initial triage of a repository. " +
      "Classify files into audit categories and identify key application features. " +
      "Respond only with a JSON code block matching the requested schema. No commentary.",
    messages: [
      {
        role: "user",
        content: `Repository: ${bundle.repo}

FILE MANIFEST:
${manifest}

FILE SNIPPETS (first 10 files):
${snippets}

Classify this repository and return JSON matching this schema exactly:
\`\`\`json
${TRIAGE_SCHEMA}
\`\`\`

Rules:
- securityPaths: files most relevant to auth, data access, storage, logging, API security
- ethicsPaths: files relevant to user-facing outputs, disclaimers, AI disclosure, client data handling
- aiRiskPaths: files containing prompts, model calls, chat endpoints, retrieval logic
- Include only paths that actually exist in the manifest above`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return extractJson<TriageMap>(text);
}

// ── Stage 2: Full Audit (security + AI risk + ethics in one call) ─────────────
// One API call instead of two keeps total runtime well within the 120s ceiling.

const FINDING_SCHEMA = `[
  {
    "id": "sec-001",
    "module": "security",
    "severity": "critical",
    "title": "Short descriptive title",
    "description": "What the issue is, where it appears, and why it matters in a legal-tech context.",
    "file": "path/to/file",
    "ruleReference": "OWASP A01:2025 — Broken Access Control",
    "remediation": "Concrete, technically actionable fix."
  }
]`;

export async function runAudit(
  bundle: RepoBundle,
  triage: TriageMap
): Promise<Finding[]> {
  const allPaths = [...new Set([
    ...triage.securityPaths,
    ...triage.aiRiskPaths,
    ...triage.ethicsPaths,
  ])];
  const codeBlock = formatFiles(bundle, allPaths.length ? allPaths : undefined);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system:
      "You are a full-stack auditor for legal technology applications. " +
      "Apply your knowledge of OWASP Top 10 2025, OWASP LLM Top 10 2025, MITRE ATLAS, " +
      "ABA Model Rules of Professional Conduct, and ABA Formal Opinion 512 (2024). " +
      "Analyze the provided code for security vulnerabilities, AI-specific risks, and legal ethics issues. " +
      "Only report findings grounded in visible code, UI copy, or workflow evidence. " +
      "Map each finding to a specific rule or standard reference. " +
      "Respond only with a JSON code block — an array of findings. No commentary.",
    messages: [
      {
        role: "user",
        content: `Repository: ${bundle.repo}
Probable app type: ${triage.probableAppType}
Notable features: ${triage.notableFeatures.join(", ")}

FILES FOR ANALYSIS:
${codeBlock}

Return a single JSON array covering all of the following:

SECURITY & AI RISK (use module: "security" or "ai-risk"):
- Authentication gaps, broken access control, hardcoded secrets
- Insecure data handling, PII in logs, dangerous storage configurations
- Prompt injection surfaces, system prompt exposure, ungrounded AI outputs
- Missing rate limiting on inference endpoints
Map each to a specific OWASP Top 10 2025, OWASP LLM Top 10 2025, or MITRE ATLAS reference.

LEGAL ETHICS (use module: "ethics"):
- Missing "not legal advice" disclaimers (Rule 1.1, Opinion 512)
- No disclosure that outputs are AI-generated (Rule 1.4, Opinion 512)
- Client data sent to third-party AI without disclosure (Rule 1.6)
- No human-in-the-loop review before client-facing outputs (Rule 5.3)
- No conflicts of interest check (Rules 1.7, 1.9)
- AI providing legal conclusions without attorney oversight (Rule 5.5)
- Inadequate data retention or deletion controls (Rule 1.6(c))
Map each to a specific ABA Model Rule or Opinion 512 section.

Each finding MUST reference a specific file from the list above.

Schema:
\`\`\`json
${FINDING_SCHEMA}
\`\`\``,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "[]";
  return extractJson<Finding[]>(text);
}

// ── Stage 3: Report Assembly ──────────────────────────────────────────────────

const SUMMARY_TEMPLATES: Record<OverallScore, string> = {
  FAIL:
    "This application presents serious security and/or legal ethics risks that must be addressed before deployment in a legal practice context.",
  CONDITIONAL:
    "This application has notable security or ethics gaps that should be remediated before handling real client data or attorney-client privileged information.",
  PASS:
    "This application presents low immediate risk, but continued monitoring and periodic re-audit are recommended as the codebase evolves.",
};

export async function assembleReport(
  repo: string,
  findings: Finding[]
): Promise<AuditReport> {
  const deduplicated = findings.filter(
    (f, i, arr) => arr.findIndex((x) => x.title === f.title && x.file === f.file) === i
  );

  const severityOrder: Record<string, number> = {
    critical: 0, high: 1, medium: 2, low: 3, info: 4,
  };
  const sorted = [...deduplicated].sort(
    (a, b) => (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
  );

  const score = scoreFindings(sorted);

  return {
    repo,
    timestamp: new Date().toISOString(),
    overallScore: score,
    summary: SUMMARY_TEMPLATES[score],
    findings: sorted,
  };
}
