import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  LogOut,
  Bell,
  ChevronDown,
  User,
  Building2,
  LayoutDashboard,
  MapPin,
  CalendarCheck,
  MessageSquareWarning,
  ListOrdered
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Brand } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { KisanSahayak } from "./KisanSahayak";
import { DISCLAIMER } from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";

function AppShell({
  nav,
  title,
  children,
  showAssistant = false,
  bottomNav = false
}) {
  const navigate = useNavigate();
  const { role, profile, signOut, notifications } = useKisan();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const handleSignOut = () => {
    signOut();
    toast.success("Logged out successfully");
    void navigate({ to: "/login" });
  };

  const links = (onClick) => nav.map((item) => {
    const active = pathname === item.to;
    return <Link
      key={item.to}
      to={item.to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
      )}
    >
          {item.icon}
          <span>{item.label}</span>
          {item.to.endsWith("notifications") && unread > 0 && <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>}
        </Link>;
  });

  const getRoleBadge = () => {
    if (role === "admin") return "Government Administrator";
    if (role === "operator") return "Procurement Operator";
    return "Farmer Account";
  };

  const getUserName = () => {
    if (role === "admin") return "Admin";
    if (role === "operator") return "Operator";
    return profile?.name || "Ravi Kumar";
  };

  const getIdentifier = () => {
    if (role === "admin") return "admin@kisanqueue.gov.in";
    if (role === "operator") return "operator@mysuru-c1";
    return profile?.phone ? `+91 ${profile.phone}` : "+91 99999 99999";
  };

  return <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[110rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r bg-sidebar px-3 py-4 lg:flex">
          <div className="space-y-4">
            <Brand className="px-2 pb-2" />
            <nav className="space-y-1 overflow-y-auto">{links()}</nav>
          </div>
          <Button
            variant="ghost"
            className="mt-2 justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
            <div className="flex h-14 items-center gap-2 px-3 sm:px-5">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-3 flex flex-col justify-between">
                  <div>
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <Brand className="px-2 pb-4" />
                    <nav className="space-y-1">{links(() => setOpen(false))}</nav>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-2 justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="size-4" /> Log out
                  </Button>
                </SheetContent>
              </Sheet>

              <h1 className="truncate font-display text-base font-bold sm:text-lg">{title}</h1>

              <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
                <LanguageSwitcher />

                {/* Notifications Bell */}
                <Link
                  to={role === "admin" ? "/admin/alerts" : role === "operator" ? "/operator/notifications" : "/farmer/notifications"}
                  className="relative flex size-9 items-center justify-center rounded-xl border bg-card hover:bg-muted text-foreground transition-colors"
                  title="Notifications"
                >
                  <Bell className="size-4" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="group flex items-center gap-2 rounded-xl border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent/70 hover:border-accent-foreground/20 transition-all cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-ring outline-none"
                      title="User Profile Menu"
                    >
                      <div
                        className={cn(
                          "size-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 transition-transform group-hover:scale-105",
                          role === "admin"
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            : role === "operator"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : "bg-primary/20 text-primary"
                        )}
                      >
                        {role === "admin" ? "A" : role === "operator" ? "O" : "R"}
                      </div>
                      <span className="capitalize hidden sm:inline-block font-medium">
                        {getUserName()}
                      </span>
                      <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" sideOffset={6} className="w-60 p-1.5 shadow-xl rounded-xl border bg-popover text-popover-foreground">
                    <DropdownMenuLabel className="p-2 font-normal">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "size-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs",
                            role === "admin"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : role === "operator"
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-primary/20 text-primary"
                          )}
                        >
                          {role === "admin" ? "A" : role === "operator" ? "O" : "R"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-xs font-bold leading-tight truncate text-foreground">
                            {role === "admin" ? "Admin Officer" : role === "operator" ? "Centre Operator" : (profile?.name || "Ravi Kumar")}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-tight truncate mt-0.5">
                            {getIdentifier()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {getRoleBadge()}
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-1" />

                    {role === "farmer" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/farmer/profile" className="flex items-center gap-2.5 cursor-pointer py-1.5 text-xs font-medium">
                            <User className="size-4 text-muted-foreground" />
                            <span>Profile & Land Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/farmer/queue" className="flex items-center gap-2.5 cursor-pointer py-1.5 text-xs font-medium">
                            <ListOrdered className="size-4 text-muted-foreground" />
                            <span>Live Queue Status</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/farmer/grievances" className="flex items-center gap-2.5 cursor-pointer py-1.5 text-xs font-medium">
                            <MessageSquareWarning className="size-4 text-muted-foreground" />
                            <span>Help & Grievances</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {role === "operator" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/operator" className="flex items-center gap-2.5 cursor-pointer py-1.5 text-xs font-medium">
                            <Building2 className="size-4 text-muted-foreground" />
                            <span>Live Operations</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/operator/appointments" className="flex items-center gap-2.5 cursor-pointer py-1.5 text-xs font-medium">
                            <CalendarCheck className="size-4 text-muted-foreground" />
                            <span>Today's Appointments</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {role === "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center gap-2.5 cursor-pointer py-1.5 text-xs font-medium">
                            <LayoutDashboard className="size-4 text-muted-foreground" />
                            <span>Admin Console</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/centres" className="flex items-center gap-2.5 cursor-pointer py-1.5 text-xs font-medium">
                            <MapPin className="size-4 text-muted-foreground" />
                            <span>Procurement Centres</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive py-1.5 text-xs font-semibold"
                    >
                      <LogOut className="size-4 text-destructive" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className={cn("px-3 py-5 sm:px-5 sm:py-6", bottomNav && "pb-24 md:pb-6")}>{children}</main>

          <footer className="border-t px-4 py-4 text-center text-[11px] leading-relaxed text-muted-foreground">
            {DISCLAIMER}
          </footer>
        </div>
      </div>

      {bottomNav && <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-card/95 py-1.5 backdrop-blur md:hidden">
          {nav.slice(0, 5).map((item) => {
    const active = pathname === item.to;
    return <Link
      key={item.to}
      to={item.to}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] font-medium",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>;
  })}
        </nav>}

      {showAssistant && <KisanSahayak />}
    </div>;
}
export {
  AppShell
};

