import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/kisan/StatusBadge";
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
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, Truck } from "@/lib/kisan/icons";
import { MY_TOKEN } from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/operator/procurement")({
  component: ProcurementEntryPage
});
function ProcurementEntryPage() {
  const { queue, currentServing, operatorAction, completeProcurement, currentProcurement } = useKisan();
  const [token, setToken] = useState(MY_TOKEN);
  const entry = queue.find((q) => q.token === token);
  const [quantity, setQuantity] = useState("42");
  const [vehicle, setVehicle] = useState("KA-09-AB-4471");
  const [grade, setGrade] = useState("A");
  const [moisture, setMoisture] = useState("12.4");
  const [remarks, setRemarks] = useState("");
  const options = queue.filter((q) => Number(q.token.split("-")[1]) >= currentServing - 1 && q.status !== "no-show").slice(0, 20);
  function start() {
    operatorAction(token, "start");
    toast.success("Procurement started", { description: `Token ${token} at Counter 2` });
  }
  function complete() {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      toast.error("Enter a valid quantity in quintals");
      return;
    }
    operatorAction(token, "complete");
    if (token === MY_TOKEN) {
      completeProcurement({
        quantity: qty,
        qualityGrade: grade,
        moisture: Number(moisture),
        vehicle,
        remarks
      });
    }
    toast.success("Procurement completed", { description: `${qty} quintals recorded for ${token}` });
  }
  return <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Procurement Processing</h2>
        <p className="text-sm text-muted-foreground">
          Record quality and quantity. Completing here updates the farmer's dashboard instantly.
        </p>
      </header>

      <section className="surface-card space-y-4 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Token</Label>
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((q) => <SelectItem key={q.token} value={q.token}>
                    {q.token} · {q.farmerName}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Farmer</Label>
            <Input value={entry?.farmerName ?? "\u2014"} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label>Crop</Label>
            <Input value={entry?.crop ?? "\u2014"} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="oq">Quantity (quintals)</Label>
            <Input id="oq" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="veh">Vehicle number</Label>
            <Input id="veh" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Quality grade</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["A", "B", "C"].map((g) => <SelectItem key={g} value={g}>
                    Grade {g}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mo">Moisture (%)</Label>
            <Input id="mo" type="number" step="0.1" value={moisture} onChange={(e) => setMoisture(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Current status</Label>
            <div className="flex h-9 items-center">
              <StatusBadge status={entry?.status ?? "waiting"} />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="rem">Remarks</Label>
            <Textarea id="rem" rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" size="lg" className="gap-2" onClick={start}>
            <Truck className="size-5" /> Start Procurement
          </Button>
          <Button size="lg" className="gap-2" onClick={complete}>
            <ClipboardCheck className="size-5" /> Complete Procurement
          </Button>
        </div>
      </section>

      {currentProcurement && <section className="surface-card p-4 sm:p-5">
          <h3 className="font-display text-sm font-bold">Last completed procurement</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {currentProcurement.id} · {currentProcurement.crop} {currentProcurement.quantity} quintals ·
            Grade {currentProcurement.qualityGrade} · Net ₹
            {currentProcurement.net.toLocaleString("en-IN")}
          </p>
        </section>}
    </div>;
}
export {
  Route
};
