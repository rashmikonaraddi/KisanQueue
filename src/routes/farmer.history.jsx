import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Download } from "@/lib/kisan/icons";
import { CROPS } from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/farmer/history")({
  component: HistoryPage
});
const inr = (n) => `\u20B9${n.toLocaleString("en-IN")}`;
function HistoryPage() {
  const { history } = useKisan();
  const [crop, setCrop] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const rows = history.filter(
    (h) => (crop === "all" || h.crop === crop) && (status === "all" || h.paymentStatus === status) && (!from || h.date >= from)
  );
  function exportCsv() {
    const csv = [
      "Date,Centre,Crop,Quantity,Procurement,Payment,Amount",
      ...rows.map(
        (r) => [r.date, r.centreName, r.crop, r.quantity, r.procurementStatus, r.paymentStatus, r.net].join(",")
      )
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kisanqueue-procurement-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded", { description: `${rows.length} records exported.` });
  }
  return <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Procurement History</h2>
          <p className="text-sm text-muted-foreground">All your past procurements and payments.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCsv}>
          <Download className="size-4" /> Download report
        </Button>
      </header>

      <section className="surface-card grid gap-3 p-4 sm:grid-cols-3">
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
        <Select value={crop} onValueChange={setCrop}>
          <SelectTrigger aria-label="Crop filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All crops</SelectItem>
            {CROPS.map((c) => <SelectItem key={c} value={c}>
                {c}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="Payment status filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="bill-generated">Bill generated</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {rows.length === 0 ? <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          No procurement records match these filters.
        </div> : <>
          <div className="surface-card hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  {["Date", "Centre", "Crop", "Quantity", "Procurement", "Payment", "Amount"].map((h) => <th key={h} className="px-4 py-2.5 text-left font-semibold">
                      {h}
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => <tr key={r.id} className="border-t">
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3">{r.centreName}</td>
                    <td className="px-4 py-3">{r.crop}</td>
                    <td className="px-4 py-3">{r.quantity} Q</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.procurementStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 font-semibold">{inr(r.net)}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {rows.map((r) => <article key={r.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {r.crop} · {r.quantity} Q
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.date} · {r.centreName}
                    </p>
                  </div>
                  <p className="font-display font-bold">{inr(r.net)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={r.procurementStatus} />
                  <StatusBadge status={r.paymentStatus} />
                </div>
              </article>)}
          </div>
        </>}
    </div>;
}
export {
  Route
};
