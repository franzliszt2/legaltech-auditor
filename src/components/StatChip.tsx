import { cn } from "@/lib/cn";

interface Props {
  count: number;
  label: string;
  color?: string;
}

export function StatChip({ count, label, color = "text-white/60" }: Props) {
  return (
    <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-white/4 border border-white/8 min-w-[72px]">
      <span className={cn("text-2xl font-bold font-mono leading-none", color)}>{count}</span>
      <span className="text-[11px] text-white/35 mt-1 tracking-wide">{label}</span>
    </div>
  );
}
