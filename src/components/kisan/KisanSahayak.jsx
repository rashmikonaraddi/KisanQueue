import { useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAssistant, QUICK_PROMPTS } from "@/lib/kisan/assistant";
import { useI18n } from "@/lib/kisan/i18n";
import { useKisan } from "@/lib/kisan/store";
function KisanSahayak() {
  const { t } = useI18n();
  const { profile, booking, centres, prediction, expectedTurn, farmersAhead, currentProcurement, stage } = useKisan();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `Namaste ${profile.name.split(" ")[0]} \u{1F64F} I am Kisan Sahayak. Ask me about your token, waiting time, procurement or payment.`
    }
  ]);
  const scrollRef = useRef(null);
  const centre = centres.find((c) => c.id === booking.centreId) ?? centres[0];
  const context = {
    farmerName: profile.name,
    token: booking.token,
    farmersAhead,
    waitMinutes: prediction.minutes,
    expectedTurn,
    centreName: centre.name,
    centreDistanceKm: centre.distanceKm,
    timeSlot: `${booking.timeSlot} on ${booking.date}`,
    crop: booking.crop,
    quantity: currentProcurement?.quantity ?? booking.quantity,
    procurementStatus: stage.replace(/-/g, " "),
    paymentStatus: currentProcurement?.paymentStatus ?? "not started",
    netAmount: currentProcurement?.net ?? null
  };
  async function send(question) {
    if (!question.trim() || busy) return;
    setMessages((m) => [...m, { from: "user", text: question }]);
    setInput("");
    setBusy(true);
    const reply = await askAssistant(question, context);
    setMessages((m) => [...m, { from: "bot", text: reply.text }]);
    setBusy(false);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }));
  }
  return <>
      {!open && <button
    type="button"
    onClick={() => setOpen(true)}
    className="fixed right-4 bottom-20 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] md:bottom-6"
  >
          <Bot className="size-5" />
          <span className="hidden sm:inline">{t("ai.assistant")} 🤖</span>
        </button>}

      {open && <div className="fixed right-3 bottom-20 z-50 flex h-[30rem] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl md:right-6 md:bottom-6">
          <header className="flex items-center justify-between gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="size-5" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">{t("ai.assistant")} 🤖</p>
                <p className="text-[11px] opacity-80">Prototype assistant · mock responses</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="size-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => <div
    key={i}
    className={m.from === "user" ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground" : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm"}
  >
                {m.text}
              </div>)}
            {busy && <p className="text-xs text-muted-foreground">Kisan Sahayak is typing…</p>}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t px-3 py-2">
            {QUICK_PROMPTS.map((q) => <button
    key={q.label}
    type="button"
    onClick={() => void send(q.question)}
    className="rounded-full border border-primary/30 bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary"
  >
                {q.label}
              </button>)}
          </div>

          <form
    className="flex items-center gap-2 border-t p-2"
    onSubmit={(e) => {
      e.preventDefault();
      void send(input);
    }}
  >
            <Input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder={t("ai.ask")}
    aria-label="Message Kisan Sahayak"
  />
            <Button type="submit" size="icon" disabled={busy} aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </div>}
    </>;
}
export {
  KisanSahayak
};
