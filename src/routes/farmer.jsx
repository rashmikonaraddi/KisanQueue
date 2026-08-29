import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/kisan/AppShell";
import {
  Bell,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  IndianRupee,
  LayoutDashboard,
  ListOrdered,
  MapPin,
  MessageSquareWarning,
  User
} from "@/lib/kisan/icons";
import { useI18n } from "@/lib/kisan/i18n";
import { useKisan } from "@/lib/kisan/store";
const Route = createFileRoute("/farmer")({
  head: () => ({
    meta: [
      { title: "Farmer Portal \u2014 KisanQueue" },
      {
        name: "description",
        content: "Track your token, live queue position, procurement status and payments in one place."
      },
      { property: "og:title", content: "Farmer Portal \u2014 KisanQueue" },
      { property: "og:description", content: "Live queue position, waiting time and payment tracking." }
    ]
  }),
  component: FarmerLayout
});
function FarmerLayout() {
  const { role } = useKisan();
  const { t } = useI18n();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "farmer") void navigate({ to: "/login" });
  }, [role, navigate]);
  if (role !== "farmer") return null;
  const nav = [
    { to: "/farmer", label: t("nav.dashboard"), icon: <LayoutDashboard className="size-4" /> },
    { to: "/farmer/queue", label: t("nav.queue"), icon: <ListOrdered className="size-4" /> },
    { to: "/farmer/book", label: t("nav.book"), icon: <CalendarCheck className="size-4" /> },
    { to: "/farmer/centres", label: t("nav.centres"), icon: <MapPin className="size-4" /> },
    { to: "/farmer/procurement", label: t("nav.procurement"), icon: <ClipboardCheck className="size-4" /> },
    { to: "/farmer/payments", label: t("nav.payments"), icon: <IndianRupee className="size-4" /> },
    { to: "/farmer/history", label: t("nav.history"), icon: <FileText className="size-4" /> },
    { to: "/farmer/notifications", label: t("nav.notifications"), icon: <Bell className="size-4" /> },
    { to: "/farmer/grievances", label: t("nav.grievances"), icon: <MessageSquareWarning className="size-4" /> },
    { to: "/farmer/profile", label: t("nav.profile"), icon: <User className="size-4" /> }
  ];
  return <AppShell nav={nav} title="KisanQueue — Farmer" showAssistant bottomNav>
      <Outlet />
    </AppShell>;
}
export {
  Route
};
