import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { DemoControls } from "@/components/kisan/DemoControls";
import { StatCard } from "@/components/kisan/StatCard";
import {
  Building2,
  Clock,
  IndianRupee,
  Layers,
  Sparkles,
  Users
} from "@/lib/kisan/icons";
import {
  DISTRICT_VOLUME,
  PAYMENT_STATUS_SPLIT,
  PROCUREMENT_TREND,
  WAIT_TREND
} from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/admin/")({
  component: AdminDashboard
});
const PIE_COLORS = ["var(--color-primary)", "var(--color-info)", "var(--color-accent)", "var(--color-destructive)"];
function AdminDashboard() {
  const { centres } = useKisan();
  const totalAppointments = centres.reduce((s, c) => s + c.todayAppointments, 0);
  const totalCompleted = centres.reduce((s, c) => s + c.completed, 0);
  const activeCentres = centres.filter((c) => c.open).length;
  return <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Live Operations Overview</h2>
          <p className="text-sm text-muted-foreground">Karnataka · all districts · today</p>
        </div>
        <DemoControls compact />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total farmers" value="12,840" icon={Users} />
        <StatCard label="Today's procurement" value={totalCompleted.toLocaleString("en-IN")} icon={Layers} tone="info" />
        <StatCard label="Total quantity" value="61,780 Q" icon={Layers} tone="accent" />
        <StatCard label="Avg waiting time" value="42 min" icon={Clock} />
        <StatCard label="Pending payments" value="₹4.2 Cr" icon={IndianRupee} tone="danger" />
        <StatCard label="Active centres" value={`${activeCentres}/${centres.length}`} icon={Building2} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-4 sm:p-5">
          <h3 className="font-display text-sm font-bold">Procurement trend</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PROCUREMENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="quintals" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-4 sm:p-5">
          <h3 className="font-display text-sm font-bold">District-wise procurement</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_VOLUME}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="district" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="quintals" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-4 sm:p-5">
          <h3 className="font-display text-sm font-bold">Average waiting time</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WAIT_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="hour" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="minutes" stroke="var(--color-info)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-4 sm:p-5">
          <h3 className="font-display text-sm font-bold">Payment status distribution</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PAYMENT_STATUS_SPLIT} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {PAYMENT_STATUS_SPLIT.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="surface-card border-warning/40 bg-warning/8 p-4 sm:p-5">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold">
          <Sparkles className="size-4 text-primary" /> Centre Congestion Prediction
        </h3>
        <p className="mt-2 text-sm">
          ⚠️ Mysuru Central Procurement Centre may reach high congestion between 11:00 AM and 1:00 PM.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>84 scheduled farmers in that window</li>
          <li>Historical peak period for this centre</li>
          <li>Only 2 active counters</li>
          <li>Expected processing load above sustainable throughput</li>
        </ul>
        <p className="mt-3 rounded-lg bg-background px-3 py-2 text-sm font-medium">
          Recommendation: redirect approximately 15 farmers to Nanjangud Taluk Centre — average waiting time
          drops by an estimated 28%.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Showing {totalAppointments.toLocaleString("en-IN")} appointments across {centres.length} centres.
      </p>
    </div>;
}
export {
  Route
};
