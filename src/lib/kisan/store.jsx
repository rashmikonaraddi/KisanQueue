import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { toast } from "sonner";
import {
  CENTRES,
  CURRENT_TOKEN_INDEX,
  DEMO_GRIEVANCES,
  MSP,
  MY_CENTRE_ID,
  MY_TOKEN,
  PAST_PROCUREMENTS,
  buildQueue
} from "./demo-data";
import { predictWait, expectedTurnTime } from "./prediction";
const tokenIndex = (t) => Number(t.split("-")[1]);
const DEFAULT_PROFILE = {
  name: "Ravi Kumar",
  phone: "9999999999",
  language: "en",
  state: "Karnataka",
  district: "Mysuru",
  village: "Bannur",
  farmerCode: "KA-MYS-F1047",
  landArea: 3.5,
  crop: "Rice",
  preferredCentreId: MY_CENTRE_ID
};
const DEFAULT_BOOKING = {
  token: MY_TOKEN,
  centreId: MY_CENTRE_ID,
  crop: "Rice",
  quantity: 42,
  date: "2026-08-28",
  timeSlot: "11:00 AM \u2013 12:00 PM"
};
const STAGE_ORDER = [
  "booked",
  "arrived",
  "called",
  "started",
  "quality",
  "quantity",
  "completed",
  "payment-processing",
  "payment-completed"
];
const StoreContext = createContext(null);

function loadStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage save failed:", err);
  }
}

function KisanProvider({ children }) {
  const [role, setRoleState] = useState(() => loadStorage("kq_role", null));
  const [profile, setProfileState] = useState(() => loadStorage("kq_profile", DEFAULT_PROFILE));
  const [booking, setBookingState] = useState(() => loadStorage("kq_booking", DEFAULT_BOOKING));
  const [centres, setCentresState] = useState(() => loadStorage("kq_centres", CENTRES.map((c) => ({ ...c }))));
  const [queue, setQueueState] = useState(() => {
    const stored = loadStorage("kq_queue", null);
    if (stored && Array.isArray(stored) && stored.length > 0) return stored;
    return buildQueue();
  });
  const [currentServing, setCurrentServing] = useState(() => loadStorage("kq_serving", CURRENT_TOKEN_INDEX));
  const [stage, setStage] = useState(() => loadStorage("kq_stage", "booked"));
  const [currentProcurement, setCurrentProcurement] = useState(() => loadStorage("kq_procurement", null));
  const [history, setHistory] = useState(() => loadStorage("kq_history", PAST_PROCUREMENTS));
  const [grievances, setGrievances] = useState(() => loadStorage("kq_grievances", DEMO_GRIEVANCES));
  const [simulating, setSimulating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [notifications, setNotifications] = useState(() => loadStorage("kq_notifications", [
    {
      id: "n1",
      kind: "slot",
      title: "Slot Reminder",
      message: "Your procurement slot at Mysuru Central Procurement Centre starts at 11:00 AM.",
      time: "08:40 AM",
      read: false
    },
    {
      id: "n2",
      kind: "queue",
      title: "Queue Update",
      message: "Token A-029 is now being served. You are 18 positions away.",
      time: "10:48 AM",
      read: false
    }
  ]));

  const setRole = useCallback((r) => {
    setRoleState(r);
    saveStorage("kq_role", r);
  }, []);

  const setProfile = useCallback((updater) => {
    setProfileState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStorage("kq_profile", next);

      // Sync user's name in queue
      if (next?.name) {
        setQueueState((qPrev) => {
          const qNext = qPrev.map((q) => {
            if (q.isMe || q.token === (booking?.token || MY_TOKEN)) {
              return {
                ...q,
                farmerName: next.name,
                village: next.village || q.village
              };
            }
            return q;
          });
          saveStorage("kq_queue", qNext);
          return qNext;
        });
      }

      return next;
    });
  }, [booking?.token]);

  const setCentres = useCallback((updater) => {
    setCentresState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStorage("kq_centres", next);
      return next;
    });
  }, []);

  const setQueue = useCallback((updater) => {
    setQueueState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStorage("kq_queue", next);
      return next;
    });
  }, []);

  // Update booking and synchronize queue for the user
  const setBooking = useCallback((updater) => {
    setBookingState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveStorage("kq_booking", next);

      // Sync queue item for MY_TOKEN / next.token
      setQueueState((qPrev) => {
        const qNext = qPrev.map((q) => {
          if (q.token === (next.token || MY_TOKEN) || q.isMe) {
            return {
              ...q,
              crop: next.crop,
              quantity: Number(next.quantity) || q.quantity
            };
          }
          return q;
        });
        saveStorage("kq_queue", qNext);
        return qNext;
      });

      return next;
    });
  }, []);

  const updateQuantity = useCallback((newQty) => {
    const qty = Number(newQty);
    if (isNaN(qty) || qty <= 0) return;
    setBooking((prev) => ({
      ...prev,
      quantity: qty
    }));
    toast.success("Quantity updated", {
      description: `Procurement quantity set to ${qty} quintals.`
    });
  }, [setBooking]);

  const updateBooking = useCallback((updates) => {
    setBooking((prev) => ({
      ...prev,
      ...updates
    }));
  }, [setBooking]);

  const myIndex = tokenIndex(booking?.token || MY_TOKEN);

  const myEntry = useMemo(() => {
    const found = queue.find((q) => q.token === (booking?.token || MY_TOKEN) || q.isMe);
    if (found) {
      return {
        ...found,
        quantity: booking.quantity ?? found.quantity,
        crop: booking.crop ?? found.crop
      };
    }
    return {
      token: booking?.token || MY_TOKEN,
      farmerId: "F1047",
      farmerName: profile.name,
      village: profile.village,
      crop: booking.crop,
      quantity: booking.quantity,
      status: "waiting",
      isMe: true
    };
  }, [queue, booking, profile]);

  const myCentre = centres.find((c) => c.id === booking.centreId) ?? centres[0];

  const farmersAhead = useMemo(
    () => queue.filter(
      (q) => tokenIndex(q.token) > currentServing && tokenIndex(q.token) < myIndex && q.status !== "completed" && q.status !== "no-show"
    ).length + (currentServing < myIndex ? 1 : 0),
    [queue, currentServing, myIndex]
  );

  const prediction = useMemo(
    () => predictWait({
      farmersAhead: Math.max(0, farmersAhead - 1),
      avgProcessingMin: myCentre.avgProcessingMin,
      activeCounters: myCentre.activeCounters,
      hourOfDay: 11,
      quantityQuintals: booking.quantity
    }),
    [farmersAhead, myCentre, booking.quantity]
  );

  const expectedTurn = useMemo(() => expectedTurnTime(prediction.minutes), [prediction.minutes]);

  const pushNotification = useCallback((n) => {
    const item = {
      ...n,
      id: `n${Math.random().toString(36).slice(2, 9)}`,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      read: false
    };
    setNotifications((prev) => {
      const next = [item, ...prev];
      saveStorage("kq_notifications", next);
      return next;
    });
    toast(n.title, { description: n.message });
  }, []);

  const advanceStage = useCallback((s) => {
    setStage((prev) => {
      const next = STAGE_ORDER.indexOf(s) > STAGE_ORDER.indexOf(prev) ? s : prev;
      saveStorage("kq_stage", next);
      return next;
    });
  }, []);

  const notifiedRef = useRef(new Set());

  useEffect(() => {
    if (!simulating) return;
    const id = setInterval(() => {
      setCurrentServing((prev) => {
        const next = Math.min(prev + 2, myIndex);
        saveStorage("kq_serving", next);
        return next;
      });
      setQueue((prev) =>
        prev.map((q) => {
          const i = tokenIndex(q.token);
          if (i < currentServing && q.status === "waiting") return { ...q, status: "completed" };
          return q;
        })
      );
      setCentres((prev) =>
        prev.map((c) =>
          c.id === MY_CENTRE_ID
            ? {
                ...c,
                queueLength: Math.max(0, c.queueLength - 2),
                completed: Math.min(c.todayAppointments, c.completed + 2)
              }
            : c
        )
      );
      setLastUpdated(new Date());
    }, 2200);
    return () => clearInterval(id);
  }, [simulating, currentServing, myIndex, setCentres, setQueue]);

  useEffect(() => {
    const ahead = Math.max(0, myIndex - currentServing);
    const fire = (key, n) => {
      if (notifiedRef.current.has(key)) return;
      notifiedRef.current.add(key);
      pushNotification(n);
    };
    if (ahead <= 12 && ahead > 5) {
      fire("approach-12", {
        kind: "queue",
        title: "Queue Update",
        message: `Your token ${booking.token} is approaching. ${ahead} farmers are ahead of you.`
      });
    }
    if (ahead <= 5 && ahead > 0) {
      fire("approach-5", {
        kind: "queue",
        title: "Almost Your Turn",
        message: `Your turn is approaching. Please proceed to Counter 2. ${ahead} farmers ahead.`
      });
    }
    if (ahead === 0) {
      fire("your-turn", {
        kind: "queue",
        title: "Your Turn",
        message: `Token ${booking.token} — please proceed to Counter 2 for procurement.`
      });
      setQueue((prev) =>
        prev.map((q) => ((q.token === booking.token || q.isMe) && q.status === "waiting" ? { ...q, status: "arrived" } : q))
      );
      advanceStage("arrived");
      advanceStage("called");
      setSimulating(false);
    }
  }, [currentServing, myIndex, pushNotification, advanceStage, booking.token, setQueue]);

  const operatorAction = useCallback(
    (token, action) => {
      setQueue((prev) =>
        prev.map((q) => {
          if (q.token !== token) return q;
          if (action === "call") return { ...q, status: "arrived" };
          if (action === "arrive") return { ...q, status: "arrived" };
          if (action === "start") return { ...q, status: "processing" };
          if (action === "complete") return { ...q, status: "completed" };
          return { ...q, status: "no-show" };
        })
      );
      setLastUpdated(new Date());
      if (token !== (booking?.token || MY_TOKEN)) return;
      if (action === "call") {
        advanceStage("called");
        pushNotification({
          kind: "queue",
          title: "Token Called",
          message: `Token ${booking.token} has been called. Please proceed to Counter 2.`
        });
      }
      if (action === "arrive") advanceStage("arrived");
      if (action === "start") {
        advanceStage("started");
        setCurrentServing(myIndex);
        pushNotification({
          kind: "procurement",
          title: "Procurement Started",
          message: "The operator has started your procurement at Counter 2."
        });
      }
      if (action === "no-show") {
        pushNotification({
          kind: "alert",
          title: "Marked No-show",
          message: "You were marked as a no-show. Please reschedule your slot."
        });
      }
    },
    [advanceStage, pushNotification, myIndex, booking.token, setQueue]
  );

  const completeProcurement = useCallback(
    ({ quantity, qualityGrade, moisture, vehicle, remarks }) => {
      const rate = MSP[booking.crop] ?? 2320;
      const gross = Math.round(rate * quantity);
      const deductions = Math.round(gross * (qualityGrade === "A" ? 0.02 : 0.03));
      const proc = {
        id: `PRC-2026-1047`,
        date: booking.date,
        centreId: booking.centreId,
        centreName: myCentre.name,
        crop: booking.crop,
        quantity,
        qualityGrade,
        ratePerQuintal: rate,
        gross,
        deductions,
        net: gross - deductions,
        procurementStatus: "completed",
        paymentStatus: "processing"
      };
      setCurrentProcurement(proc);
      saveStorage("kq_procurement", proc);
      setQueue((prev) =>
        prev.map((q) =>
          q.token === booking.token || q.isMe
            ? { ...q, status: "completed", qualityGrade, moisture, vehicle, remarks, quantity }
            : q
        )
      );
      advanceStage("quality");
      advanceStage("quantity");
      advanceStage("completed");
      advanceStage("payment-processing");
      pushNotification({
        kind: "procurement",
        title: "Procurement Completed",
        message: `Your procurement of ${quantity} quintals ${booking.crop} has been successfully recorded.`
      });
      setTimeout(() => {
        pushNotification({
          kind: "payment",
          title: "Payment Update",
          message: `Bill generated. Payment of ₹${(gross - deductions).toLocaleString("en-IN")} has been initiated.`
        });
      }, 1500);
    },
    [booking, myCentre.name, advanceStage, pushNotification, setQueue]
  );

  const markPaymentCompleted = useCallback(() => {
    setCurrentProcurement((prev) => {
      if (!prev) return prev;
      const done = {
        ...prev,
        paymentStatus: "completed",
        txnId: "TXN" + Math.floor(1e5 + Math.random() * 899999)
      };
      setHistory((h) => {
        const next = [done, ...h.filter((x) => x.id !== done.id)];
        saveStorage("kq_history", next);
        return next;
      });
      saveStorage("kq_procurement", done);
      return done;
    });
    advanceStage("payment-completed");
    pushNotification({
      kind: "payment",
      title: "Payment Completed",
      message: "Your payment has been credited to your registered bank account."
    });
  }, [advanceStage, pushNotification]);

  const addGrievance = useCallback((g) => {
    const id = `GRV-2026-${Math.floor(1e3 + Math.random() * 8999)}`;
    setGrievances((prev) => {
      const next = [
        { ...g, id, status: "Submitted", createdAt: new Date().toISOString().slice(0, 10) },
        ...prev
      ];
      saveStorage("kq_grievances", next);
      return next;
    });
    return id;
  }, []);

  const resetDemo = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kq_booking");
      localStorage.removeItem("kq_queue");
      localStorage.removeItem("kq_centres");
      localStorage.removeItem("kq_serving");
      localStorage.removeItem("kq_stage");
      localStorage.removeItem("kq_procurement");
      localStorage.removeItem("kq_history");
      localStorage.removeItem("kq_notifications");
      localStorage.removeItem("kq_grievances");
    }
    notifiedRef.current = new Set();
    setBookingState(DEFAULT_BOOKING);
    setQueueState(buildQueue());
    setCurrentServing(CURRENT_TOKEN_INDEX);
    setCentresState(CENTRES.map((c) => ({ ...c })));
    setStage("booked");
    setCurrentProcurement(null);
    setHistory(PAST_PROCUREMENTS);
    setSimulating(false);
    setLastUpdated(new Date());
    toast.success("Reset completed", { description: "Restored to default state." });
  }, []);

  const value = {
    role,
    signIn: setRole,
    signOut: () => setRole(null),
    profile,
    setProfile,
    booking,
    setBooking,
    updateBooking,
    updateQuantity,
    centres,
    queue,
    currentServing,
    myEntry,
    farmersAhead: Math.max(0, myIndex - currentServing),
    prediction,
    expectedTurn,
    lastUpdated,
    stage,
    stageIndex: STAGE_ORDER.indexOf(stage),
    advanceStage,
    currentProcurement,
    completeProcurement,
    markPaymentCompleted,
    history,
    notifications,
    markAllRead: () =>
      setNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, read: true }));
        saveStorage("kq_notifications", next);
        return next;
      }),
    pushNotification,
    grievances,
    addGrievance,
    simulating,
    toggleSimulation: () => setSimulating((s) => !s),
    resetDemo,
    operatorAction
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
function useKisan() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useKisan must be used inside KisanProvider");
  return ctx;
}
export {
  KisanProvider,
  STAGE_ORDER,
  useKisan
};
