import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { CheckCircle2, Clock } from "@/lib/kisan/icons";
import { STAGE_ORDER, useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/farmer/procurement")({
  component: ProcurementPage
});
const LABELS = {
  booked: "Slot Booked",
  arrived: "Farmer Arrived",
  called: "Token Called",
  started: "Procurement Started",
  quality: "Quality Verification",
  quantity: "Quantity Recorded",
  completed: "Procurement Completed",
  "payment-processing": "Payment Processing",
  "payment-completed": "Payment Completed"
};
function ProcurementPage() {
  const { stageIndex, booking, centres, currentProcurement, myEntry } = useKisan();
  const centre = centres.find((c) => c.id === booking.centreId) ?? centres[0];
  return <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Procurement Status</h2>
        <p className="text-sm text-muted-foreground">
          Token {booking.token} · {centre.name}
        </p>
      </header>

      <section className="surface-card grid gap-3 p-4 sm:grid-cols-4 sm:p-5">
        <div>
          <p className="text-xs text-muted-foreground">Crop</p>
          <p className="font-semibold">{booking.crop}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Quantity</p>
          <p className="font-semibold">
            {currentProcurement?.quantity ?? booking.quantity} quintals
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Quality grade</p>
          <p className="font-semibold">{currentProcurement?.qualityGrade ?? myEntry.qualityGrade ?? "\u2014"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current status</p>
          <StatusBadge status={myEntry.status} />
        </div>
      </section>

      <section className="surface-card p-4 sm:p-6">
        <ol className="relative space-y-0">
          {STAGE_ORDER.map((s, i) => {
    const done = i < stageIndex;
    const active = i === stageIndex;
    return <li key={s} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
        done && "border-success bg-success/15 text-success",
        active && "border-primary bg-primary/15 text-primary",
        !done && !active && "border-border text-muted-foreground"
      )}
    >
                    {done ? <CheckCircle2 className="size-4" /> : active ? <Clock className="size-4" /> : i + 1}
                  </span>
                  {i < STAGE_ORDER.length - 1 && <span className={cn("mt-1 w-0.5 flex-1", done ? "bg-success/50" : "bg-border")} />}
                </div>
                <div className="pt-1">
                  <p
      className={cn(
        "text-sm font-semibold",
        !done && !active && "text-muted-foreground"
      )}
    >
                    {LABELS[s]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {done ? "Completed" : active ? "In progress" : "Pending"}
                  </p>
                </div>
              </li>;
  })}
        </ol>
      </section>
    </div>;
}
export {
  Route
};
