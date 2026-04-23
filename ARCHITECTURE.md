# LegalTech Auditor — Architecture

> AI-powered security and ethics checkpoint for vibe-coded legal tech applications.  
> Built at Anthropic Hackathon · Stack: Next.js + Claude API + Vercel

---

## Problem

A wave of AI-assisted legal tools (contract review, intake automation, due diligence bots) are being shipped by non-lawyers and non-security engineers. These apps handle privileged client data, must comply with ABA Model Rules and state bar ethics opinions, and are increasingly used in high-stakes contexts. Most have never been audited for security *or* legal ethics compliance.

---

## Product

A "TSA checkpoint" that accepts a GitHub repo URL (or uploaded codebase) and returns a structured audit report covering:

1. **Security vulnerabilities** — OWASP-aligned, tuned for legal-tech failure modes
2. **Legal ethics compliance** — ABA Model Rules, client confidentiality, conflicts of interest
3. **AI-specific risks** — prompt injection, hallucination surfaces, model output liability

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  - Repo URL input / file upload                             │
│  - Real-time streaming audit progress                        │
│  - Structured report UI with severity badges                 │
│  - PDF export                                                │
└────────────────────┬────────────────────────────────────────┘
                     │ API Routes
┌────────────────────▼────────────────────────────────────────┐
│                     Backend (Next.js API Routes)             │
│                                                              │
│  /api/audit          — orchestrates full audit pipeline      │
│  /api/audit/stream   — SSE stream for live progress          │
│  /api/fetch-repo     — GitHub API → extract relevant files   │
└──────┬──────────────────────────┬───────────────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼────────┐
│  GitHub API │          │   Claude API     │
│             │          │   (Anthropic)    │
│  Fetch:     │          │                  │
│  - Code     │          │  Models:         │
│  - package  │          │  - Opus 4.7      │
│    .json    │          │    (deep audit)  │
│  - .env.*   │          │  - Sonnet 4.6    │
│  - README   │          │    (triage)      │
│  - API      │          │                  │
│    routes   │          │  Features:       │
│  - Auth     │          │  - Prompt cache  │
│    config   │          │  - Tool use      │
│  - AI       │          │  - Streaming     │
│    prompts  │          └────────┬─────────┘
└──────┬──────┘                   │
       └──────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │    Audit Pipeline     │
         │                       │
         │  1. Triage            │
         │     Classify files,   │
         │     determine scope   │
         │                       │
         │  2. Security Scan     │
         │     OWASP + legal-    │
         │     specific checks   │
         │                       │
         │  3. Ethics Audit      │
         │     ABA Model Rules,  │
         │     state bar rules,  │
         │     confidentiality   │
         │                       │
         │  4. AI Risk Scan      │
         │     Prompt injection, │
         │     output liability, │
         │     data retention    │
         │                       │
         │  5. Report Assembly   │
         │     Severity scoring, │
         │     remediation tips  │
         └───────────────────────┘
```

---

## Audit Modules

### Module 1 — Security (OWASP + Legal-Specific)

| Check | Severity | Legal Context |
|-------|----------|---------------|
| Hardcoded API keys / secrets | Critical | Client data exposure |
| Public S3 / storage buckets | Critical | Attorney-client privilege |
| Missing auth on document endpoints | Critical | Matter confidentiality |
| PII/PHI in logs | High | Ethics Rule 1.6 |
| Cross-matter data leakage | High | Conflicts — Rule 1.7/1.9 |
| Missing rate limiting on AI endpoints | Medium | Abuse surface |
| Insecure direct object references | High | Client file access |
| Third-party data sharing without disclosure | High | Rule 1.6(c) |

### Module 2 — Legal Ethics (ABA Model Rules)

| Rule | Check |
|------|-------|
| 1.1 Competence | Does the AI tool disclaim limitations? Is the underlying model identified? |
| 1.4 Communication | Are AI-generated outputs clearly labeled as such to end users? |
| 1.6 Confidentiality | Is client data sent to third-party AI APIs? Is there a BAA / DPA? |
| 1.7 / 1.9 Conflicts | Is there a conflicts-check workflow? Can matter data bleed across clients? |
| 5.3 Supervision | Is there a human-in-the-loop for AI outputs that reach clients? |
| 5.5 Unauthorized Practice | Does the tool provide legal advice without attorney oversight? |

### Module 3 — AI-Specific Risks

- **Prompt injection**: Can user-controlled input alter the system prompt behavior?
- **System prompt leakage**: Is the system prompt exposed via error messages or API responses?
- **Hallucination surface area**: Are legal citations, case law, or statutes generated without retrieval grounding?
- **Output liability disclosure**: Does the tool disclaim that AI output is not legal advice?
- **Model data retention**: Is user/client data sent to models with training data retention policies?
- **Adversarial document attacks**: Can a malicious contract manipulate the AI reviewer?

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 15 (App Router) | Vercel-native, streaming SSE support |
| Styling | Tailwind + shadcn/ui | Fast, professional UI |
| Backend | Next.js API Routes | Collocated, easy Vercel deploy |
| AI | Claude API (Anthropic) | Best-in-class for long-context code analysis |
| GitHub ingestion | GitHub REST API | Public repos; Octokit for authenticated |
| Auth (optional) | Clerk or NextAuth | If we add saved reports / history |
| PDF export | react-pdf or puppeteer | Report download |
| Deployment | Vercel | Zero-config, edge-ready |

---

## Claude API Strategy

- **Model routing**: Sonnet 4.6 for triage/classification; Opus 4.7 for deep security and ethics analysis
- **Prompt caching**: Cache the audit rubric (OWASP checks + ABA rules) as static context — reused across every call, cuts cost dramatically
- **Tool use**: Structured JSON output for findings (severity, rule reference, file location, remediation)
- **Streaming**: SSE from Claude → API route → frontend for live progress UX
- **Context window**: Claude's 200k context handles large codebases; chunk by module if needed

---

## Report Output Schema

```typescript
interface AuditReport {
  repo: string;
  timestamp: string;
  overallScore: "PASS" | "CONDITIONAL" | "FAIL";
  summary: string;
  findings: Finding[];
}

interface Finding {
  id: string;
  module: "security" | "ethics" | "ai-risk";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  file?: string;
  line?: number;
  ruleReference?: string;   // e.g. "ABA Model Rule 1.6" or "OWASP A01:2021"
  remediation: string;
}
```

---

## Milestones

- [ ] Repo scaffold (Next.js + Tailwind + shadcn)
- [ ] GitHub ingestion module (fetch + filter relevant files)
- [ ] Claude audit pipeline (triage → security → ethics → AI risk)
- [ ] Streaming progress UI
- [ ] Report display component
- [ ] PDF export
- [ ] Vercel deployment
- [ ] Demo repo targets (intentionally vulnerable legaltech examples)

---

## Data Sources & Grounding Strategy

The quality of audit findings depends entirely on how well the Claude prompt rubric is grounded in authoritative, citable sources. Below are all integrated data sources, organized by category. Raw data files live in `data/`.

### Security — CVE / Vulnerability Data

| Source | Format | Location | Integration |
|--------|--------|----------|-------------|
| **OSV API** (Google) | REST API | `data/integrations/osv-api.md` | Runtime: POST /v1/querybatch with parsed package.json / requirements.txt → returns real CVEs per dependency version |
| **OWASP LLM Top 10 (2025)** | JSON | `data/owasp/llm-top-10-2025.json` | Static: embed as prompt cache block in AI risk module. All 10 items with legal-tech relevance annotations |
| **OWASP Top 10 (2025)** | JSON | `data/owasp/top-10-2025.json` | Static: embed as prompt cache block in security module. All 10 items with legal-tech specific checks |
| **MITRE ATLAS v5.5.0** | YAML + JSON | `data/mitre/ATLAS.yaml`, `data/mitre/atlas-summary.json` | Static: full 9,381-line YAML with 16 tactics, 84 techniques, 56 sub-techniques, 32 mitigations, 42 case studies. Summary JSON for prompt context; full YAML available for deep queries |
| **Notable LangChain CVEs** | Inline in OSV doc | `data/integrations/osv-api.md` | Reference list of historically significant CVEs for the most common legaltech dependencies |

### Legal Ethics — Rules Data

| Source | Format | Location | Integration |
|--------|--------|----------|-------------|
| **ABA Formal Opinion 512 (2024)** | Markdown | `data/aba/formal-opinion-512.md` | Static: embed in full as prompt cache block in ethics module. The authoritative AI ethics opinion; all 6 rule areas with specific audit checklists |
| **ABA Model Rules — Core 9 Rules** | JSON | `data/aba/model-rules-core.json` | Static: Rules 1.1, 1.4, 1.5, 1.6, 1.7, 1.9, 3.1, 3.3, 5.3, 5.5 with full text, AI application guidance, and per-rule audit checks |
| **State Bar Variations** | JSON (in model-rules-core.json) | `data/aba/model-rules-core.json` | NY, CA, FL noted as having diverging AI-specific opinions. Post-hackathon: per-state rule expansion |

### Runtime API Integrations (Not Static Data)

| Integration | Purpose | Endpoint |
|------------|---------|----------|
| **GitHub REST API** | Fetch target repo code, package.json, requirements.txt, .env.example, README | `https://api.github.com/repos/{owner}/{repo}` |
| **OSV Batch Query** | CVE lookup per dependency | `https://api.osv.dev/v1/querybatch` |
| **Claude API** | Audit analysis with prompt caching | Anthropic SDK — see Claude API Strategy section |

### Prompt Cache Architecture

The static data above is organized to maximize Claude's prompt caching efficiency. At audit time, context blocks are assembled in this order (earlier = more reused = more cache hits):

```
[CACHED — reused across all audits]
1. OWASP Top 10 2025          (~4k tokens)
2. OWASP LLM Top 10 2025      (~8k tokens)
3. ABA Model Rules core        (~6k tokens)
4. ABA Formal Opinion 512      (~5k tokens)
5. MITRE ATLAS summary         (~4k tokens)

[DYNAMIC — per audit]
6. Target repo code (chunked by module)
7. OSV API results for this repo's dependencies
8. Audit task instructions
```

Caching blocks 1-5 means the ~27k tokens of reference material is only billed once per cache TTL (5 min), not once per audit call. With 3 Claude calls per audit (triage + security + ethics), this cuts input token costs by ~65%.

### High-Priority Packages for OSV Scanning

The following packages are pre-flagged for CVE checks given their prevalence in legal AI tech stacks. See `data/integrations/osv-api.md` for the complete list.

**Python (PyPI):** `langchain`, `langchain-core`, `langchain-community`, `llamaindex`, `fastapi`, `flask`, `sqlalchemy`, `pydantic`, `chromadb`, `pinecone-client`, `unstructured`, `pypdf`

**JavaScript/npm:** `langchain`, `@langchain/core`, `openai`, `@anthropic-ai/sdk`, `next`, `jsonwebtoken`, `passport`, `multer`, `marked`, `@supabase/supabase-js`

---

## Open Questions

- Scope creep guard: limit to repos under X files / X LOC for hackathon demo?
- Do we add user accounts (saved reports) or keep it stateless for simplicity?
- Rate limiting: how do we prevent abuse of the GitHub fetch + Claude pipeline?
- Demo strategy: build 1-2 "bad" sample legaltech repos to audit live on stage?
