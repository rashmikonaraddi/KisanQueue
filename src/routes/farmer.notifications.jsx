import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bell } from "@/lib/kisan/icons";
import { Button } from "@/components/ui/button";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/farmer/notifications")({
  component: NotificationsPage
});
const KIND_STYLE = {
  queue: "bg-primary/10 text-primary",
  slot: "bg-info/10 text-info",
  procurement: "bg-success/12 text-success",
  payment: "bg-accent/30 text-accent-foreground",
  alert: "bg-destructive/10 text-destructive"
};
function NotificationsPage() {
  const { notifications, markAllRead } = useKisan();
  const unread = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    const id = setTimeout(markAllRead, 2500);
    return () => clearTimeout(id);
  }, [markAllRead]);
  return <div className="mx-auto max-w-2xl space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Notification Centre</h2>
          <p className="text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread updates` : "You are all caught up"}
          </p>
        </div>
        {unread > 0 && <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>}
      </header>

      {notifications.length === 0 ? <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          No notifications yet. Start the queue simulation to receive live updates.
        </div> : <ul className="space-y-3">
          {notifications.map((n) => <li
    key={n.id}
    className={cn("surface-card flex gap-3 p-4", !n.read && "border-primary/40 bg-primary/5")}
  >
              <span
    className={cn(
      "flex size-9 shrink-0 items-center justify-center rounded-lg",
      KIND_STYLE[n.kind] ?? "bg-muted"
    )}
  >
                <Bell className="size-4" />
              </span>
              <div className="min-w-0">
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
