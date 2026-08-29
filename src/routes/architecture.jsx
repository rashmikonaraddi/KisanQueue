import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/kisan/Brand";
import { DISCLAIMER } from "@/lib/kisan/demo-data";
const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Technical Architecture \u2014 KisanQueue" },
      {
        name: "description",
        content: "How KisanQueue is built: authentication, API layer, PostgreSQL, real-time queue engine, AI prediction and analytics."
      },
      { property: "og:title", content: "Technical Architecture \u2014 KisanQueue" },
      {
        property: "og:description",
        content: "Layer-by-layer architecture of the KisanQueue procurement queue platform."
      }
    ]
  }),
  component: ArchitecturePage
});
const LAYERS = [
  {
    name: "Farmer Mobile / Web App",
    body: "Mobile-first responsive PWA-style interface with large touch targets, multilingual UI (English, Kannada, Hindi) and low-bandwidth friendly screens."
  },
  {
    name: "Authentication",
    body: "Phone + OTP for farmers, credential login for operators and administrators, with role-based access control gating every dashboard route."
  },
  {
    name: "API Layer",
    body: "Typed server functions expose farmer, slot, queue, procurement and payment operations. Validation runs on the server before any write."
  },
  {
    name: "PostgreSQL Database",
    body: "Users, farmers, crops, procurement centres, slots, queue, procurements, payments, notifications and grievances \u2014 with row-level security scoping each farmer to their own records."
  },
  {
    name: "Real-time Queue Engine",
    body: "Maintains token order, current serving position, no-show handling and per-centre capacity. Pushes position changes to every connected client."
  },
  {
    name: "AI Prediction Engine",
    body: "Waiting-time estimation from queue length, processing speed, active counters, crop volume and time-of-day load; plus congestion forecasting per centre. Modular so a trained model can replace the heuristic."
  },
  {
    name: "Notification Service",
    body: "In-app and push notifications for slot reminders, queue approach alerts, procurement completion and payment updates, with SMS fallback for poor connectivity."
  },
  {
    name: "Operator Dashboard",
    body: "Counter-side console for calling farmers, recording quality and quantity, completing procurement and managing daily capacity."
  },
  {
    name: "Government Analytics",
    body: "State, district and centre-level KPIs, utilisation charts, waiting-time trends, pending payment monitoring and smart alerts."
  }
];
function ArchitecturePage() {
  return <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Brand />
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">Technical Architecture</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          KisanQueue is one connected system: what the farmer sees, what the operator records and what the
          government analyses are three views of the same live data.
        </p>

        <pre className="surface-card mt-8 overflow-x-auto p-5 text-xs leading-6">
          {`Farmer Mobile/Web App
        |
Authentication (role-based)
        |
      API Layer
        |
 PostgreSQL Database
        |
Real-time Queue Engine
        |
 AI Prediction Engine
        |
 Notification Service
        |
  Operator Dashboard
        |
Government Analytics`}
        </pre>

        <ol className="mt-8 space-y-3">
          {LAYERS.map((l, i) => <li key={l.name} className="surface-card flex gap-4 p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-base font-bold">{l.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{l.body}</p>
              </div>
            </li>)}
        </ol>

        <section className="surface-card mt-8 p-5">
          <h2 className="font-display text-lg font-bold">Prototype scope</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This build ships the full farmer, operator and government experience on a deterministic demo
            dataset with a live queue simulator, so the entire flow can be shown end to end without
            production government data. Every data access point — queue engine, prediction engine,
            assistant and notification service — sits behind its own module, so each can be replaced by a
            real service without touching the interface.
          </p>
        </section>
      </main>

      <footer className="border-t px-4 py-5 text-center text-[11px] text-muted-foreground">
        {DISCLAIMER}
      </footer>
    </div>;
}
export {
  Route
};
