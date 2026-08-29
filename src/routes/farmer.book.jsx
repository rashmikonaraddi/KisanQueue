import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CalendarCheck, CheckCircle2, Download, ListOrdered } from "@/lib/kisan/icons";
import { CROPS } from "@/lib/kisan/demo-data";
import { useI18n } from "@/lib/kisan/i18n";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/farmer/book")({
  component: BookSlotPage
});
const SLOTS = [
  { label: "09:00 - 10:00", period: "Morning", state: "full" },
  { label: "10:00 - 11:00", period: "Morning", state: "almost" },
  { label: "11:00 - 12:00", period: "Morning", state: "available" },
  { label: "12:00 - 01:00", period: "Afternoon", state: "available" },
  { label: "01:00 - 02:00", period: "Afternoon", state: "almost" },
  { label: "02:00 - 03:00", period: "Afternoon", state: "available" }
];
const STATE_LABEL = {
  available: "Available",
  almost: "Almost Full",
  full: "Full"
};
function BookSlotPage() {
  const { t } = useI18n();
  const { centres, booking, setBooking, pushNotification } = useKisan();
  const [crop, setCrop] = useState(booking.crop);
  const [quantity, setQuantity] = useState(String(booking.quantity));
  const [centreId, setCentreId] = useState(booking.centreId);
  const [date, setDate] = useState(booking.date);
  const [slot, setSlot] = useState(booking.timeSlot?.includes("–") ? booking.timeSlot.replace(" – ", " - ") : "11:00 - 12:00");
  const [confirmed, setConfirmed] = useState(false);
  const centre = centres.find((c) => c.id === centreId) ?? centres[0];

  function confirm() {
    if (!slot) {
      toast.error("Select a time slot to continue");
      return;
    }
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      toast.error("Enter a valid quantity in quintals");
      return;
    }
    const formattedSlot = slot.replace(" - ", " – ");
    setBooking((prev) => ({
      ...prev,
      crop,
      quantity: qty,
      centreId,
      date,
      timeSlot: formattedSlot
    }));
    setConfirmed(true);
    pushNotification({
      kind: "slot",
      title: "Slot Confirmed",
      message: `Token ${booking.token} confirmed for ${qty} quintals of ${crop} at ${centre.name} (${formattedSlot}).`
    });
  }

  if (confirmed) {
    return <div className="mx-auto max-w-lg space-y-5">
        <section className="surface-card p-6 text-center shadow-lg">
          <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground">Slot Confirmed</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your appointment has been registered with {centre.name}.
          </p>
          <dl className="mt-5 space-y-2.5 text-left text-sm">
            {[
              ["Token", booking.token],
              ["Date", new Date(date).toDateString()],
              ["Time Slot", slot ? slot.replace(" - ", " – ") : booking.timeSlot],
              ["Centre", centre.name],
              ["Crop", crop],
              ["Quantity", `${quantity} quintals`]
            ].map(([k, v]) => <div key={k} className="flex justify-between items-center gap-4 rounded-xl bg-muted/80 px-3.5 py-2.5">
                <dt className="text-muted-foreground font-medium">{k}</dt>
                <dd className="text-right font-bold text-foreground">{v}</dd>
              </div>)}
          </dl>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <Button
              variant="outline"
              className="gap-2 h-11"
              onClick={() => toast.success("Added to calendar", {
                description: `${new Date(date).toDateString()} · ${slot}`
              })}
            >
              <Download className="size-4" /> Add to Calendar
            </Button>
            <Button asChild className="gap-2 h-11 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/farmer/queue">
                <ListOrdered className="size-4" /> View My Queue
              </Link>
            </Button>
          </div>
        </section>
      </div>;
  }
  return <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">{t("book.title")}</h2>
        <p className="text-sm text-muted-foreground">
          Slots are generated from the centre's daily capacity and existing bookings.
        </p>
      </header>

      <section className="surface-card space-y-4 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Crop</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map((c) => <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qty">Quantity (quintals)</Label>
            <Input
    id="qty"
    type="number"
    min={1}
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
  />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Procurement centre</Label>
            <Select value={centreId} onValueChange={setCentreId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {centres.filter((c) => c.open).map((c) => <SelectItem key={c.id} value={c.id}>
                      {c.name} · {c.queueLength} in queue
                    </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <h3 className="font-display text-sm font-bold">Available slots</h3>
        <div className="mt-3 space-y-4">
          {["Morning", "Afternoon"].map((period) => <div key={period}>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {period}
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {SLOTS.filter((s) => s.period === period).map((s) => {
    const disabled = s.state === "full";
    const active = slot === s.label;
    return <button
      key={s.label}
      type="button"
      disabled={disabled}
      onClick={() => setSlot(s.label)}
      className={cn(
        "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
        disabled && "cursor-not-allowed border-dashed opacity-60",
        active ? "border-primary bg-primary/10" : "hover:border-primary/50"
      )}
    >
                      <span className="block font-semibold">{s.label}</span>
                      <span
      className={cn(
        "text-xs",
        s.state === "available" && "text-success",
        s.state === "almost" && "text-warning-foreground",
        s.state === "full" && "text-destructive"
      )}
    >
                        {STATE_LABEL[s.state]}
                      </span>
                    </button>;
  })}
              </div>
            </div>)}
        </div>
      </section>

      <Button size="lg" className="w-full gap-2" onClick={confirm}>
        <CalendarCheck className="size-5" /> Confirm booking
      </Button>
    </div>;
}
export {
  Route
};
