import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/kisan/AppShell";
import {
  BarChart3,
  Bell,
  CalendarCheck,
  ClipboardCheck,
  IndianRupee,
  LayoutDashboard,
  ListOrdered
} from "@/lib/kisan/icons";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/operator")({
  head: () => ({
    meta: [
      { title: "Operator Console \u2014 KisanQueue" },
      {
        name: "description",
        content: "Procurement centre operations: call farmers, record quality and quantity, close payments."
      },
      { property: "og:title", content: "Operator Console \u2014 KisanQueue" },
      { property: "og:description", content: "Live queue control for procurement centre operators." }
    ]
  }),
  component: OperatorLayout
});
function OperatorLayout() {
  const { role } = useKisan();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "operator") void navigate({ to: "/login" });
  }, [role, navigate]);
  if (role !== "operator") return null;
  const nav = [
    { to: "/operator", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { to: "/operator/queue", label: "Live Queue", icon: <ListOrdered className="size-4" /> },
    { to: "/operator/appointments", label: "Appointments", icon: <CalendarCheck className="size-4" /> },
    { to: "/operator/procurement", label: "Procurement", icon: <ClipboardCheck className="size-4" /> },
    { to: "/operator/payments", label: "Payments", icon: <IndianRupee className="size-4" /> },
    { to: "/operator/analytics", label: "Centre Analytics", icon: <BarChart3 className="size-4" /> },
    { to: "/operator/notifications", label: "Notifications", icon: <Bell className="size-4" /> }
  ];
  return <AppShell nav={nav} title="Procurement Centre Operations">
      <Outlet />
    </AppShell>;
}
export {
  Route
};
