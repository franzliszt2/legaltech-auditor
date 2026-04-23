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
        background: "rgba(255,255,255,0.07)",
        border: "0.5px solid rgba(255,255,255,0.09)",
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
              isActive
                ? "bg-white/12 text-white shadow-sm"
                : "text-white/38 hover:text-white/60"
            )}
          >
            <span>{section.label}</span>
            {findings.length > 0 && (
              <span className={cn(
                "text-[11px] tabular-nums",
                isActive ? "text-white/45" : "text-white/22"
              )}>
                {findings.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
