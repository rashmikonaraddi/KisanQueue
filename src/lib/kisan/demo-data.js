const DISCLAIMER = "This application is a demonstration prototype and is not an official Government of India portal.";
const CROPS = ["Rice", "Wheat", "Ragi", "Maize", "Jowar", "Tur Dal"];
const MSP = {
  Rice: 2320,
  Wheat: 2275,
  Ragi: 4290,
  Maize: 2225,
  Jowar: 3371,
  "Tur Dal": 7550
};
const MY_CENTRE_ID = "c1";
const MY_TOKEN = "A-047";
const CENTRES = [
  {
    id: "c1",
    name: "Mysuru Central Procurement Centre",
    state: "Karnataka",
    district: "Mysuru",
    village: "Bannimantap",
    distanceKm: 4.2,
    capacity: 200,
    activeCounters: 2,
    avgProcessingMin: 2.8,
    queueLength: 18,
    todayAppointments: 146,
    completed: 119,
    crops: ["Rice", "Ragi", "Maize"],
    open: true,
    lat: 42,
    lng: 34
  },
  {
    id: "c2",
    name: "Nanjangud Taluk Centre",
    state: "Karnataka",
    district: "Mysuru",
    village: "Nanjangud",
    distanceKm: 7.1,
    capacity: 160,
    activeCounters: 3,
    avgProcessingMin: 2.4,
    queueLength: 6,
    todayAppointments: 84,
    completed: 71,
    crops: ["Rice", "Wheat", "Ragi"],
    open: true,
    lat: 66,
    lng: 58
  },
  {
    id: "c3",
    name: "Hunsur Agricultural Yard",
    state: "Karnataka",
    district: "Mysuru",
    village: "Hunsur",
    distanceKm: 11.4,
    capacity: 140,
    activeCounters: 2,
    avgProcessingMin: 3.4,
    queueLength: 42,
    todayAppointments: 128,
    completed: 74,
    crops: ["Rice", "Maize"],
    open: true,
    lat: 22,
    lng: 62
  },
  {
    id: "c4",
    name: "Mandya District Centre",
    state: "Karnataka",
    district: "Mandya",
    village: "Mandya",
    distanceKm: 18.6,
    capacity: 220,
    activeCounters: 4,
    avgProcessingMin: 2.6,
    queueLength: 27,
    todayAppointments: 171,
    completed: 132,
    crops: ["Rice", "Jowar", "Tur Dal"],
    open: true,
    lat: 58,
    lng: 18
  },
  {
    id: "c5",
    name: "Hassan Regional Centre",
    state: "Karnataka",
    district: "Hassan",
    village: "Hassan",
    distanceKm: 24.3,
    capacity: 180,
    activeCounters: 3,
    avgProcessingMin: 3,
    queueLength: 58,
    todayAppointments: 164,
    completed: 96,
    crops: ["Ragi", "Maize", "Wheat"],
    open: true,
    lat: 30,
    lng: 14
  },
  {
    id: "c6",
    name: "Chamarajanagar Centre",
    state: "Karnataka",
    district: "Chamarajanagar",
    village: "Chamarajanagar",
    distanceKm: 31.2,
    capacity: 120,
    activeCounters: 2,
    avgProcessingMin: 2.9,
    queueLength: 11,
    todayAppointments: 62,
    completed: 48,
    crops: ["Jowar", "Maize"],
    open: true,
    lat: 76,
    lng: 74
  },
  {
    id: "c7",
    name: "Tumakuru North Centre",
    state: "Karnataka",
    district: "Tumakuru",
    village: "Gubbi",
    distanceKm: 52.8,
    capacity: 150,
    activeCounters: 3,
    avgProcessingMin: 2.7,
    queueLength: 34,
    todayAppointments: 118,
    completed: 79,
    crops: ["Ragi", "Rice"],
    open: true,
    lat: 14,
    lng: 40
  },
  {
    id: "c8",
    name: "Ballari Mandi Centre",
    state: "Karnataka",
    district: "Ballari",
    village: "Ballari",
    distanceKm: 96.4,
    capacity: 240,
    activeCounters: 4,
    avgProcessingMin: 3.1,
    queueLength: 71,
    todayAppointments: 203,
    completed: 128,
    crops: ["Jowar", "Maize", "Tur Dal"],
    open: true,
    lat: 84,
    lng: 26
  },
  {
    id: "c9",
    name: "Belagavi District Yard",
    state: "Karnataka",
    district: "Belagavi",
    village: "Belagavi",
    distanceKm: 118.7,
    capacity: 190,
    activeCounters: 3,
    avgProcessingMin: 2.5,
    queueLength: 19,
    todayAppointments: 137,
    completed: 112,
    crops: ["Wheat", "Jowar"],
    open: true,
    lat: 48,
    lng: 84
  },
  {
    id: "c10",
    name: "Kalaburagi Procurement Hub",
    state: "Karnataka",
    district: "Kalaburagi",
    village: "Kalaburagi",
    distanceKm: 142.1,
    capacity: 210,
    activeCounters: 2,
    avgProcessingMin: 3.6,
    queueLength: 64,
    todayAppointments: 158,
    completed: 88,
    crops: ["Tur Dal", "Jowar"],
    open: false,
    lat: 68,
    lng: 46
  }
];
const FIRST = [
  "Ravi",
  "Suresh",
  "Anil",
  "Mahadeva",
  "Kempanna",
  "Lakshmi",
  "Nagaraj",
  "Shivamma",
  "Basavaraj",
  "Gowramma",
  "Manjunath",
  "Puttaswamy",
  "Yellappa",
  "Rukmini",
  "Devaraj",
  "Siddappa",
  "Chandru",
  "Ningappa",
  "Sarojamma",
  "Hanumanth"
];
const LAST = [
  "Kumar",
  "Gowda",
  "Naik",
  "Patil",
  "Shetty",
  "Reddy",
  "Bai",
  "Hegde",
  "Rao",
  "Murthy"
];
const VILLAGES = [
  "Bannur",
  "Hootagalli",
  "Varuna",
  "Kadakola",
  "Ilwala",
  "Yelwal",
  "Srirangapatna",
  "Bilikere",
  "Saligrama",
  "T. Narasipura"
];
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}
const CURATED_FARMERS = [
  "Ramesh Gowda", "Suresh Patil", "Lakshmi Devi", "Manjunath Naik", "Basavaraj Patil",
  "Anil Kumar", "Mahadeva Swamy", "Kempanna Gowda", "Shivamma Murthy", "Gowramma Bai",
  "Puttaswamy Hegde", "Yellappa Shetty", "Rukmini Devi", "Devaraj Reddy", "Siddappa Rao",
  "Chandru Naik", "Ningappa Patil", "Sarojamma Gowda", "Hanumanth Rao", "Shankara Murthy",
  "Venkatesh Gowda", "Raghavendra Hegde", "Mallikarjun Patil", "Gangadhar Swamy", "Nagendra Naik"
];

const CURRENT_TOKEN_INDEX = 29;

function buildQueue(userName = "Ravi Kumar", userCrop = "Rice", userQuantity = 42) {
  const entries = [];
  for (let i = 1; i <= 146; i++) {
    const token = `A-${String(i).padStart(3, "0")}`;
    const isMe = token === MY_TOKEN;
    const name = isMe ? userName : CURATED_FARMERS[(i - 1) % CURATED_FARMERS.length];
    const crop = isMe ? userCrop : CROPS[(i * 3) % CROPS.length];
    const quantity = isMe ? userQuantity : 15 + ((i * 7) % 55);
    let status = "waiting";
    if (i < CURRENT_TOKEN_INDEX) status = (i % 23 === 0) ? "no-show" : "completed";
    else if (i === CURRENT_TOKEN_INDEX) status = "processing";
    entries.push({
      token,
      farmerId: `F${1e3 + i}`,
      farmerName: name,
      village: VILLAGES[(i - 1) % VILLAGES.length],
      crop,
      quantity,
      status,
      isMe
    });
  }
  return entries;
}
const PAST_PROCUREMENTS = [
  {
    id: "PRC-2026-0912",
    date: "2026-06-14",
    centreId: "c1",
    centreName: "Mysuru Central Procurement Centre",
    crop: "Ragi",
    quantity: 28,
    qualityGrade: "A",
    ratePerQuintal: 4290,
    gross: 120120,
    deductions: 2402,
    net: 117718,
    procurementStatus: "completed",
    paymentStatus: "completed",
    txnId: "TXN982341"
  },
  {
    id: "PRC-2026-0644",
    date: "2026-04-02",
    centreId: "c2",
    centreName: "Nanjangud Taluk Centre",
    crop: "Rice",
    quantity: 36,
    qualityGrade: "A",
    ratePerQuintal: 2320,
    gross: 83520,
    deductions: 1670,
    net: 81850,
    procurementStatus: "completed",
    paymentStatus: "completed",
    txnId: "TXN901772"
  },
  {
    id: "PRC-2025-1188",
    date: "2025-12-11",
    centreId: "c1",
    centreName: "Mysuru Central Procurement Centre",
    crop: "Maize",
    quantity: 19,
    qualityGrade: "B",
    ratePerQuintal: 2225,
    gross: 42275,
    deductions: 1268,
    net: 41007,
    procurementStatus: "completed",
    paymentStatus: "completed",
    txnId: "TXN845019"
  },
  {
    id: "PRC-2025-0731",
    date: "2025-09-27",
    centreId: "c3",
    centreName: "Hunsur Agricultural Yard",
    crop: "Rice",
    quantity: 44,
    qualityGrade: "A",
    ratePerQuintal: 2183,
    gross: 96052,
    deductions: 1921,
    net: 94131,
    procurementStatus: "completed",
    paymentStatus: "completed",
    txnId: "TXN790233"
  }
];
const DEMO_GRIEVANCES = [
  {
    id: "GRV-2026-0988",
    category: "Payment issue",
    description: "Payment for the June procurement was credited 9 days after the bill was generated.",
    centreName: "Mysuru Central Procurement Centre",
    contact: "Phone call",
    status: "Resolved",
    createdAt: "2026-06-24"
  }
];
const PROCUREMENT_TREND = [
  { day: "Mon", quintals: 8420, farmers: 940 },
  { day: "Tue", quintals: 9110, farmers: 1012 },
  { day: "Wed", quintals: 7860, farmers: 884 },
  { day: "Thu", quintals: 10240, farmers: 1156 },
  { day: "Fri", quintals: 11380, farmers: 1264 },
  { day: "Sat", quintals: 9650, farmers: 1078 },
  { day: "Sun", quintals: 5120, farmers: 602 }
];
const DISTRICT_VOLUME = [
  { district: "Mysuru", quintals: 18420 },
  { district: "Mandya", quintals: 15230 },
  { district: "Hassan", quintals: 12110 },
  { district: "Ballari", quintals: 16880 },
  { district: "Belagavi", quintals: 13940 },
  { district: "Kalaburagi", quintals: 11260 }
];
const WAIT_TREND = [
  { hour: "08:00", minutes: 18 },
  { hour: "09:00", minutes: 26 },
  { hour: "10:00", minutes: 41 },
  { hour: "11:00", minutes: 58 },
  { hour: "12:00", minutes: 62 },
  { hour: "13:00", minutes: 47 },
  { hour: "14:00", minutes: 34 },
  { hour: "15:00", minutes: 22 }
];
const PAYMENT_STATUS_SPLIT = [
  { name: "Completed", value: 6420 },
  { name: "Processing", value: 1180 },
  { name: "Bill generated", value: 640 },
  { name: "Pending", value: 270 }
];
const LIVE_CENTRES_OVERVIEW = [
  { id: "m1", name: "Rampur Mandi", queue: 65, avgWaitMin: 35, status: "Moderate", tone: "warning", location: "Rampur Block", activeCounters: 3 },
  { id: "m2", name: "Shivpur Centre", queue: 120, avgWaitMin: 55, status: "Busy", tone: "danger", location: "Shivpur East", activeCounters: 2 },
  { id: "m3", name: "Bhainsa Kendra", queue: 32, avgWaitMin: 20, status: "Low", tone: "success", location: "Bhainsa Rural", activeCounters: 4 },
  { id: "m4", name: "Madhopur Centre", queue: 80, avgWaitMin: 45, status: "Busy", tone: "danger", location: "Madhopur Main", activeCounters: 2 },
  { id: "m5", name: "Kalyanpur Mandi", queue: 18, avgWaitMin: 15, status: "Low", tone: "success", location: "Kalyanpur Block", activeCounters: 3 }
];

const HOURLY_QUEUE_TREND = [
  { time: "6 AM", farmers: 320, waitTime: 22 },
  { time: "8 AM", farmers: 780, waitTime: 48 },
  { time: "10 AM", farmers: 1350, waitTime: 56 },
  { time: "12 PM", farmers: 1680, waitTime: 46 },
  { time: "2 PM", farmers: 1050, waitTime: 38 },
  { time: "4 PM", farmers: 920, waitTime: 52 },
  { time: "6 PM", farmers: 410, waitTime: 42 }
];

const CENTRE_SPECIFIC_TRENDS = {
  all: HOURLY_QUEUE_TREND,
  "Rampur Mandi": [
    { time: "6 AM", farmers: 45, waitTime: 15 },
    { time: "8 AM", farmers: 95, waitTime: 30 },
    { time: "10 AM", farmers: 140, waitTime: 45 },
    { time: "12 PM", farmers: 110, waitTime: 35 },
    { time: "2 PM", farmers: 75, waitTime: 28 },
    { time: "4 PM", farmers: 65, waitTime: 32 },
    { time: "6 PM", farmers: 30, waitTime: 18 }
  ],
  "Shivpur Centre": [
    { time: "6 AM", farmers: 60, waitTime: 25 },
    { time: "8 AM", farmers: 130, waitTime: 50 },
    { time: "10 AM", farmers: 190, waitTime: 65 },
    { time: "12 PM", farmers: 160, waitTime: 55 },
    { time: "2 PM", farmers: 120, waitTime: 45 },
    { time: "4 PM", farmers: 100, waitTime: 50 },
    { time: "6 PM", farmers: 45, waitTime: 30 }
  ],
  "Bhainsa Kendra": [
    { time: "6 AM", farmers: 20, waitTime: 10 },
    { time: "8 AM", farmers: 40, waitTime: 18 },
    { time: "10 AM", farmers: 65, waitTime: 25 },
    { time: "12 PM", farmers: 50, waitTime: 20 },
    { time: "2 PM", farmers: 35, waitTime: 15 },
    { time: "4 PM", farmers: 32, waitTime: 18 },
    { time: "6 PM", farmers: 15, waitTime: 10 }
  ]
};

const DASHBOARD_ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "Wheat procurement extended till 31 May.",
    date: "21 May 2025",
    time: "09:15 AM",
    type: "procurement",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
  },
  {
    id: "a2",
    title: "New centre opened in Kalyanpur Block.",
    date: "20 May 2025",
    time: "04:30 PM",
    type: "centre",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400"
  },
  {
    id: "a3",
    title: "Bring original Aadhar and land documents.",
    date: "18 May 2025",
    time: "11:00 AM",
    type: "info",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400"
  }
];

const MAP_CENTRES = [
  { id: "c1", name: "Rampur", fullName: "Rampur Mandi", x: 16, y: 72, status: "Moderate", queue: 65, wait: "35 min", tone: "warning", counters: 3, capacity: 180 },
  { id: "c2", name: "Shivpur", fullName: "Shivpur Centre", x: 28, y: 26, status: "Busy", queue: 120, wait: "55 min", tone: "danger", counters: 2, capacity: 160 },
  { id: "c3", name: "Bhainsa", fullName: "Bhainsa Kendra", x: 62, y: 28, status: "Low", queue: 32, wait: "20 min", tone: "success", counters: 4, capacity: 140 },
  { id: "c4", name: "Madhopur", fullName: "Madhopur Centre", x: 68, y: 82, status: "Busy", queue: 80, wait: "45 min", tone: "danger", counters: 2, capacity: 200 },
  { id: "c7", name: "Kalyanpur", fullName: "Kalyanpur Mandi", x: 88, y: 76, status: "Low", queue: 18, wait: "15 min", tone: "success", counters: 3, capacity: 150 },
  { id: "c6", name: "Varuna", fullName: "Varuna Yard", x: 34, y: 88, status: "Low", queue: 14, wait: "12 min", tone: "success", counters: 2, capacity: 120 }
];

const ADMIN_ALERTS = [
  {
    level: "high",
    title: "High Queue",
    message: "Ballari Mandi Centre has exceeded 80% of its daily capacity (203/240)."
  },
  {
    level: "medium",
    title: "Payment Delay",
    message: "27 procurement payments are pending beyond the expected 72-hour processing window."
  },
  {
    level: "medium",
    title: "Processing Delay",
    message: "Hunsur Agricultural Yard processing speed is 24% slower than its daily average."
  },
  {
    level: "low",
    title: "Centre Closed",
    message: "Kalaburagi Procurement Hub is marked closed today — 64 farmers need reassignment."
  }
];

export {
  ADMIN_ALERTS,
  CENTRES,
  CENTRE_SPECIFIC_TRENDS,
  CROPS,
  CURRENT_TOKEN_INDEX,
  DASHBOARD_ANNOUNCEMENTS,
  DEMO_GRIEVANCES,
  DISCLAIMER,
  DISTRICT_VOLUME,
  HOURLY_QUEUE_TREND,
  LIVE_CENTRES_OVERVIEW,
  MAP_CENTRES,
  MSP,
  MY_CENTRE_ID,
  MY_TOKEN,
  PAST_PROCUREMENTS,
  PAYMENT_STATUS_SPLIT,
  PROCUREMENT_TREND,
  WAIT_TREND,
  buildQueue
};
