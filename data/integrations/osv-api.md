# OSV (Open Source Vulnerabilities) API Integration

**API Base URL:** `https://api.osv.dev/v1/`  
**Documentation:** https://google.github.io/osv.dev/api/  
**Coverage:** npm, PyPI, Go, Maven, Debian, GitHub Advisory Database, and more  

---

## Overview

The OSV API provides programmatic access to vulnerability data for open source packages. It is the single most important deterministic data source for our dependency audit module — it converts a target repo's `package.json` or `requirements.txt` into real CVEs with real IDs.

---

## Endpoints

### POST /v1/query — Single Package Query

Query vulnerabilities for a specific package and version.

**Request:**
```json
{
  "version": "string",
  "package": {
    "name": "string",
    "ecosystem": "string"
  }
}
```

**Ecosystem values (case-sensitive):**
- `npm` — Node.js packages
- `PyPI` — Python packages (note: capital P, lowercase ypi)
- `Go` — Go modules
- `Maven` — Java/Maven packages
- `crates.io` — Rust packages
- `RubyGems` — Ruby gems

**Response:**
```json
{
  "vulns": [
    {
      "id": "GHSA-xxxx-xxxx-xxxx",
      "summary": "Brief description",
      "details": "Full description",
      "modified": "2024-01-15T00:00:00Z",
      "published": "2024-01-10T00:00:00Z",
      "references": [
        { "type": "WEB", "url": "https://..." },
        { "type": "FIX", "url": "https://github.com/..." }
      ],
      "affected": [
        {
          "package": { "name": "langchain", "ecosystem": "PyPI" },
          "ranges": [
            {
              "type": "ECOSYSTEM",
              "events": [
                { "introduced": "0.0.1" },
                { "fixed": "0.1.0" }
              ]
            }
          ]
        }
      ],
      "severity": [{ "type": "CVSS_V3", "score": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H" }]
    }
  ]
}
```

### POST /v1/querybatch — Batch Query

Query multiple packages in a single request.

**Request:**
```json
{
  "queries": [
    { "version": "0.1.0", "package": { "name": "langchain", "ecosystem": "PyPI" } },
    { "version": "4.4.4", "package": { "name": "express", "ecosystem": "npm" } }
  ]
}
```

**Response:**
```json
{
  "results": [
    { "vulns": [...] },
    { "vulns": [...] }
  ]
}
```

---

## High-Priority Packages to Check (Legal AI Tech Stack)

### Python (PyPI ecosystem)

| Package | Why It Matters |
|---------|---------------|
| `langchain` | Most common LLM orchestration framework; multiple historical CVEs including prompt injection and arbitrary code execution |
| `langchain-core` | Core langchain dependency |
| `langchain-community` | Third-party integrations, broader attack surface |
| `llamaindex` | Alternative LLM framework |
| `llama-index` | Package alias |
| `openai` | OpenAI Python client |
| `anthropic` | Anthropic Python client |
| `fastapi` | Common API framework for Python AI backends |
| `flask` | Alternative web framework |
| `sqlalchemy` | ORM — SQL injection surface if used incorrectly with AI |
| `pydantic` | Data validation — deserialization vulnerabilities |
| `requests` | HTTP client — SSRF if fed user-controlled URLs |
| `python-dotenv` | Environment variable management |
| `supabase` | Database client |
| `chromadb` | Vector database |
| `pinecone-client` | Vector database |
| `weaviate-client` | Vector database |
| `unstructured` | Document parsing — potential for malicious document attacks |
| `pypdf` | PDF processing |
| `python-docx` | DOCX processing |

### JavaScript/TypeScript (npm ecosystem)

| Package | Why It Matters |
|---------|---------------|
| `langchain` | LangChain.js |
| `@langchain/core` | Core LangChain.js |
| `openai` | OpenAI JS client |
| `@anthropic-ai/sdk` | Anthropic JS client |
| `next` | Next.js framework |
| `express` | Express.js |
| `jsonwebtoken` | JWT — critical for auth; multiple historical CVEs |
| `passport` | Authentication middleware |
| `multer` | File upload — file type validation issues |
| `axios` | HTTP client — SSRF surface |
| `@supabase/supabase-js` | Supabase client |
| `prisma` | ORM |
| `mongoose` | MongoDB ODM — NoSQL injection |
| `marked` | Markdown rendering — XSS if AI output rendered as HTML |
| `dompurify` | HTML sanitization — check it's being used |
| `pdf-parse` | PDF parsing |
| `mammoth` | DOCX parsing |
| `clerk` | Authentication provider |
| `@clerk/nextjs` | Clerk Next.js integration |

---

## Integration Pattern

```typescript
// src/lib/osv.ts

const OSV_API = 'https://api.osv.dev/v1';

interface OsvPackage {
  name: string;
  ecosystem: 'npm' | 'PyPI' | 'Go' | 'Maven';
}

interface OsvVuln {
  id: string;
  summary: string;
  details: string;
  severity?: Array<{ type: string; score: string }>;
  references: Array<{ type: string; url: string }>;
  affected: Array<{
    package: OsvPackage;
    ranges: Array<{
      type: string;
      events: Array<{ introduced?: string; fixed?: string }>;
    }>;
  }>;
}

export async function queryVulns(
  packages: Array<{ name: string; version: string; ecosystem: 'npm' | 'PyPI' }>
): Promise<Array<{ package: string; version: string; vulns: OsvVuln[] }>> {
  const queries = packages.map(p => ({
    version: p.version,
    package: { name: p.name, ecosystem: p.ecosystem }
  }));

  const res = await fetch(`${OSV_API}/querybatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queries })
  });

  const data = await res.json();

  return packages.map((pkg, i) => ({
    package: pkg.name,
    version: pkg.version,
    vulns: data.results[i]?.vulns ?? []
  }));
}
```

---

## Notable LangChain CVEs (Reference)

| CVE / GHSA | Description | Fixed In |
|-----------|-------------|---------|
| CVE-2023-36188 | Arbitrary code execution via `PALChain` | 0.0.306 |
| CVE-2023-38896 | Code execution via `SQLDatabaseChain` | 0.0.247 |
| CVE-2023-39659 | Code execution via CSV agent | 0.0.295 |
| CVE-2023-44467 | Arbitrary code execution in `load_prompt` | 0.0.317 |
| CVE-2024-2965 | Prompt injection via document loaders | 0.1.x |

*Query OSV API at runtime for current, up-to-date CVE lists by package version.*

---

## Notes

- The OSV API is free and requires no authentication for public queries.
- HTTP/2 recommended for batch queries exceeding 32MiB response size.
- Rate limits are generous; no documented hard limit for reasonable use.
- OSV aggregates NVD, GitHub Advisory Database, and ecosystem-specific advisories — it is the single best source.
