import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  Eye,
  IndianRupee,
  ListOrdered,
  MapPin,
  ShieldCheck,
  Ticket,
  TrendingDown,
  UserPlus,
  Users,
  Wheat
} from "@/lib/kisan/icons";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/kisan/Brand";
import { LanguageSwitcher } from "@/components/kisan/LanguageSwitcher";
import { ThemeToggle } from "@/components/kisan/ThemeToggle";
import { DISCLAIMER } from "@/lib/kisan/demo-data";
import heroImage from "@/assets/hero-farmer.jpg";
const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KisanQueue \u2014 Smart Procurement. Less Waiting. Better for Farmers." },
      {
        name: "description",
        content: "Digitising farmer procurement queues with real-time tracking, intelligent waiting-time prediction and transparent procurement status."
      },
      { property: "og:title", content: "KisanQueue — Smart Farmer Procurement Queue" },
      {
        property: "og:description",
        content: "Book procurement slots, get a digital token, track your live queue position and payment status."
      }
    ]
  }),
  component: Landing
});
const STATS = [
  { label: "Farmers Served", value: "1,24,860", icon: Users },
  { label: "Procurement Centres", value: "10", icon: MapPin },
  { label: "Today's Appointments", value: "1,371", icon: CalendarCheck },
  { label: "Average Waiting Time", value: "38 min", icon: Clock }
];
const STEPS = [
  { title: "Register", desc: "Create a farmer profile with land and crop details.", icon: UserPlus },
  { title: "Select Centre", desc: "Compare nearby centres by queue and waiting time.", icon: MapPin },
  { title: "Book Slot", desc: "Pick a date and time band with live availability.", icon: CalendarCheck },
  { title: "Receive Token", desc: "Get a digital token instantly on your phone.", icon: Ticket },
  { title: "Track Queue", desc: "Watch your position update live before you travel.", icon: ListOrdered },
  { title: "Complete Procurement", desc: "Quality check, weighing and digital receipt.", icon: ClipboardCheck },
  { title: "Track Payment", desc: "Follow bill generation until money is credited.", icon: IndianRupee }
];
const BENEFITS = [
  "Reduced waiting time at procurement centres",
  "Transparent, tamper-evident digital queue",
  "Real-time updates on token and status",
  "Better centre capacity management",
  "Faster communication with farmers",
  "Data-driven decisions for government"
];
const WHY = [
  {
    title: "Reduce Waiting",
    body: "AI-based waiting-time prediction tells farmers when to arrive, cutting hours of unnecessary time spent at procurement centres.",
    icon: TrendingDown
  },
  {
    title: "Increase Transparency",
    body: "Farmers track their token, procurement status, quality grading and payment progress from a single screen.",
    icon: Eye
  },
  {
    title: "Improve Government Operations",
    body: "Real-time analytics help administrators identify congestion early and rebalance procurement-centre capacity.",
    icon: BarChart3
  }
];
function Landing() {
  return <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Brand />
          <nav className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="field-pattern border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <Wheat className="size-3.5" /> Smart Farmer Procurement System
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.1] font-extrabold sm:text-5xl">
              Smart Procurement. Less Waiting. Better for Farmers.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Digitising farmer procurement queues with real-time tracking, intelligent waiting-time
              prediction and transparent procurement status.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 gap-2 px-6 text-base">
                <Link to="/login">
                  Book Procurement Slot <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <Link to="/login">Track My Queue</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Demo login available — no registration needed.
            </p>
          </div>

          <div className="relative">
            <img
    src={heroImage}
    width={1280}
    height={960}
    alt="Farmer checking his procurement token on a smartphone beside a government procurement shed"
    className="w-full rounded-2xl border object-cover shadow-[var(--shadow-lift)]"
  />
            <div className="surface-card absolute -bottom-5 left-4 w-56 p-3 sm:left-6">
              <p className="text-[11px] text-muted-foreground">Your token</p>
              <p className="font-display text-2xl font-bold text-primary">A-047</p>
              <p className="mt-1 text-xs">18 farmers ahead · ~52 min</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:grid-cols-4">
          {STATS.map((s) => <div key={s.label} className="px-2 py-3 text-center">
              <s.icon className="mx-auto mb-2 size-5 text-primary" />
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">How It Works</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Seven steps from registration to money in the bank — every step visible to the farmer.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => <li key={s.title} className="surface-card p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="size-4" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">STEP {i + 1}</span>
              </div>
              <h3 className="mt-3 font-display text-base font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>)}
        </ol>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Why KisanQueue?</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {WHY.map((w) => <article key={w.title} className="surface-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <w.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Key Benefits</h2>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => <li key={b} className="flex items-start gap-3 text-sm">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>)}
            </ul>
          </div>
          <div className="surface-card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <Bot className="size-5 text-primary" /> Meet Ravi
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-destructive/25 bg-destructive/6 p-4">
                <p className="text-xs font-bold text-destructive">WITHOUT KISANQUEUE</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Travels 12 km · 200 farmers already waiting · 5 hours lost · uncertain payment date.
                </p>
              </div>
              <div className="rounded-xl border border-success/25 bg-success/8 p-4">
                <p className="text-xs font-bold text-success">WITH KISANQUEUE</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Books an 11 AM slot · token A-047 · arrives when 5 farmers remain · payment tracked to
                  credit.
                </p>
              </div>
            </div>
            <Button asChild className="mt-6 w-full" size="lg">
              <Link to="/login">Explore the demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
          <div className="flex flex-wrap items-center gap-4">
            <Brand />
            <nav className="ml-auto flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link to="/login" className="hover:text-foreground">
                Sign in
              </Link>
              <Link to="/register" className="hover:text-foreground">
                Register
              </Link>
              <Link to="/architecture" className="hover:text-foreground">
                Architecture
              </Link>
            </nav>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
        </div>
      </footer>
    </div>;
}
export {
  Route
};
