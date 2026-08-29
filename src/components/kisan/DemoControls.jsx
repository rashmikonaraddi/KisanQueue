import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKisan } from "@/lib/kisan/store";
function DemoControls({ compact = false }) {
  const { simulating, toggleSimulation, resetDemo } = useKisan();
  return <div className="flex flex-wrap items-center gap-2">
      <Button
    onClick={toggleSimulation}
    size={compact ? "sm" : "default"}
    className="gap-2"
    variant={simulating ? "secondary" : "default"}
  >
        {simulating ? <Pause className="size-4" /> : <Play className="size-4" />}
        {simulating ? "Pause Simulation" : "Start Live Queue Simulation"}
      </Button>
      <Button onClick={resetDemo} size={compact ? "sm" : "default"} variant="outline" className="gap-2">
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>;
}
export {
  DemoControls
};
