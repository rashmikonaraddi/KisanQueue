import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { Button } from "@/components/ui/button";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/operator/payments")({
  component: OperatorPaymentsPage
});
const inr = (n) => `\u20B9${n.toLocaleString("en-IN")}`;
function OperatorPaymentsPage() {
  const { currentProcurement, history, markPaymentCompleted } = useKisan();
  const rows = currentProcurement ? [currentProcurement, ...history] : history;
  return <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Payment Status</h2>
          <p className="text-sm text-muted-foreground">Bills generated at this centre and their settlement state.</p>
        </div>
        {currentProcurement && currentProcurement.paymentStatus !== "completed" && <Button onClick={markPaymentCompleted}>Settle pending payment</Button>}
      </header>

      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[38rem] text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              {["Bill", "Date", "Crop", "Quantity", "Net amount", "Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => <tr key={r.id} className="border-t">
                <td className="px-4 py-3 font-medium">{r.id}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.crop}</td>
                <td className="px-4 py-3">{r.quantity} Q</td>
                <td className="px-4 py-3 font-semibold">{inr(r.net)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.paymentStatus} /></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
export {
  Route
};
