"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";

// ── Data ──────────────────────────────────────────────────────────────

const PROBLEMS = [
  "Legal AI products are being built and deployed at an unprecedented pace.",
  "Most are never reviewed for security vulnerabilities, privacy violations, or attorney ethics risk.",
  "In legal contexts, a trust failure means malpractice exposure, bar complaints, or client harm.",
];

const STEPS = [
  {
    n: "01",
    title: "Submit a repository.",
    desc: "Paste a GitHub URL. Specter fetches and filters the relevant code automatically.",
  },
  {
    n: "02",
    title: "Specter analyzes the codebase.",
    desc: "Files are triaged and routed to the appropriate audit modules.",
  },
  {
    n: "03",
    title: "Four lenses. One audit.",
    desc: "Security, privacy, AI risk, and legal ethics are evaluated against OWASP, MITRE ATLAS, and ABA standards.",
  },
  {
    n: "04",
    title: "Clear verdict. Actionable findings.",
    desc: "Every finding is cited, classified by severity, and paired with a concrete remediation path.",
  },
];

const CHECKS = [
  {
    title: "Security",
    desc: "Authentication gaps, exposed secrets, insecure endpoints, and dangerous storage configurations.",
    color: "var(--ios-blue)",
  },
  {
    title: "Privacy",
    desc: "Client data retention, cross-matter leakage, PII logging, and third-party data exposure.",
    color: "var(--ios-orange)",
  },
  {
    title: "AI Risk",
    desc: "Prompt injection, system prompt exposure, ungrounded legal outputs, and model misuse surfaces.",
    color: "var(--ios-red)",
  },
  {
    title: "Legal Ethics",
    desc: "ABA Rule compliance, attorney supervision gaps, conflicts controls, and unauthorized practice risk.",
    color: "var(--ios-green)",
  },
];

const STATS = [
  { value: "$3.11B", label: "Legal AI market", note: "2025 estimate" },
  { value: "$10.82B", label: "Projected market", note: "by 2030" },
  { value: "+9.7%", label: "Law firm tech spend", note: "YoY, 2025" },
  { value: "+10.5%", label: "Knowledge mgmt spend", note: "YoY, 2025" },
];

const WINS = [
  {
    title: "Trust Layer",
    desc: "Specter is the checkpoint before legal AI deployment — not a replacement for the attorneys who review it.",
  },
  {
    title: "Cross-Disciplinary Review",
    desc: "Security, privacy, AI risk, and legal ethics in one workflow. Not four separate reviews.",
  },
  {
    title: "Built for Legal Contexts",
    desc: "Not generic code scanning. Audit logic grounded in OWASP, MITRE ATLAS, and ABA Model Rules.",
  },
];

// ── Primitives ────────────────────────────────────────────────────────

const DISPLAY_FONT = '"Rhymes Display", Georgia, serif';

function Hr() {
  return <div style={{ height: "0.5px", background: "var(--border)", width: "100%" }} />;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.18em] uppercase mb-5" style={{ color: "var(--t4)" }}>
      {children}
    </p>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-semibold tracking-[-0.025em] leading-tight mb-3"
      style={{ fontSize: "clamp(22px, 3.5vw, 30px)", color: "var(--t1)" }}
    >
      {children}
    </h2>
  );
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[15px] leading-relaxed ${className ?? ""}`} style={{ color: "var(--t2)" }}>
      {children}
    </p>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-6 py-3 rounded-[11px] text-[14px] font-semibold tracking-[-0.01em] transition-opacity hover:opacity-75"
      style={{ background: "var(--t1)", color: "var(--bg)" }}
    >
      {children}
    </Link>
  );
}

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="w-full flex justify-center px-5 py-[72px]">
      <div className="w-full max-w-[640px]">{children}</div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function DemoPage() {
  return (
    <AppShell>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center text-center px-5"
        style={{ minHeight: "calc(74vh - 52px)", paddingTop: "80px", paddingBottom: "80px" }}
      >
        <h1
          className="leading-none mb-5"
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 300,
            fontSize: "clamp(64px, 13vw, 96px)",
            letterSpacing: "0.01em",
            color: "var(--t1)",
          }}
        >
          Specter
        </h1>

        <div className="w-10 mb-7" style={{ height: "0.5px", background: "var(--border-strong)" }} />

        <p
          className="font-medium tracking-[-0.02em] mb-4 max-w-[460px]"
          style={{ fontSize: "clamp(17px, 2.5vw, 20px)", color: "var(--t1)", lineHeight: 1.3 }}
        >
          Trust and safety auditing for legal AI products.
        </p>

        <p
          className="text-[15px] leading-relaxed mb-10 max-w-[400px]"
          style={{ color: "var(--t3)" }}
        >
          The checkpoint before legal AI deployment — evaluating security,
          privacy, AI risk, and legal ethics in a single workflow.
        </p>

        <PrimaryButton href="/">Run an Audit</PrimaryButton>
      </section>

      <Hr />

      {/* ── PROBLEM ──────────────────────────────────────────────── */}
      <Section id="problem">
        <Eyebrow>The Problem</Eyebrow>
        <SectionHead>Legal AI ships faster than it is reviewed.</SectionHead>
        <Body className="mb-10">
          The tools handling privileged client data today were often built without a structured review of their safety properties.
        </Body>

        <div>
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-4"
              style={{ borderTop: "0.5px solid var(--border)" }}
            >
              <span
                className="text-[11px] font-mono flex-shrink-0 pt-0.5"
                style={{ color: "var(--t4)" }}
              >
                0{i + 1}
              </span>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--t2)" }}>
                {p}
              </p>
            </div>
          ))}
          <div style={{ borderTop: "0.5px solid var(--border)" }} />
        </div>
      </Section>

      <Hr />

      {/* ── WORKFLOW ─────────────────────────────────────────────── */}
      <Section id="workflow">
        <Eyebrow>The Workflow</Eyebrow>
        <SectionHead>One input. One clear verdict.</SectionHead>
        <Body className="mb-10">Paste a GitHub URL. Specter handles everything else.</Body>

        <div>
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-6 py-5"
              style={{ borderTop: "0.5px solid var(--border)" }}
            >
              <span
                className="flex-shrink-0"
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 300,
                  fontSize: "20px",
                  letterSpacing: "0.01em",
                  color: "var(--t4)",
                  lineHeight: 1.2,
                  width: "32px",
                }}
              >
                {step.n}
              </span>
              <div>
                <p
                  className="text-[15px] font-medium tracking-[-0.01em] mb-1"
                  style={{ color: "var(--t1)" }}
                >
                  {step.title}
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--t3)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "0.5px solid var(--border)" }} />
        </div>
      </Section>

      <Hr />

      {/* ── COVERAGE ─────────────────────────────────────────────── */}
      <Section id="coverage">
        <Eyebrow>Audit Coverage</Eyebrow>
        <SectionHead>Four lenses. One workflow.</SectionHead>
        <Body className="mb-8">
          Specter evaluates legal AI products across the full trust surface — technical and regulatory.
        </Body>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHECKS.map((c) => (
            <div
              key={c.title}
              className="rounded-[14px] p-5 transition-colors"
              style={{
                background: "var(--surface-1)",
                borderTop: "0.5px solid var(--border)",
                borderRight: "0.5px solid var(--border)",
                borderBottom: "0.5px solid var(--border)",
                borderLeft: `3px solid ${c.color}`,
              }}
            >
              <p
                className="text-[14px] font-semibold tracking-[-0.01em] mb-2"
                style={{ color: "var(--t1)" }}
              >
                {c.title}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--t3)" }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Hr />

      {/* ── MARKET ───────────────────────────────────────────────── */}
      <Section id="market">
        <Eyebrow>Market Context</Eyebrow>
        <SectionHead>The legal AI market is accelerating.</SectionHead>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 mt-10 rounded-[16px] overflow-hidden"
          style={{ border: "0.5px solid var(--border)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="p-5"
              style={{
                background: "var(--surface-1)",
                borderRight: i < STATS.length - 1 ? "0.5px solid var(--border)" : "none",
              }}
            >
              <p
                className="leading-none mb-2"
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 300,
                  fontSize: "clamp(22px, 3.5vw, 32px)",
                  letterSpacing: "0.01em",
                  color: "var(--t1)",
                }}
              >
                {s.value}
              </p>
              <p className="text-[12px] leading-snug mb-1" style={{ color: "var(--t2)" }}>
                {s.label}
              </p>
              <p className="text-[11px]" style={{ color: "var(--t4)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Hr />

      {/* ── WHY SPECTER ──────────────────────────────────────────── */}
      <Section id="why">
        <Eyebrow>Why Specter</Eyebrow>
        <SectionHead>The audit layer legal AI has been missing.</SectionHead>

        <div className="mt-8">
          {WINS.map((w, i) => (
            <div
              key={i}
              className="py-5"
              style={{ borderTop: "0.5px solid var(--border)" }}
            >
              <p
                className="text-[15px] font-semibold tracking-[-0.01em] mb-1.5"
                style={{ color: "var(--t1)" }}
              >
                {w.title}
              </p>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--t2)" }}>
                {w.desc}
              </p>
            </div>
          ))}
          <div style={{ borderTop: "0.5px solid var(--border)" }} />
        </div>
      </Section>

      <Hr />

      {/* ── CLOSING ──────────────────────────────────────────────── */}
      <section
        className="flex flex-col items-center text-center px-5"
        style={{ paddingTop: "96px", paddingBottom: "120px" }}
      >
        <p
          className="font-medium tracking-[-0.025em] leading-snug mb-10 max-w-[440px]"
          style={{ fontSize: "clamp(22px, 3.5vw, 30px)", color: "var(--t1)" }}
        >
          Legal AI is scaling fast.
          <br />
          Specter helps make it trustworthy.
        </p>
        <PrimaryButton href="/">Launch Specter</PrimaryButton>

        <p className="text-[11px] mt-8 tracking-[-0.01em]" style={{ color: "var(--t4)" }}>
          Built at the Anthropic Hackathon · Grounded in OWASP, MITRE ATLAS, and ABA Formal Opinion 512
        </p>
      </section>

    </AppShell>
  );
}
