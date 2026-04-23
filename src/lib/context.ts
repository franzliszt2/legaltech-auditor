import fs from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data");

function read(rel: string): string {
  try {
    return fs.readFileSync(path.join(DATA, rel), "utf-8");
  } catch {
    return "";
  }
}

export function buildSecurityContext(): string {
  return [
    "=== OWASP Top 10 2025 (Web Application Security) ===",
    read("owasp/top-10-2025.json"),
    "=== OWASP LLM Top 10 2025 (AI-Specific Risks) ===",
    read("owasp/llm-top-10-2025.json"),
    "=== MITRE ATLAS — AI Adversarial Threat Landscape ===",
    read("mitre/atlas-summary.json"),
  ].join("\n\n");
}

export function buildEthicsContext(): string {
  return [
    "=== ABA Model Rules of Professional Conduct (Core Rules) ===",
    read("aba/model-rules-core.json"),
    "=== ABA Formal Opinion 512 (2024) — Generative AI in Legal Practice ===",
    read("aba/formal-opinion-512.md"),
  ].join("\n\n");
}
