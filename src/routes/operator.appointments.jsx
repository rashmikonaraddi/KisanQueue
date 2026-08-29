import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/operator/appointments")({
  component: AppointmentsPage
});
function AppointmentsPage() {
  const { queue } = useKisan();
  const groups = [
    { label: "Waiting", rows: queue.filter((q) => q.status === "waiting") },
    { label: "Arrived / Processing", rows: queue.filter((q) => q.status === "arrived" || q.status === "processing") },
    { label: "Completed", rows: queue.filter((q) => q.status === "completed") },
    { label: "No-show", rows: queue.filter((q) => q.status === "no-show") }
  ];
  return <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Today's Appointments</h2>
        <p className="text-sm text-muted-foreground">{queue.length} booked slots across all counters.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((g) => <section key={g.label} className="surface-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold">{g.label}</h3>
              <span className="text-sm font-semibold text-muted-foreground">{g.rows.length}</span>
            </div>
            <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
              {g.rows.slice(0, 30).map((q) => <li key={q.token} className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-sm">
                  <span className="font-display w-16 font-bold">{q.token}</span>
                  <span className="min-w-0 flex-1 truncate">{q.farmerName} · {q.crop} {q.quantity}Q</span>
                  <StatusBadge status={q.status} />
                </li>)}
              {g.rows.length === 0 && <li className="px-1 py-4 text-sm text-muted-foreground">No farmers in this state right now.</li>}
            </ul>
          </section>)}
      </div>
    </div>;
}
export {
  Route
};
