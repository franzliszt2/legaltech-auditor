export type FileType = "code" | "config" | "prompt" | "doc" | "dependency";

export interface RepoFile {
  path: string;
  content: string;
  type: FileType;
}

export interface RepoBundle {
  repo: string;
  files: RepoFile[];
}

export interface TriageMap {
  securityPaths: string[];
  ethicsPaths: string[];
  aiRiskPaths: string[];
  notableFeatures: string[];
  probableAppType: string;
  isLegalTech: boolean;
}

export type Module = "security" | "ethics" | "ai-risk";
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type OverallScore = "PASS" | "CONDITIONAL" | "FAIL";

export interface Finding {
  id: string;
  module: Module;
  severity: Severity;
  title: string;
  description: string;
  file?: string;
  ruleReference?: string;
  remediation: string;
}

export interface AuditReport {
  repo: string;
  timestamp: string;
  overallScore: OverallScore;
  summary: string;
  findings: Finding[];
}

export type ProgressStage =
  | "fetch"
  | "triage"
  | "security"
  | "ethics"
  | "ai-risk"
  | "assembly"
  | "complete"
  | "error";

export interface ProgressEvent {
  stage: ProgressStage;
  message: string;
  report?: AuditReport;
  error?: string;
}
