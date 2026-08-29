import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoControls } from "@/components/kisan/DemoControls";
import { StatCard } from "@/components/kisan/StatCard";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle2, Clock, Users } from "@/lib/kisan/icons";
import { MY_CENTRE_ID } from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/operator/")({
  component: OperatorDashboard
});
function OperatorDashboard() {
  const { queue, centres, currentServing, operatorAction, lastUpdated } = useKisan();
  const centre = centres.find((c) => c.id === MY_CENTRE_ID);
  const counts = {
    waiting: queue.filter((q) => q.status === "waiting").length,
    processing: queue.filter((q) => q.status === "processing" || q.status === "arrived").length,
    completed: queue.filter((q) => q.status === "completed").length,
    noShow: queue.filter((q) => q.status === "no-show").length
  };
  const upcoming = queue.filter((q) => Number(q.token.split("-")[1]) >= currentServing && q.status !== "completed").slice(0, 8);
  return <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">{centre.name}</h2>
          <p className="text-sm text-muted-foreground">
            Counter status as of{" "}
            {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </p>
        </div>
        <DemoControls compact />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Today's appointments" value={centre.todayAppointments} icon={Users} />
        <StatCard label="Waiting" value={counts.waiting} icon={Clock} tone="accent" />
        <StatCard label="Processing" value={counts.processing} icon={Activity} tone="info" />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} />
        <StatCard label="No-show" value={counts.noShow} icon={Users} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold">Next in queue</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/operator/queue">Open full queue</Link>
            </Button>
          </div>
          <ul className="mt-3 divide-y">
            {upcoming.map((q) => <li key={q.token} className="flex flex-wrap items-center gap-3 py-3">
                <span className="font-display w-16 font-bold">{q.token}</span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {q.farmerName} · {q.crop} {q.quantity}Q
                </span>
                <StatusBadge status={q.status} />
                <Button size="sm" variant="outline" onClick={() => operatorAction(q.token, "call")}>
                  Call
                </Button>
              </li>)}
          </ul>
        </section>

        <section className="surface-card p-4">
          <h3 className="font-display text-sm font-bold">Centre snapshot</h3>
          <dl className="mt-3 space-y-2 text-sm">
            {[
    ["Current token", `A-${String(currentServing).padStart(3, "0")}`],
    ["Daily capacity", `${centre.todayAppointments}/${centre.capacity}`],
    ["Active counters", String(centre.activeCounters)],
    ["Average processing", `${centre.avgProcessingMin} min/farmer`],
    ["Crops accepted", centre.crops.join(", ")]
  ].map(([k, v]) => <div key={k} className="flex justify-between gap-3 rounded-lg bg-muted px-3 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>)}
          </dl>
        </section>
      </div>
    </div>;
}
export {
  Route
};
