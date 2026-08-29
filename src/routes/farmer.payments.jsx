import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, IndianRupee } from "@/lib/kisan/icons";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/farmer/payments")({
  component: PaymentsPage
});
const inr = (n) => `\u20B9${n.toLocaleString("en-IN")}`;
function PaymentsPage() {
  const { currentProcurement, booking, markPaymentCompleted } = useKisan();
  if (!currentProcurement) {
    return <div className="surface-card mx-auto max-w-lg p-8 text-center">
        <IndianRupee className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-3 font-display text-lg font-bold">No payment in progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your payment summary appears here once the operator completes procurement for token{" "}
          {booking.token}. Past payments are available under History.
        </p>
      </div>;
  }
  const p = currentProcurement;
  const steps = [
    { label: "Procurement completed", done: true },
    { label: "Bill generated", done: true },
    { label: "Payment initiated", done: true },
    { label: "Payment completed", done: p.paymentStatus === "completed" }
  ];
  return <div className="mx-auto max-w-2xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Procurement Payment</h2>
          <p className="text-sm text-muted-foreground">{p.id} · {p.centreName}</p>
        </div>
        <StatusBadge status={p.paymentStatus} />
      </header>

      <section className="surface-card divide-y p-0">
        {[
    ["Crop", p.crop],
    ["Quantity", `${p.quantity} quintals`],
    ["MSP / Rate", `${inr(p.ratePerQuintal)} per quintal`],
    ["Gross amount", inr(p.gross)],
    ["Deductions", `\u2212 ${inr(p.deductions)}`]
  ].map(([k, v]) => <div key={k} className="flex items-center justify-between px-4 py-3 text-sm sm:px-5">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-semibold">{v}</span>
          </div>)}
        <div className="flex items-center justify-between bg-primary/8 px-4 py-4 sm:px-5">
          <span className="font-semibold">Net payable</span>
          <span className="font-display text-2xl font-bold text-primary">{inr(p.net)}</span>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <h3 className="font-display text-sm font-bold">Payment timeline</h3>
        <ol className="mt-3 space-y-3">
          {steps.map((s) => <li key={s.label} className="flex items-center gap-3 text-sm">
              <CheckCircle2
    className={cn("size-4", s.done ? "text-success" : "text-muted-foreground/50")}
  />
              <span className={cn(!s.done && "text-muted-foreground")}>{s.label}</span>
            </li>)}
        </ol>
        {p.txnId && <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs">
            Transaction ID: <strong>{p.txnId}</strong>
          </p>}
        {p.paymentStatus !== "completed" && <Button className="mt-4 w-full" onClick={markPaymentCompleted}>
            Simulate payment settlement
          </Button>}
      </section>
    </div>;
}
export {
  Route
};
