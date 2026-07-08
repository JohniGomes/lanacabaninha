const ACCENTS = {
  pink: "bg-pink/40 text-pink-dark",
  lilac: "bg-lilac/40 text-lilac-dark",
  mint: "bg-mint/40 text-mint-dark",
} as const;

export function StatCard({
  icon,
  label,
  value,
  hint,
  accent = "pink",
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
  accent?: keyof typeof ACCENTS;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm border border-border">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${ACCENTS[accent]}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="truncate text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
}
