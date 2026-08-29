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
import { MessageSquareWarning } from "@/lib/kisan/icons";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/farmer/grievances")({
  component: GrievancePage
});
const CATEGORIES = [
  "Long waiting time",
  "Queue issue",
  "Payment issue",
  "Quality dispute",
  "Slot issue",
  "Other"
];
function GrievancePage() {
  const { centres, grievances, addGrievance, booking } = useKisan();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [centreId, setCentreId] = useState(booking.centreId);
  const [contact, setContact] = useState("Phone call");
  const [photo, setPhoto] = useState("");
  function submit(e) {
    e.preventDefault();
    if (description.trim().length < 15) {
      toast.error("Please describe the issue in at least 15 characters");
      return;
    }
    const centreName = centres.find((c) => c.id === centreId)?.name ?? "";
    const id = addGrievance({ category, description: description.trim(), centreName, contact });
    setDescription("");
    setPhoto("");
    toast.success(`Grievance ${id} submitted`, {
      description: "You can track its status in the list below."
    });
  }
  return <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Register a Grievance</h2>
        <p className="text-sm text-muted-foreground">
          Report queue, payment or quality issues and track the resolution.
        </p>
      </header>

      <form onSubmit={submit} className="surface-card space-y-4 p-4 sm:p-5">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="desc">Description</Label>
          <Textarea
    id="desc"
    rows={4}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Describe what happened, including date and token number if relevant."
  />
        </div>

        <div className="space-y-1.5">
          <Label>Procurement centre</Label>
          <Select value={centreId} onValueChange={setCentreId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {centres.map((c) => <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="photo">Photo (optional)</Label>
          <Input
    id="photo"
    type="file"
    accept="image/*"
    onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? "")}
  />
          {photo && <p className="text-xs text-muted-foreground">Attached: {photo}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Contact preference</Label>
          <Select value={contact} onValueChange={setContact}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Phone call", "SMS", "In-app notification"].map((c) => <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2">
          <MessageSquareWarning className="size-5" /> Submit grievance
        </Button>
      </form>

      <section className="space-y-3">
        <h3 className="font-display text-sm font-bold">Your grievances</h3>
        {grievances.map((g) => <article key={g.id} className="surface-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{g.id}</p>
              <StatusBadge status={g.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {g.category} · {g.centreName} · {g.createdAt}
            </p>
            <p className="mt-2 text-sm">{g.description}</p>
          </article>)}
      </section>
    </div>;
}
export {
  Route
};
