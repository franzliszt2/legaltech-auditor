# Specter — Architecture

> Proprietary legal auditing engine. Trusted security, ethics, and AI risk analysis against OWASP, MITRE ATLAS, and ABA standards.  
> Built at Anthropic Hackathon · Stack: Next.js 16 + Claude API + Vercel

---

## Problem

A wave of AI-assisted legal tools — contract review, intake automation, due diligence bots — are being shipped by non-lawyers and non-security engineers. These apps handle privileged client data, must comply with ABA Model Rules and state bar ethics opinions, and are increasingly deployed in high-stakes contexts. Most have never been audited for security *or* legal ethics compliance.

---

## Product

Specter is a "TSA checkpoint" for legal technology. It accepts a GitHub repository URL and returns a structured, citable audit report covering:

1. **Security vulnerabilities** — OWASP-aligned, tuned for legal-tech failure modes
2. **Legal ethics compliance** — ABA Model Rules, client confidentiality, conflicts of interest
3. **AI-specific risks** — prompt injection, hallucination surfaces, model output liability
4. **Privacy** — client data handling, logging of PII/PHI, cross-matter leakage, retention controls

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  Specter — Apple-inspired light/dark UI                      │
│  - Repo URL input                                            │
│  - Real-time SSE streaming audit progress                    │
│  - VerdictBand (PASS / CONDITIONAL / FAIL)                   │
│  - 4-section tabbed findings report                          │
└────────────────────┬────────────────────────────────────────┘
                     │ SSE Stream
┌────────────────────▼────────────────────────────────────────┐
│                  /api/audit/stream (Next.js)                 │
│                                                              │
│  Orchestrates full pipeline, emits progress events via SSE   │
│  maxDuration: 120s (Vercel)                                  │
└──────┬──────────────────────────┬───────────────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼────────┐
│  GitHub API │          │   Claude API     │
│  (Octokit)  │          │   (Anthropic)    │
│             │          │                  │
│  35-file    │          │  Model:          │
│  cap, 60KB  │          │  claude-         │
│  per file   │          │  sonnet-4-6      │
│             │          │                  │
│  Fetches:   │          │  Features:       │
│  - API      │          │  - Prompt cache  │
│    routes   │          │    (ephemeral)   │
│  - Auth     │          │  - 8192 max      │
│  - AI       │          │    output tokens │
│    prompts  │          │  - JSON extract  │
│  - package  │          │    w/ partial    │
│    .json    │          │    array recovery│
│  - .env.*   │          └────────┬─────────┘
└──────┬──────┘                   │
       └──────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │    Audit Pipeline     │
         │                       │
         │  1. Triage            │
         │     Sonnet classifies │
         │     files by module   │
         │                       │
         │  2. Security + AI     │
         │     OWASP Top 10,     │
         │     OWASP LLM Top 10, │
         │     MITRE ATLAS v5.5  │
         │                       │
         │  3. Ethics Audit      │
         │     ABA Model Rules,  │
         │     ABA Opinion 512   │
         │                       │
         │  4. Report Assembly   │
         │     Dedup, sort by    │
         │     severity, score   │
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
| Insecure direct object references | High | Client file access |
| Third-party data sharing without disclosure | High | Rule 1.6(c) |
| Missing rate limiting on AI endpoints | Medium | Abuse surface |

### Module 2 — Legal Ethics (ABA Model Rules + Opinion 512)

| Rule | Check |
|------|-------|
| 1.1 Competence | Does the AI tool disclaim limitations? Is the underlying model identified? |
| 1.4 Communication | Are AI-generated outputs clearly labeled as such to end users? |
| 1.6 Confidentiality | Is client data sent to third-party AI APIs? Is there disclosure or a BAA/DPA? |
| 1.7 / 1.9 Conflicts | Is there a conflicts-check workflow? Can matter data bleed across clients? |
| 5.3 Supervision | Is there a human-in-the-loop for AI outputs that reach clients? |
| 5.5 Unauthorized Practice | Does the tool provide legal advice without attorney oversight? |

### Module 3 — AI-Specific Risks (MITRE ATLAS)

- **Prompt injection**: Can user-controlled input alter system prompt behavior?
- **System prompt leakage**: Is the system prompt exposed via error messages or API responses?
- **Hallucination surface area**: Are legal citations or statutes generated without retrieval grounding?
- **Output liability disclosure**: Does the tool disclaim that AI output is not legal advice?
- **Model data retention**: Is client data sent to models with training retention policies?
- **Adversarial document attacks**: Can a malicious document manipulate the AI reviewer?

### Module 4 — Privacy

Findings from all modules are classified into a four-section taxonomy at display time:

| Section | Signals |
|---------|---------|
| Security | Auth, secrets, endpoints, OWASP refs |
| Privacy | Rule 1.6, PII/PHI, logging, cross-matter, retention |
| Ethical | Rules 1.1/1.4/5.1/5.3, disclaimers, AI disclosure, supervision |
| Legal | Rules 1.7/1.9/3.1/3.3/5.5, conflicts, UPL, candor |

Classification is done client-side via `classifyFinding()` in `src/lib/sections.ts` using `ruleReference` + keyword matching.

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Next.js 16 (App Router) | Vercel-native, SSE streaming |
| Styling | Tailwind CSS v4 | CSS custom properties for light/dark theming |
| Typography | System-UI / SF Pro + Georgia fallback | Apple-inspired; "Specter" wordmark in Rhymes Display → Georgia |
| AI | Claude API — `claude-sonnet-4-6` | 200k context, prompt caching, 8192 output tokens |
| GitHub ingestion | Octokit (GitHub REST API) | 35-file cap, 60KB/file, high-signal path matching |
| Deployment | Vercel | `maxDuration: 120` for stream route |

---

## Claude API Strategy

- **Model**: `claude-sonnet-4-6` for all three pipeline stages (triage, security+AI risk, ethics)
- **Prompt caching**: OWASP, MITRE ATLAS, and ABA context blocks passed as `cache_control: { type: "ephemeral" }` system blocks — reused across calls, ~65% input token cost reduction
- **Output tokens**: `max_tokens: 8192` on security and ethics calls to prevent JSON truncation
- **JSON recovery**: `extractJson()` includes a partial-array fallback (`recoverPartialArray()`) that extracts all complete `{...}` objects from a truncated response rather than failing
- **Streaming**: SSE from API route to frontend via `ReadableStream` + `controller.enqueue()`
- **Sanitization**: `sanitize()` strips surrogate pairs (`[\uD800-\uDFFF]`) and null bytes from GitHub file content before sending to Claude

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
  ruleReference?: string;   // e.g. "ABA Model Rule 1.6" or "OWASP A01:2025"
  remediation: string;
}
```

### Scoring Logic

| Condition | Score |
|-----------|-------|
| Any `critical` finding, or ≥ 3 `high` findings | `FAIL` |
| Any `high` or `medium` finding | `CONDITIONAL` |
| No findings above `low` | `PASS` |

---

## Data Sources

All static grounding data lives in `data/`. Assembled into Claude prompt cache blocks at audit time.

### Security

| Source | Format | Location |
|--------|--------|----------|
| OWASP Top 10 (2025) | JSON | `data/owasp/top-10-2025.json` |
| OWASP LLM Top 10 (2025) | JSON | `data/owasp/llm-top-10-2025.json` |
| MITRE ATLAS v5.5.0 | YAML + JSON | `data/mitre/ATLAS.yaml`, `data/mitre/atlas-summary.json` |
| OSV API (Google) | REST | Runtime — POST `/v1/querybatch` per dependency |

### Legal Ethics

| Source | Format | Location |
|--------|--------|----------|
| ABA Formal Opinion 512 (2024) | Markdown | `data/aba/formal-opinion-512.md` |
| ABA Model Rules (core 9 rules) | JSON | `data/aba/model-rules-core.json` |

### Prompt Cache Block Order

```
[CACHED — reused across all audits, ~27k tokens]
1. OWASP Top 10 2025          (~4k tokens)
2. OWASP LLM Top 10 2025      (~8k tokens)
3. MITRE ATLAS summary         (~4k tokens)
4. ABA Model Rules core        (~6k tokens)
5. ABA Formal Opinion 512      (~5k tokens)

[DYNAMIC — per audit]
6. Target repo code (filtered by triage module)
7. Audit task instructions + JSON schema
```

---

## Known Bugs Fixed

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `Bad credentials` on GitHub fetch | `GITHUB_TOKEN` placeholder being sent even when unset | Only pass `auth` to Octokit when token is non-empty |
| `no low surrogate in string` (Anthropic 400) | Binary/encoded file content from GitHub containing invalid Unicode | `sanitize()` strips `[\uD800-\uDFFF]` and null bytes |
| `Unterminated string in JSON` | Security/ethics audit response hitting 4096 token ceiling mid-JSON | Bumped `max_tokens` to 8192; added `recoverPartialArray()` fallback |

---

## Milestones

- [x] Repo scaffold (Next.js 16 + Tailwind v4)
- [x] GitHub ingestion module (fetch + filter relevant files, 35-file cap)
- [x] Static data layer (OWASP, MITRE ATLAS, ABA Model Rules, Opinion 512)
- [x] Claude audit pipeline (triage → security+AI risk → ethics → assembly)
- [x] SSE streaming progress UI with animated step indicators
- [x] Structured report UI — VerdictBand, StatRow, 4-section tabbed findings
- [x] Light/dark theme toggle (CSS custom properties, `data-theme`)
- [x] Vercel deployment (`maxDuration: 120`)
- [x] Demo target repo (`franzliszt2/vulnerable-legaltech-demo`)
- [ ] PDF export
- [ ] Saved reports / user accounts
- [ ] OSV dependency CVE runtime lookup
- [ ] Per-state bar rule expansion (NY, CA, FL)
