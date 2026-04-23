"use client";

import { cn } from "@/lib/cn";
import type { SectionGroup, SectionId } from "@/lib/sections";

interface Props {
  groups: SectionGroup[];
  active: SectionId;
  onChange: (id: SectionId) => void;
}

export function AuditSectionTabs({ groups, active, onChange }: Props) {
  return (
    <div
      className="flex p-1 rounded-[12px] gap-0.5"
      style={{
        background: "var(--tab-bg)",
        border: "0.5px solid var(--tab-border)",
      }}
    >
      {groups.map(({ section, findings }) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onChange(section.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-all duration-150 tracking-[-0.01em]",
            )}
            style={{
              background: isActive ? "var(--tab-selected)" : "transparent",
              color: isActive ? "var(--t1)" : "var(--t3)",
            }}
          >
            <span>{section.label}</span>
            {findings.length > 0 && (
              <span
                className="text-[11px] tabular-nums"
                style={{ color: isActive ? "var(--t3)" : "var(--t4)" }}
              >
                {findings.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
