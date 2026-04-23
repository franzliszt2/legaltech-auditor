import type { Finding, Severity } from "./types";

export type SectionId = "ethical" | "legal" | "security" | "privacy";

export interface Section {
  id: SectionId;
  label: string;
  description: string;
  summaryTemplate: (count: number, topSeverity: Severity | null) => string;
}

export const SECTIONS: Section[] = [
  {
    id: "security",
    label: "Security",
    description: "Authentication gaps, exposed secrets, endpoint vulnerabilities, and AI-specific attack surfaces.",
    summaryTemplate: (n, s) =>
      n === 0
        ? "No security issues detected."
        : `${n} ${s === "critical" ? "critical" : s === "high" ? "high-severity" : ""} ${n === 1 ? "issue" : "issues"} expose the application to direct attack or unauthorized access.`.trim(),
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Client data handling, third-party data sharing, logging of confidential material, cross-matter leakage, and retention controls.",
    summaryTemplate: (n, s) =>
      n === 0
        ? "No privacy issues detected."
        : `${n} ${n === 1 ? "issue" : "issues"} could expose client-confidential material or violate data handling obligations.`,
  },
  {
    id: "ethical",
    label: "Ethical",
    description: "Attorney supervision, competence obligations, AI disclosure, human-in-the-loop requirements, and misleading AI presentation.",
    summaryTemplate: (n, s) =>
      n === 0
        ? "No ethical issues detected."
        : `${n} ${n === 1 ? "finding raises" : "findings raise"} attorney-supervision and professional responsibility concerns.`,
  },
  {
    id: "legal",
    label: "Legal",
    description: "Unauthorized practice of law risk, conflicts of interest controls, candor obligations, and liability disclaimer gaps.",
    summaryTemplate: (n, s) =>
      n === 0
        ? "No legal compliance issues detected."
        : `${n} ${n === 1 ? "issue touches" : "issues touch"} unauthorized practice, conflicts, or client communication obligations.`,
  },
];

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 4, high: 3, medium: 2, low: 1, info: 0,
};

// Remap existing module/ruleReference into the 4-section taxonomy
export function classifyFinding(f: Finding): SectionId {
  const ref = (f.ruleReference ?? "").toLowerCase();
  const desc = (f.description + " " + f.title).toLowerCase();

  // Privacy signals
  if (
    ref.includes("1.6") ||
    /confidential|privacy|pii|phi|data retention|third.party|logging|log |cross.matter|supabase|storage|s3|bucket|encrypt|gdpr|ccpa/.test(desc + ref)
  ) return "privacy";

  // Legal signals
  if (
    ref.includes("1.7") || ref.includes("1.9") || ref.includes("3.1") || ref.includes("3.3") ||
    ref.includes("5.5") ||
    /conflict|adverse|unauthorized practice|upl|candor|tribunal|sanctions|misrepresent|filing/.test(desc + ref)
  ) return "legal";

  // Ethics signals (rules 1.1, 1.4, 5.1, 5.3)
  if (
    f.module === "ethics" ||
    ref.includes("1.1") || ref.includes("1.4") || ref.includes("5.1") || ref.includes("5.3") ||
    /disclaimer|disclos|ai.generat|label|supervision|human.in|competence|hallucin|opini|advice/.test(desc + ref)
  ) return "ethical";

  // AI-risk: data/privacy-adjacent → privacy; attack surface → security
  if (f.module === "ai-risk") {
    if (/training|retention|embedding|rag|vector|leakage|memoriz/.test(desc + ref)) return "privacy";
    return "security";
  }

  return "security";
}

export interface SectionGroup {
  section: Section;
  findings: Finding[];
  topSeverity: Severity | null;
  weight: number;
}

export function groupBySection(findings: Finding[]): SectionGroup[] {
  const map = new Map<SectionId, Finding[]>();
  SECTIONS.forEach((s) => map.set(s.id, []));

  for (const f of findings) {
    const sid = classifyFinding(f);
    map.get(sid)!.push(f);
  }

  return SECTIONS.map((section) => {
    const sFindings = map.get(section.id)!;
    const topSeverity =
      sFindings.length === 0
        ? null
        : sFindings.reduce<Severity>((best, f) =>
            SEVERITY_WEIGHT[f.severity] > SEVERITY_WEIGHT[best] ? f.severity : best,
            "info"
          );
    const weight = sFindings.reduce((sum, f) => sum + SEVERITY_WEIGHT[f.severity], 0);
    return { section, findings: sFindings, topSeverity, weight };
  });
}

export function defaultSection(groups: SectionGroup[]): SectionId {
  return groups.reduce((best, g) => (g.weight > best.weight ? g : best)).section.id;
}

export const VERDICT_HEADLINE: Record<string, string> = {
  FAIL: "Not ready for legal deployment.",
  CONDITIONAL: "Remediation required before deployment.",
  PASS: "Cleared for legal deployment.",
};

export const VERDICT_SUBHEAD: Record<string, string> = {
  FAIL: "Critical security, ethics, or legal issues must be resolved before handling client data.",
  CONDITIONAL: "Notable gaps exist across one or more categories and should be addressed before launch.",
  PASS: "No critical or high-severity issues found. Continue monitoring as the codebase evolves.",
};
