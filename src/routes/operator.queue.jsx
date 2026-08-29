import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DemoControls } from "@/components/kisan/DemoControls";
import { StatusBadge } from "@/components/kisan/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MY_CENTRE_ID } from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/operator/queue")({
  component: OperatorQueuePage
});
function OperatorQueuePage() {
  const { queue, currentServing, operatorAction, centres } = useKisan();
  const centre = centres.find((c) => c.id === MY_CENTRE_ID);
  const [search, setSearch] = useState("");
  const rows = queue.filter((q) => Number(q.token.split("-")[1]) >= currentServing - 2).filter(
    (q) => !search || q.token.toLowerCase().includes(search.toLowerCase()) || q.farmerName.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 40);
  function act(token, action) {
    operatorAction(token, action);
    const labels = {
      call: "Farmer called",
      arrive: "Marked as arrived",
      start: "Procurement started",
      complete: "Procurement completed",
      "no-show": "Marked as no-show"
    };
    toast.success(labels[action], { description: `Token ${token}` });
  }
  return <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Live Queue</h2>
          <p className="text-sm text-muted-foreground">
            {centre.name} · now serving A-{String(currentServing).padStart(3, "0")}
          </p>
        </div>
        <DemoControls compact />
      </header>

      <Input
    placeholder="Search by token or farmer name"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="max-w-sm"
  />

      <div className="surface-card hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              {["Token", "Farmer", "Crop", "Quantity", "Status", "Action"].map((h) => <th key={h} className="px-4 py-2.5 text-left font-semibold">
                  {h}
                </th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => <tr key={q.token} className={cn("border-t", q.isMe && "bg-primary/6")}>
                <td className="px-4 py-3 font-display font-bold">{q.token}</td>
                <td className="px-4 py-3">
                  {q.farmerName}
                  <span className="block text-xs text-muted-foreground">{q.village}</span>
                </td>
                <td className="px-4 py-3">{q.crop}</td>
                <td className="px-4 py-3">{q.quantity} Q</td>
                <td className="px-4 py-3">
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => act(q.token, "call")}>
                      Call
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => act(q.token, "start")}>
                      Start
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => act(q.token, "complete")}>
                      Complete
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => act(q.token, "no-show")}>
                      No-show
                    </Button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {rows.map((q) => <article key={q.token} className={cn("surface-card p-4", q.isMe && "border-primary/50")}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display font-bold">{q.token}</p>
                <p className="text-xs text-muted-foreground">
                  {q.farmerName} · {q.crop} {q.quantity}Q
                </p>
              </div>
              <StatusBadge status={q.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => act(q.token, "call")}>
                Call
              </Button>
              <Button size="sm" variant="outline" onClick={() => act(q.token, "start")}>
                Start
              </Button>
              <Button size="sm" variant="outline" onClick={() => act(q.token, "complete")}>
                Complete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => act(q.token, "no-show")}>
                No-show
              </Button>
            </div>
          </article>)}
      </div>
    </div>;
}
export {
  Route
};
