import { cn } from "@/lib/cn";
import type { SectionGroup, SectionId } from "@/lib/sections";
import type { Severity } from "@/lib/types";

const SEVERITY_DOT: Record<Severity, string> = {
  critical: "bg-red-400",
  high:     "bg-orange-400",
  medium:   "bg-amber-400",
  low:      "bg-blue-400",
  info:     "bg-zinc-500",
};

interface Props {
  groups: SectionGroup[];
  active: SectionId;
  onChange: (id: SectionId) => void;
}

export function AuditSectionTabs({ groups, active, onChange }: Props) {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {groups.map(({ section, findings, topSeverity }) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onChange(section.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-white/10 border-white/25 text-white shadow-sm"
                : "bg-transparent border-white/8 text-white/45 hover:text-white/70 hover:border-white/15"
            )}
          >
            {topSeverity && (
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", SEVERITY_DOT[topSeverity])} />
            )}
            {section.label}
            {findings.length > 0 && (
              <span
                className={cn(
                  "ml-0.5 text-xs font-mono",
                  isActive ? "text-white/50" : "text-white/30"
                )}
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
