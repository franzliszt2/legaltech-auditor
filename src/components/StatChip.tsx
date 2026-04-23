interface Props {
  count: number;
  label: string;
  valueColor?: string;
}

export function StatChip({ count, label, valueColor = "text-white/80" }: Props) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[52px]">
      <span className={`text-[22px] font-semibold tabular-nums leading-none tracking-tight ${valueColor}`}>
        {count}
      </span>
      <span className="text-[11px] text-white/35 tracking-wide">{label}</span>
    </div>
  );
}
