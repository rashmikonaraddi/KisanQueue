const HOURLY_LOAD = {
  8: 0.9,
  9: 0.95,
  10: 1.05,
  11: 1.15,
  12: 1.18,
  13: 1,
  14: 0.92,
  15: 0.88
};
function predictWait(input) {
  const counters = Math.max(1, input.activeCounters);
  const hour = input.hourOfDay ?? (/* @__PURE__ */ new Date()).getHours();
  const hourFactor = HOURLY_LOAD[hour] ?? 1;
  const quantityFactor = input.quantityQuintals ? 1 + Math.min(input.quantityQuintals, 100) / 800 : 1;
  const base = input.farmersAhead * input.avgProcessingMin / counters;
  const minutes = Math.max(0, Math.round(base * hourFactor * quantityFactor));
  const congestion = input.farmersAhead / counters > 20 ? "High" : input.farmersAhead / counters > 7 ? "Medium" : "Low";
  const confidence = Math.max(72, Math.round(97 - input.farmersAhead * 0.33));
  return {
    minutes,
    confidence,
    congestion,
    factors: [
      { label: "Farmers ahead", value: String(input.farmersAhead) },
      { label: "Average processing time", value: `${input.avgProcessingMin.toFixed(1)} min/farmer` },
      { label: "Active counters", value: String(counters) },
      { label: "Current congestion", value: congestion }
    ]
  };
}
function expectedTurnTime(minutes, from = /* @__PURE__ */ new Date()) {
  const t = new Date(from.getTime() + minutes * 6e4);
  return t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function centreScore(o) {
  const travelMin = o.distanceKm * 2.2;
  const utilisation = o.todayAppointments / Math.max(1, o.capacity);
  return travelMin * 0.6 + o.waitMinutes * 1 + o.queueLength * 0.3 + utilisation * 40;
}
export {
  centreScore,
  expectedTurnTime,
  predictWait
};
