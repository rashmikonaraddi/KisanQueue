const rules = [
  {
    match: /token|queue|position|ahead|sardi|turn|when/i,
    reply: (c) => `Your token is ${c.token}. There are currently ${c.farmersAhead} farmers ahead of you. Your estimated waiting time is ${c.waitMinutes} minutes, so your turn is expected around ${c.expectedTurn}.`
  },
  {
    match: /payment|paisa|amount|money|credited/i,
    reply: (c) => c.netAmount === null ? `No payment has been generated yet. Once your procurement is completed, a bill is generated and the net payable amount appears under Payments \u2014 usually credited within 72 hours.` : `Your payment status is "${c.paymentStatus}". Net payable is \u20B9${c.netAmount.toLocaleString("en-IN")} for ${c.quantity} quintals of ${c.crop}. You can follow each step on the Payments page.`
  },
  {
    match: /centre|center|where|location|direction|far|distance/i,
    reply: (c) => `Your procurement centre is ${c.centreName}, about ${c.centreDistanceKm} km away. Use "Get Directions" on your dashboard for the route, and check "Find Centre" if you would like a less crowded alternative.`
  },
  {
    match: /document|paper|carry|bring|proof/i,
    reply: () => `Please carry your Farmer ID card, land record (RTC/Pahani) copy, bank passbook copy and the crop lot in clean bags. Keep your digital token open on your phone for faster verification at the gate.`
  },
  {
    match: /procurement status|status of my crop|quality|grade|weigh/i,
    reply: (c) => `Your procurement status is "${c.procurementStatus}" for ${c.quantity} quintals of ${c.crop}. Quality grading and weighing happen at the counter, and each step is shown on your Procurement timeline.`
  },
  {
    match: /reschedul|change slot|cancel|postpone/i,
    reply: (c) => `Your current slot is ${c.timeSlot} at ${c.centreName}. Open Book Slot, pick a new date and available time band, and confirm \u2014 your token is reissued automatically and the old one is released.`
  },
  {
    match: /slot|time|appointment/i,
    reply: (c) => `Your slot is ${c.timeSlot} at ${c.centreName} with token ${c.token}.`
  }
];
async function askAssistant(question, ctx) {
  await new Promise((r) => setTimeout(r, 450));
  const rule = rules.find((r) => r.match.test(question));
  if (rule) return { text: rule.reply(ctx) };
  return {
    text: `Namaste ${ctx.farmerName.split(" ")[0]}! I can help with your queue position, slot details, procurement status, payment progress, required documents and centre directions. Try asking "When will my turn come?" or use the quick buttons below.`
  };
}
const QUICK_PROMPTS = [
  { label: "My Queue", question: "What is my queue position?" },
  { label: "My Payment", question: "Has my payment been processed?" },
  { label: "My Centre", question: "Where is my procurement centre?" },
  { label: "Slot Details", question: "What are my slot details?" }
];
export {
  QUICK_PROMPTS,
  askAssistant
};
