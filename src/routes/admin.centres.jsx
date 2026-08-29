import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { predictWait } from "@/lib/kisan/prediction";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/admin/centres")({
  component: AdminCentresPage
});
function AdminCentresPage() {
  const { centres } = useKisan();
  const [selected, setSelected] = useState(centres[0].id);
  const centre = centres.find((c) => c.id === selected);
  const wait = predictWait({
    farmersAhead: centre.queueLength,
    avgProcessingMin: centre.avgProcessingMin,
    activeCounters: centre.activeCounters,
    hourOfDay: 11
  });
  const tone = (q) => q > 50 ? "bg-destructive" : q > 20 ? "bg-warning" : "bg-success";
  return <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Live Centre Map</h2>
        <p className="text-sm text-muted-foreground">
          Green: low queue · Amber: moderate · Red: high congestion. Select a centre for details.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface-card field-pattern relative h-[26rem] overflow-hidden p-4">
          {centres.map((c) => <button
    key={c.id}
    type="button"
    onClick={() => setSelected(c.id)}
    style={{ left: `${c.lng}%`, top: `${c.lat}%` }}
    aria-label={c.name}
    className={cn(
      "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background p-1.5 transition-transform hover:scale-125",
      tone(c.queueLength),
      selected === c.id && "scale-125 ring-2 ring-primary ring-offset-2"
    )}
  >
              <span className="block size-2.5 rounded-full bg-background/70" />
            </button>)}
          <p className="absolute bottom-3 left-4 text-xs text-muted-foreground">
            Schematic district map — {centres.length} procurement centres
          </p>
        </section>

        <section className="surface-card p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base font-bold">{centre.name}</h3>
            <StatusBadge
    status={centre.queueLength > 50 ? "High" : centre.queueLength > 20 ? "Moderate" : "Low"}
    tone={centre.queueLength > 50 ? "danger" : centre.queueLength > 20 ? "warning" : "success"}
  />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {[
    ["Location", `${centre.village}, ${centre.district}`],
    ["Queue", `${centre.queueLength} farmers`],
    ["Capacity", `${centre.todayAppointments}/${centre.capacity}`],
    ["Avg waiting time", `${wait.minutes} min`],
    ["Today's appointments", String(centre.todayAppointments)],
    ["Procurement completed", String(centre.completed)],
    ["Status", centre.open ? "Open" : "Closed"]
  ].map(([k, v]) => <div key={k} className="flex justify-between gap-3 rounded-lg bg-muted px-3 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>)}
          </dl>
        </section>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              {["Centre", "District", "Queue", "Capacity", "Counters", "Completed", "Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {centres.map((c) => <tr key={c.id} className="cursor-pointer border-t hover:bg-muted/40" onClick={() => setSelected(c.id)}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.district}</td>
                <td className="px-4 py-3">{c.queueLength}</td>
                <td className="px-4 py-3">{c.todayAppointments}/{c.capacity}</td>
                <td className="px-4 py-3">{c.activeCounters}</td>
                <td className="px-4 py-3">{c.completed}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.open ? "Open" : "Closed"} tone={c.open ? "success" : "neutral"} />
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
export {
  Route
};
