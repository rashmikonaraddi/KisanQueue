import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, MapPin, Sparkles } from "@/lib/kisan/icons";
import { centreScore, predictWait } from "@/lib/kisan/prediction";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";

const Route = createFileRoute("/farmer/centres")({
  component: CentresPage
});

function CentresPage() {
  const navigate = useNavigate();
  const { centres, booking, setBooking } = useKisan();
  const scored = centres.map((c) => {
    const wait = predictWait({
      farmersAhead: c.queueLength,
      avgProcessingMin: c.avgProcessingMin,
      activeCounters: c.activeCounters,
      hourOfDay: 11
    });
    return { centre: c, wait, score: centreScore({ ...c, waitMinutes: wait.minutes }) };
  }).sort((a, b) => a.score - b.score);
  const best = scored.find((s) => s.centre.open);

  const handleSelectCentre = (c) => {
    setBooking({ ...booking, centreId: c.id });
    toast.success("Centre selected", { description: `${c.name} selected. Please choose your slot.` });
    void navigate({ to: "/farmer/book" });
  };

  return <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Find the Best Procurement Centre</h2>
          <p className="text-sm text-muted-foreground">
            Ranked using distance, live queue length, predicted waiting time and centre capacity.
          </p>
        </div>
      </header>

      {best && <section className="surface-card border-primary/40 bg-primary/6 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase">
              <Sparkles className="size-4" /> Recommended for you
            </p>
            <Button size="sm" className="gap-1.5" onClick={() => handleSelectCentre(best.centre)}>
              <CalendarCheck className="size-4" /> Book at {best.centre.name.split(" ")[0]}
            </Button>
          </div>
          <h3 className="mt-1.5 font-display text-lg font-bold">{best.centre.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {best.centre.distanceKm} km away · {best.centre.queueLength} farmers in queue · about{" "}
            {best.wait.minutes} minutes of waiting. Choosing this centre saves you roughly{" "}
            {Math.max(
    0,
    (scored.find((s) => s.centre.id === booking.centreId)?.wait.minutes ?? 0) - best.wait.minutes
  )}{" "}
            minutes compared with your current centre.
          </p>
        </section>}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {scored.map(({ centre: c, wait }) => {
    const status = !c.open ? "Closed" : c.queueLength > 50 ? "High Queue" : c.queueLength > 20 ? "Moderate" : "Low Queue";
    const tone = !c.open ? "neutral" : c.queueLength > 50 ? "danger" : c.queueLength > 20 ? "warning" : "success";
    const isSelected = c.id === booking.centreId;
    return <article
      key={c.id}
      className={cn("surface-card flex flex-col justify-between p-4", isSelected && "border-primary ring-1 ring-primary/30")}
    >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-bold">{c.name}</h3>
                  <StatusBadge status={status} tone={tone} />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {c.village}, {c.district} · {c.distanceKm} km
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <dt className="text-[11px] text-muted-foreground">Queue</dt>
                    <dd className="font-semibold">{c.queueLength} farmers</dd>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <dt className="text-[11px] text-muted-foreground">Est. wait</dt>
                    <dd className="font-semibold">{wait.minutes} min</dd>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <dt className="text-[11px] text-muted-foreground">Capacity</dt>
                    <dd className="font-semibold">
                      {c.todayAppointments}/{c.capacity}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <dt className="text-[11px] text-muted-foreground">Slots left</dt>
                    <dd className="font-semibold">{Math.max(0, c.capacity - c.todayAppointments)}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-muted-foreground">Accepting: {c.crops.join(", ")}</p>
              </div>
              <Button
      className="mt-4 w-full gap-1.5"
      variant={isSelected ? "secondary" : "default"}
      disabled={!c.open}
      onClick={() => handleSelectCentre(c)}
    >
                <CalendarCheck className="size-4" />
                {isSelected ? "Book Slot (Current Centre)" : c.open ? "Book Here" : "Closed Today"}
              </Button>
            </article>;
  })}
      </div>
    </div>;
}
export {
  Route
};
