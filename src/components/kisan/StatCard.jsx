import { cn } from "@/lib/utils";
function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  className
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    info: "bg-info/10 text-info",
    danger: "bg-destructive/10 text-destructive"
  }[tone];
  return <div className={cn("surface-card p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
          <p className="mt-1.5 font-display text-2xl font-bold sm:text-[1.75rem]">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", toneClass)}>
            <Icon className="size-5" />
          </span>}
      </div>
    </div>;
}
export {
  StatCard
};
