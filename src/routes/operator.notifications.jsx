import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "@/lib/kisan/icons";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/operator/notifications")({
  component: OperatorNotificationsPage
});
function OperatorNotificationsPage() {
  const { notifications } = useKisan();
  return <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Centre Notifications</h2>
        <p className="text-sm text-muted-foreground">Events raised by the queue engine for this centre.</p>
      </header>
      {notifications.length === 0 ? <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          No centre events yet today.
        </div> : <ul className="space-y-3">
          {notifications.map((n) => <li key={n.id} className="surface-card flex gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="size-4" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
              </div>
            </li>)}
        </ul>}
    </div>;
}
export {
  Route
};
