import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Bell,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Info,
  Layers,
  MapPin,
  Minus,
  Plus,
  Ticket,
  TrendingDown,
  TrendingUp,
  Users,
  Wheat
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CENTRE_SPECIFIC_TRENDS,
  DASHBOARD_ANNOUNCEMENTS,
  LIVE_CENTRES_OVERVIEW,
  MAP_CENTRES
} from "@/lib/kisan/demo-data";
import { useKisan } from "@/lib/kisan/store";
import { cn } from "@/lib/utils";

const Route = createFileRoute("/farmer/")({
  component: FarmerDashboard
});

// Helper for mini SVG sparklines
function MiniSparkline({ strokeColor = "#3b82f6", trend = "up" }) {
  const points =
    trend === "up"
      ? "0,24 15,22 30,16 45,18 60,10 75,14 90,6 100,2"
      : trend === "down"
      ? "0,6 15,10 30,8 45,16 60,12 75,20 90,18 100,24"
      : "0,16 20,10 40,18 60,8 80,14 100,12";

  return (
    <svg className="h-7 w-24 overflow-visible" viewBox="0 0 100 28" fill="none">
      <path
        d={`M ${points.replace(/ /g, " L ")}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FarmerDashboard() {
  const { booking, centres, farmersAhead, prediction, lastUpdated } = useKisan();
  const [selectedTrendCentre, setSelectedTrendCentre] = useState("all");
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedMapPin, setSelectedMapPin] = useState(null);

  // Active centre details
  const myCentre = centres.find((c) => c.id === booking.centreId) ?? centres[0];

  // Active trend dataset based on selector
  const trendData = useMemo(() => {
    return CENTRE_SPECIFIC_TRENDS[selectedTrendCentre] ?? CENTRE_SPECIFIC_TRENDS.all;
  }, [selectedTrendCentre]);

  const formattedDate = useMemo(() => {
    return "Today, 22 May 2025 | 10:30 AM";
  }, []);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time overview of grain collection centres and queues
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-card border px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-xs">
            <Calendar className="size-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {/* Row 1: 4 Top Stat Cards with Mini Sparkline Graphs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Centres */}
        <div className="surface-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Users className="size-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Total Centres</p>
              <p className="font-display text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
                128
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Active: 112
            </span>
            <MiniSparkline strokeColor="#3b82f6" trend="up" />
          </div>
        </div>

        {/* Card 2: Farmers in Queue */}
        <div className="surface-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Users className="size-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Farmers in Queue</p>
              <p className="font-display text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
                1,245
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Across all centres
            </span>
            <MiniSparkline strokeColor="#10b981" trend="up" />
          </div>
        </div>

        {/* Card 3: Avg. Wait Time */}
        <div className="surface-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Clock className="size-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Avg. Wait Time</p>
              <p className="font-display text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
                42 <span className="text-sm font-semibold text-muted-foreground">min</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="size-3.5" /> 8 min vs yesterday
            </span>
            <MiniSparkline strokeColor="#f59e0b" trend="down" />
          </div>
        </div>

        {/* Card 4: Grain Collected */}
        <div className="surface-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <CheckCircle className="size-6" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Grain Collected (Today)</p>
              <p className="font-display text-2xl font-extrabold tracking-tight text-foreground mt-0.5">
                2,350 <span className="text-sm font-semibold text-muted-foreground">MT</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3.5" /> +12% vs yesterday
            </span>
            <MiniSparkline strokeColor="#8b5cf6" trend="up" />
          </div>
        </div>
      </div>

      {/* Row 2: 3-Column Grid (Live Queue Overview, Queue Trend, My Token) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Col 1: Live Queue Overview (4 cols on lg) */}
        <div className="surface-card flex flex-col justify-between p-5 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-foreground">
                Live Queue Overview
              </h2>
              <Link
                to="/farmer/centres"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold">
                    <th className="pb-2.5 font-medium">Centre Name</th>
                    <th className="pb-2.5 text-center font-medium">Current Queue</th>
                    <th className="pb-2.5 text-center font-medium">Avg. Wait Time</th>
                    <th className="pb-2.5 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {LIVE_CENTRES_OVERVIEW.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 font-semibold text-foreground">{item.name}</td>
                      <td className="py-3 text-center text-foreground font-bold">{item.queue}</td>
                      <td className="py-3 text-center text-muted-foreground font-medium">{item.avgWaitMin} min</td>
                      <td className="py-3 text-right">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                            item.status === "Moderate" &&
                              "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                            item.status === "Busy" &&
                              "bg-rose-500/15 text-rose-700 dark:text-rose-400",
                            item.status === "Low" &&
                              "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          )}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button asChild className="mt-5 w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <Link to="/farmer/centres">
              <Building2 className="size-4" /> View All Centres
            </Link>
          </Button>
        </div>

        {/* Col 2: Queue Trend (Today) (5 cols on lg) */}
        <div className="surface-card flex flex-col justify-between p-5 lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="font-display text-base font-bold text-foreground">
                Queue Trend (Today)
              </h2>
              <div className="w-36">
                <Select value={selectedTrendCentre} onValueChange={setSelectedTrendCentre}>
                  <SelectTrigger className="h-8 text-xs font-semibold">
                    <SelectValue placeholder="All Centres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Centres</SelectItem>
                    <SelectItem value="Rampur Mandi">Rampur Mandi</SelectItem>
                    <SelectItem value="Shivpur Centre">Shivpur Centre</SelectItem>
                    <SelectItem value="Bhainsa Kendra">Bhainsa Kendra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-blue-600 inline-block" />
                <span>Farmers in Queue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 border-t-2 border-dashed border-emerald-600 inline-block" />
                <span>Avg. Wait Time (min)</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                  <XAxis dataKey="time" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    yAxisId="left"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 80]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "0.75rem",
                      fontSize: "0.75rem",
                      boxShadow: "var(--shadow-card)"
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="farmers"
                    name="Farmers"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorFarmers)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="waitTime"
                    name="Wait Time (min)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Queue Time Callout */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20 px-3.5 py-2.5 text-xs text-blue-700 dark:text-blue-300">
            <span className="font-semibold flex items-center gap-1.5">
              Peak Queue Time: 10 AM – 1 PM
            </span>
            <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Col 3: My Token (3 cols on lg) */}
        <div className="surface-card flex flex-col justify-between p-5 lg:col-span-3">
          <div>
            <h2 className="font-display text-base font-bold text-foreground mb-4">
              My Token
            </h2>

            {/* Ticket Box */}
            <div className="rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 p-5 text-center relative overflow-hidden">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Token Number
              </span>
              <p className="font-display text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
                {booking.token === "A-047" ? "RMP125" : booking.token}
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <MapPin className="size-3.5 text-emerald-600" />
                {myCentre.name.includes("Mysuru") ? "Rampur Mandi" : myCentre.name}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-emerald-500/20 pt-4 text-left">
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Your Position</p>
                  <p className="font-display text-lg font-bold text-foreground">
                    {farmersAhead > 0 ? `${farmersAhead} / 65` : "23 / 65"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium">Est. Wait Time</p>
                  <p className="font-display text-lg font-bold text-foreground">
                    {prediction.minutes ? `${prediction.minutes} min` : "35 min"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button asChild className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <Link to="/farmer/queue">
              View Token Details
            </Link>
          </Button>
        </div>
      </div>

      {/* Row 3: 2-Column Grid (Centre Map & Announcements) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Centre Map (7 cols on lg) */}
        <div className="surface-card flex flex-col p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">
                Centre Map
              </h2>
              <p className="text-xs text-muted-foreground">
                Click any Mandi marker to view live statistics & book a slot
              </p>
            </div>

            {/* Map Legend */}
            <div className="flex items-center gap-3 text-xs font-medium rounded-lg bg-muted/60 px-3 py-1.5 border">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-500 shadow-xs animate-pulse" /> Busy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-500 shadow-xs" /> Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500 shadow-xs" /> Low
              </span>
            </div>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="relative h-80 w-full rounded-2xl border bg-[#f4f7f6] dark:bg-[#131d1a] overflow-hidden select-none shadow-inner">
            {/* Realistic Cartographic GIS Background (Roads, Green belts, River water body) */}
            <svg
              className="absolute inset-0 size-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Landmass base */}
              <rect width="800" height="500" fill="#f8fafc" className="dark:fill-[#121c18]" />

              {/* Agricultural & Forest Green Belts */}
              <path
                d="M -20,80 Q 120,40 180,120 T 320,80 Q 420,160 520,100 T 820,140 L 820,-20 L -20,-20 Z"
                fill="#ecfdf5"
                className="dark:fill-[#142820]"
                opacity="0.9"
              />
              <path
                d="M 100,380 Q 240,320 380,420 T 700,340 L 820,520 L 0,520 Z"
                fill="#f0fdf4"
                className="dark:fill-[#10231b]"
                opacity="0.8"
              />

              {/* Meandering River / Canal */}
              <path
                d="M -20,240 C 140,280 220,180 360,220 C 500,260 620,190 820,230"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="18"
                strokeLinecap="round"
                className="dark:stroke-[#0e3b4d]"
              />
              <path
                d="M -20,240 C 140,280 220,180 360,220 C 500,260 620,190 820,230"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="8"
                strokeLinecap="round"
                className="dark:stroke-[#0284c7]"
                opacity="0.6"
              />

              {/* District & Grid Boundaries */}
              <path d="M 0,160 L 800,160" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-white/5" />
              <path d="M 0,340 L 800,340" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-white/5" />
              <path d="M 260,0 L 260,500" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-white/5" />
              <path d="M 540,0 L 540,500" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-white/5" />

              {/* Secondary District Roads */}
              <path d="M 120,-20 Q 180,180 140,520" fill="none" stroke="#cbd5e1" strokeWidth="6" className="dark:stroke-slate-700" />
              <path d="M 460,-20 Q 420,220 560,520" fill="none" stroke="#cbd5e1" strokeWidth="6" className="dark:stroke-slate-700" />
              <path d="M -20,380 Q 380,360 820,410" fill="none" stroke="#cbd5e1" strokeWidth="6" className="dark:stroke-slate-700" />

              {/* Main Golden National Highway NH36 */}
              <path
                d="M -20,140 C 200,90 320,290 600,180 T 820,260"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="9"
                strokeLinecap="round"
                className="dark:stroke-[#d97706]"
              />
              <path
                d="M -20,140 C 200,90 320,290 600,180 T 820,260"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="8,8"
                className="dark:stroke-white/40"
              />
            </svg>

            {/* Highway Badges */}
            <div className="absolute top-24 left-1/3 -translate-x-1/2 rounded bg-amber-500/90 text-white font-extrabold px-1.5 py-0.5 text-[9px] shadow-xs pointer-events-none">
              NH36
            </div>
            <div className="absolute bottom-16 right-1/4 rounded bg-slate-700/80 text-white font-bold px-1.5 py-0.5 text-[9px] shadow-xs pointer-events-none">
              SH12
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 rounded-xl bg-card/95 border p-1 shadow-md backdrop-blur-xs">
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
                className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-foreground transition-colors font-bold text-sm cursor-pointer"
                title="Zoom in"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
                className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-foreground transition-colors font-bold text-sm cursor-pointer"
                title="Zoom out"
              >
                <Minus className="size-4" />
              </button>
              {mapZoom !== 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setMapZoom(1);
                    setSelectedMapPin(null);
                  }}
                  className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-xs text-primary font-bold transition-colors cursor-pointer border-t"
                  title="Reset Zoom"
                >
                  1x
                </button>
              )}
            </div>

            {/* Mandi Pins on Map */}
            <div
              className="absolute inset-0 transition-transform duration-300 origin-center"
              style={{ transform: `scale(${mapZoom})` }}
            >
              {MAP_CENTRES.map((pin) => {
                const isBusy = pin.status === "Busy";
                const isModerate = pin.status === "Moderate";
                const isLow = pin.status === "Low";
                const isSelected = selectedMapPin?.id === pin.id;

                const pinBg = isBusy
                  ? "bg-rose-500 text-white shadow-rose-500/40"
                  : isModerate
                  ? "bg-amber-500 text-white shadow-amber-500/40"
                  : "bg-emerald-500 text-white shadow-emerald-500/40";

                return (
                  <div
                    key={pin.id}
                    className="absolute z-20 transition-all duration-200"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedMapPin(isSelected ? null : pin)}
                      className="flex flex-col items-center group cursor-pointer focus:outline-hidden"
                    >
                      {/* Pulse circle for busy centres */}
                      {isBusy && (
                        <span className="absolute -top-1 size-9 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
                      )}

                      {/* Teardrop Pin Marker */}
                      <div
                        className={cn(
                          "relative flex size-8 items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-slate-900 transition-all group-hover:scale-125",
                          pinBg,
                          isSelected && "ring-4 ring-primary/50 scale-125"
                        )}
                      >
                        <MapPin className="size-4.5 drop-shadow-xs" />
                      </div>

                      {/* City/Mandi Label Pill */}
                      <span
                        className={cn(
                          "mt-1 rounded-md border px-2 py-0.5 text-[11px] font-extrabold shadow-sm transition-colors whitespace-nowrap",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card/95 text-foreground hover:bg-card"
                        )}
                      >
                        {pin.name}
                      </span>
                    </button>

                    {/* Rich Interactive Floating Popup Card */}
                    {isSelected && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 rounded-2xl bg-card border border-primary/30 p-3.5 text-xs shadow-2xl z-50 animate-in fade-in zoom-in-95">
                        <div className="flex items-start justify-between gap-1.5 border-b pb-2">
                          <div>
                            <h3 className="font-display font-bold text-foreground text-sm leading-snug">
                              {pin.fullName}
                            </h3>
                            <span
                              className={cn(
                                "mt-0.5 inline-block text-[10px] font-extrabold px-2 py-0.2 rounded-full",
                                isBusy && "bg-rose-500/20 text-rose-700 dark:text-rose-400",
                                isModerate && "bg-amber-500/20 text-amber-700 dark:text-amber-400",
                                isLow && "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              )}
                            >
                              {pin.status} Traffic
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMapPin(null);
                            }}
                            className="size-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 py-2 text-[11px]">
                          <div className="rounded-lg bg-muted/60 p-1.5">
                            <span className="text-muted-foreground block text-[10px]">Queue</span>
                            <strong className="text-foreground font-bold">{pin.queue} farmers</strong>
                          </div>
                          <div className="rounded-lg bg-muted/60 p-1.5">
                            <span className="text-muted-foreground block text-[10px]">Avg. Wait</span>
                            <strong className="text-foreground font-bold">{pin.wait}</strong>
                          </div>
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="mt-1 w-full text-xs font-bold h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Link to="/farmer/book">
                            Book Slot Here →
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Announcements (5 cols on lg) */}
        <div className="surface-card flex flex-col justify-between p-5 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-foreground">
                Announcements
              </h2>
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View all
              </button>
            </div>

            <div className="space-y-3.5">
              {DASHBOARD_ANNOUNCEMENTS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3.5 rounded-2xl border bg-muted/30 p-3.5 transition-colors hover:bg-muted/60"
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      item.iconBg
                    )}
                  >
                    {item.type === "procurement" && <FileText className="size-5" />}
                    {item.type === "centre" && <Calendar className="size-5" />}
                    {item.type === "info" && <Info className="size-5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                      {item.date} · {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Updates published by District Food & Civil Supplies</span>
            <Bell className="size-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Route };
