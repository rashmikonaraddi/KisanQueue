import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "@/lib/kisan/icons";
import { ADMIN_ALERTS } from "@/lib/kisan/demo-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/admin/alerts")({
  component: AdminAlertsPage
});
const LEVEL = {
  high: "border-destructive/40 bg-destructive/8 text-destructive",
  medium: "border-warning/40 bg-warning/10 text-warning-foreground",
  low: "border-info/40 bg-info/8 text-info"
};
function AdminAlertsPage() {
  return <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Smart Alerts</h2>
        <p className="text-sm text-muted-foreground">
          Generated automatically from live capacity, processing speed and payment ageing.
        </p>
      </header>
      <ul className="space-y-3">
        {ADMIN_ALERTS.map((a) => <li key={a.title + a.message} className={cn("surface-card flex gap-3 border p-4", LEVEL[a.level])}>
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">{a.title}</p>
              <p className="mt-0.5 text-sm text-foreground/80">{a.message}</p>
            </div>
          </li>)}
      </ul>
    </div>;
}
export {
  Route
};
