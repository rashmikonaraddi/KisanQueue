import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Edit3,
  MapPin,
  Ticket,
  Users,
  Wheat
} from "@/lib/kisan/icons";
import { CROPS } from "@/lib/kisan/demo-data";
import { useI18n } from "@/lib/kisan/i18n";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";

const Route = createFileRoute("/farmer/queue")({
  component: LiveQueuePage
});

function LiveQueuePage() {
  const { t } = useI18n();
  const {
    queue,
    currentServing,
    booking,
    centres,
    farmersAhead,
    prediction,
    lastUpdated,
    updateBooking,
    updateQuantity
  } = useKisan();

  const [editOpen, setEditOpen] = useState(false);
  const [editQty, setEditQty] = useState(String(booking.quantity));
  const [editCrop, setEditCrop] = useState(booking.crop);

  const centre = centres.find((c) => c.id === booking.centreId) ?? centres[0];
  const myTokenNumber = booking.token;
  const myIndex = Number(myTokenNumber.split("-")[1]) || 47;

  const visible = queue.filter((q) => {
    const i = Number(q.token.split("-")[1]);
    return i >= currentServing && i <= myIndex + 4;
  });

  const perFarmer = centre.avgProcessingMin / Math.max(1, centre.activeCounters);

  const handleSaveQuantity = (e) => {
    e.preventDefault();
    const qty = Number(editQty);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity in quintals");
      return;
    }
    updateBooking({ quantity: qty, crop: editCrop });
    toast.success("Quantity updated successfully!", {
      description: `Your token ${booking.token} is now set to ${qty} quintals of ${editCrop}.`
    });
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {t("queue.title")}
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <MapPin className="size-3.5 text-primary" /> {centre.name} · {centre.village}, {centre.district}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Synced
          </span>
          <p className="text-xs text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true
            })}
          </p>
        </div>
      </header>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {/* Token Card */}
        <div className="surface-card p-4.5 bg-gradient-to-br from-card to-primary/5 border-primary/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{t("queue.yours")}</p>
            <Ticket className="size-4 text-primary" />
          </div>
          <p className="font-display text-3xl font-extrabold text-primary mt-1">{booking.token}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">{centre.name}</p>
        </div>

        {/* Quantity & Crop Card with Quick Edit */}
        <div className="surface-card p-4.5 relative group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Your Quantity</p>
            <Wheat className="size-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="font-display text-3xl font-extrabold text-foreground">
              {booking.quantity} <span className="text-sm font-semibold text-muted-foreground">Q</span>
            </p>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {booking.crop}
            </span>
          </div>
          <button
            onClick={() => {
              setEditQty(String(booking.quantity));
              setEditCrop(booking.crop);
              setEditOpen(true);
            }}
            className="mt-1 text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="size-3" /> Change Quantity
          </button>
        </div>

        {/* Farmers Ahead */}
        <div className="surface-card p-4.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{t("common.farmersAhead")}</p>
            <Users className="size-4 text-blue-500" />
          </div>
          <p className="font-display text-3xl font-extrabold text-foreground mt-1">{farmersAhead}</p>
          <p className="text-xs text-muted-foreground mt-1">Currently serving: A-{String(currentServing).padStart(3, "0")}</p>
        </div>

        {/* Est Wait Time */}
        <div className="surface-card p-4.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{t("common.estWait")}</p>
            <Clock className="size-4 text-emerald-500" />
          </div>
          <p className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {prediction.minutes} <span className="text-sm font-semibold text-muted-foreground">{t("common.minutes")}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Slot: {booking.timeSlot}</p>
        </div>
      </div>

      {/* Active Booking Spotlight & Actions */}
      <section className="surface-card p-5 bg-card/80 border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarCheck className="size-4" />
              </span>
              <h3 className="font-display text-base font-bold text-foreground">
                Confirmed Appointment Details
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Token <strong className="text-foreground">{booking.token}</strong> ·{" "}
              {booking.crop} (<strong className="text-primary font-bold">{booking.quantity} Quintals</strong>) ·{" "}
              Date: <strong className="text-foreground">{new Date(booking.date).toDateString()}</strong> ·{" "}
              Slot: <strong className="text-foreground">{booking.timeSlot}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
                  <Edit3 className="size-3.5" /> Edit Quantity / Crop
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSaveQuantity}>
                  <DialogHeader>
                    <DialogTitle className="font-display text-lg">Update Procurement Quantity</DialogTitle>
                    <DialogDescription>
                      Modify the grain quantity or crop type for token {booking.token}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="modal-crop">Crop</Label>
                      <Select value={editCrop} onValueChange={setEditCrop}>
                        <SelectTrigger id="modal-crop">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CROPS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="modal-qty">Quantity (in quintals)</Label>
                      <Input
                        id="modal-qty"
                        type="number"
                        min="1"
                        max="1000"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        placeholder="e.g. 50"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button asChild size="sm" variant="default" className="gap-1.5">
              <Link to="/farmer/book">
                <CalendarCheck className="size-3.5" /> Reschedule Slot
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Queue Table */}
      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3 sm:px-5">
          <h3 className="font-display text-sm font-bold text-foreground">
            Live Queue Lineup ({centre.name})
          </h3>
          <span className="text-xs text-muted-foreground">
            Showing tokens near your turn
          </span>
        </div>

        <div className="grid grid-cols-[6rem_1fr_6rem] gap-2 border-b bg-muted/70 px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:grid-cols-[7rem_1fr_1fr_7rem]">
          <span>Token</span>
          <span>Status</span>
          <span className="hidden sm:block">Farmer & Quantity</span>
          <span className="text-right">Est. Call Time</span>
        </div>

        <ScrollArea className="h-[28rem]">
          {visible.map((q) => {
            const i = Number(q.token.split("-")[1]);
            const isMe = q.token === booking.token || q.isMe;
            const ahead = Math.max(0, i - currentServing);
            const eta = i === currentServing ? "Now (Counter 2)" : `${Math.round(ahead * perFarmer)} min`;
            const displayQty = isMe ? booking.quantity : q.quantity;
            const displayCrop = isMe ? booking.crop : q.crop;

            return (
              <div
                key={q.token}
                className={cn(
                  "grid grid-cols-[6rem_1fr_6rem] items-center gap-2 border-b px-4 py-3 text-sm last:border-b-0 transition-colors sm:grid-cols-[7rem_1fr_1fr_7rem]",
                  isMe ? "bg-primary/10 font-medium border-primary/30" : "hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className={cn("font-display font-bold", isMe ? "text-primary text-base" : "text-foreground")}>
                    {q.token}
                  </span>
                  {isMe && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      YOU
                    </span>
                  )}
                </div>

                <div>
                  <StatusBadge status={i === currentServing ? "processing" : q.status} />
                </div>

                <div className="hidden truncate text-muted-foreground sm:block">
                  <span className="text-foreground font-medium">{q.farmerName}</span> ·{" "}
                  <span className={cn("font-semibold", isMe && "text-primary font-bold")}>
                    {displayCrop} {displayQty}Q
                  </span>
                </div>

                <div className="text-right font-medium">
                  <span className={cn(i === currentServing ? "text-emerald-600 font-bold" : "text-muted-foreground")}>
                    {eta}
                  </span>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </section>
    </div>
  );
}

export { Route };
