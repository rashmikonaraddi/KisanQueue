import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { StatCard } from "@/components/kisan/StatCard";
import { Gauge, Timer, Users } from "@/lib/kisan/icons";
import { MY_CENTRE_ID, PROCUREMENT_TREND, WAIT_TREND } from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/operator/analytics")({
  component: CentreAnalyticsPage
});
function CentreAnalyticsPage() {
  const { centres, queue } = useKisan();
  const centre = centres.find((c) => c.id === MY_CENTRE_ID);
  const utilisation = Math.round(centre.todayAppointments / centre.capacity * 100);
  return <div className="space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Centre Analytics</h2>
        <p className="text-sm text-muted-foreground">{centre.name}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Capacity utilisation" value={`${utilisation}%`} icon={Gauge} />
        <StatCard label="Avg processing" value={`${centre.avgProcessingMin} min`} icon={Timer} tone="info" />
        <StatCard label="Farmers in queue" value={queue.filter((q) => q.status === "waiting").length} icon={Users} tone="accent" />
      </div>

      <section className="surface-card p-4 sm:p-5">
        <h3 className="font-display text-sm font-bold">Procurement volume (quintals)</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PROCUREMENT_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="quintals" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <h3 className="font-display text-sm font-bold">Average waiting time by hour</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WAIT_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>;
}
export {
  Route
};
