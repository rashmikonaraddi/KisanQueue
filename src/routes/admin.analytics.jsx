import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "@/lib/kisan/icons";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage
});
function AdminAnalyticsPage() {
  const { centres } = useKisan();
  const utilisation = centres.map((c) => ({
    name: c.name.replace(" Procurement Centre", "").replace(" Centre", ""),
    percent: Math.round(c.todayAppointments / c.capacity * 100)
  }));
  function exportReport() {
    const csv = ["Centre,Utilisation %", ...utilisation.map((u) => `${u.name},${u.percent}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kisanqueue-centre-utilisation.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report generated", { description: `${utilisation.length} centres exported.` });
  }
  return <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Centre Utilisation Analytics</h2>
          <p className="text-sm text-muted-foreground">Share of daily capacity consumed by today's bookings.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportReport}>
          <Download className="size-4" /> Generate report
        </Button>
      </header>

      <section className="surface-card p-4 sm:p-5">
        <div className="h-[30rem]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilisation} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
              <XAxis type="number" domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={150} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="percent" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>;
}
export {
  Route
};
