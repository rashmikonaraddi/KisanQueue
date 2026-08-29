import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/kisan/AppShell";
import { AlertTriangle, BarChart3, LayoutDashboard, MapPin } from "@/lib/kisan/icons";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Government Dashboard \u2014 KisanQueue" },
      { name: "description", content: "National procurement operations: live queues, volumes, waiting times and payment monitoring." },
      { property: "og:title", content: "Government Dashboard \u2014 KisanQueue" },
      { property: "og:description", content: "State and district level procurement analytics and smart alerts." }
    ]
  }),
  component: AdminLayout
});
function AdminLayout() {
  const { role } = useKisan();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "admin") void navigate({ to: "/login" });
  }, [role, navigate]);
  if (role !== "admin") return null;
  const nav = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
    { to: "/admin/centres", label: "Centres & Map", icon: <MapPin className="size-4" /> },
    { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
    { to: "/admin/alerts", label: "Alerts", icon: <AlertTriangle className="size-4" /> }
  ];
  return <AppShell nav={nav} title="National Procurement Operations Dashboard">
      <Outlet />
    </AppShell>;
}
export {
  Route
};
