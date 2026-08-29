import { cn } from "@/lib/utils";
const TONES = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/18 text-warning-foreground border-warning/35",
  danger: "bg-destructive/12 text-destructive border-destructive/25",
  info: "bg-info/12 text-info border-info/25",
  primary: "bg-primary/12 text-primary border-primary/25"
};
const STATUS_TONE = {
  waiting: "warning",
  arrived: "info",
  processing: "primary",
  completed: "success",
  "no-show": "danger",
  pending: "neutral",
  "bill-generated": "info",
  Submitted: "info",
  "Under Review": "warning",
  Resolved: "success"
};
function StatusBadge({
  status,
  tone,
  className
}) {
  const resolved = tone ?? STATUS_TONE[status] ?? "neutral";
  const label = status.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
      TONES[resolved],
      className
    )}
  >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>;
}
export {
  StatusBadge
};
