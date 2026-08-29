import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, LogOut, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  const { role, signOut, notifications } = useKisan();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
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
  return <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[110rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar px-3 py-4 lg:flex">
          <Brand className="px-2 pb-4" />
          <nav className="flex-1 space-y-1 overflow-y-auto">{links()}</nav>
          <Button
    variant="ghost"
    className="mt-2 justify-start gap-3 text-muted-foreground"
    onClick={() => {
      signOut();
      void navigate({ to: "/" });
    }}
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
                <SheetContent side="left" className="w-72 p-3">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <Brand className="px-2 pb-4" />
                  <nav className="space-y-1">{links(() => setOpen(false))}</nav>
                </SheetContent>
              </Sheet>

              <h1 className="truncate font-display text-base font-bold sm:text-lg">{title}</h1>

              <div className="ml-auto flex items-center gap-2.5">
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

                {/* User Profile Pill */}
                <div className="hidden sm:flex items-center gap-2 rounded-xl border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground">
                  <div className="size-6 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[11px]">
                    {role === "admin" ? "A" : role === "operator" ? "O" : "R"}
                  </div>
                  <span className="capitalize">{role === "admin" ? "Admin" : role === "operator" ? "Operator" : "Ravi K."}</span>
                </div>

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
