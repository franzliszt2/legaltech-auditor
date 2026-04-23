import { Octokit } from "@octokit/rest";
import type { RepoBundle, RepoFile, FileType } from "./types";

const HIGH_SIGNAL_PATTERNS: RegExp[] = [
  // Dependency manifests
  /^package\.json$/,
  /^package-lock\.json$/,
  /^requirements\.txt$/,
  /^pyproject\.toml$/,
  /^poetry\.lock$/,
  /^pnpm-lock\.yaml$/,
  // Env / config
  /\.env/,
  /^config\//,
  /^\.github\/workflows\//,
  // README
  /^README\.md$/i,
  // Next.js App Router API routes
  /^src\/app\/api\//,
  // Next.js Pages Router API routes
  /^pages\/api\//,
  // Auth, middleware
  /auth/i,
  /middleware/i,
  // Document / matter / client handling
  /document/i,
  /matter/i,
  /upload/i,
  /storage/i,
  /database|db\./i,
  // AI / prompt surfaces
  /prompt/i,
  /chat/i,
  /summarize|summarise/i,
  /review/i,
  /intake/i,
  /export/i,
  /agent/i,
  // Disclaimers / ToS
  /disclaimer/i,
  /terms/i,
  /privacy/i,
];

const MAX_FILES = 35;
const MAX_FILE_BYTES = 60_000;

function classifyFile(filePath: string): FileType {
  if (/requirements\.txt|package\.json|package-lock|poetry\.lock|pnpm-lock/.test(filePath))
    return "dependency";
  if (/\.(json|ya?ml|toml)$/.test(filePath) || /config|\.env/.test(filePath))
    return "config";
  if (/prompt|system.*prompt/i.test(filePath) && /\.md$|\.txt$/.test(filePath))
    return "prompt";
  if (/\.md$/.test(filePath)) return "doc";
  return "code";
}

function isHighSignal(filePath: string): boolean {
  return HIGH_SIGNAL_PATTERNS.some((p) => p.test(filePath));
}

export function parseRepoUrl(url: string): { owner: string; repo: string } {
  const match = url.trim().match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) throw new Error(`Invalid GitHub URL: ${url}`);
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

export async function fetchRepo(repoUrl: string): Promise<RepoBundle> {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: "HEAD",
    recursive: "1",
  });

  const candidates = treeData.tree
    .filter((item) => item.type === "blob" && item.path && isHighSignal(item.path))
    .slice(0, MAX_FILES);

  const files: RepoFile[] = (
    await Promise.all(
      candidates.map(async (item) => {
        try {
          const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: item.path!,
          });
          if (!("content" in data) || typeof data.content !== "string") return null;
          const content = Buffer.from(data.content, "base64").toString("utf-8");
          if (content.length > MAX_FILE_BYTES) return null;
          return {
            path: item.path!,
            content,
            type: classifyFile(item.path!),
          } satisfies RepoFile;
        } catch {
          return null;
        }
      })
    )
  ).filter((f): f is RepoFile => f !== null);

  return { repo: `${owner}/${repo}`, files };
}
