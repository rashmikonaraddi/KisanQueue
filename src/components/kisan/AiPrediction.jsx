import { Bot, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
function AiPrediction({ prediction, title }) {
  return <section className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b bg-primary/6 px-4 py-3 sm:px-5">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold">
          <Bot className="size-4 text-primary" />
          {title}
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
    type="button"
    aria-label="About this prediction"
    className="text-muted-foreground transition-colors hover:text-foreground"
  >
              <Info className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64">
            This is an estimate generated from live queue data and historical centre patterns. Actual
            waiting time may vary with crop volume and counter availability.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-sm leading-relaxed">
          🤖 Based on current processing speed, queue length and historical centre data, your estimated
          waiting time is{" "}
          <strong className="text-primary">{prediction.minutes} minutes</strong>.
        </p>

        <dl className="grid grid-cols-2 gap-3">
          {prediction.factors.map((f) => <div key={f.label} className="rounded-lg bg-muted/70 px-3 py-2">
              <dt className="text-[11px] text-muted-foreground">{f.label}</dt>
              <dd className="text-sm font-semibold">{f.value}</dd>
            </div>)}
        </dl>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Prediction confidence</span>
            <span className="font-semibold">{prediction.confidence}%</span>
          </div>
          <Progress value={prediction.confidence} className="h-2" />
        </div>
      </div>
    </section>;
}
export {
  AiPrediction
};
