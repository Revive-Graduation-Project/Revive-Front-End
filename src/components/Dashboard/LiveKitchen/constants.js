/**
 * LiveKitchen — shared constants & pure helpers
 * No React imports — safe to use anywhere.
 */

// ── Kanban columns ─────────────────────────────────────────────────
export const COLUMNS = [
  { key: "queue",     label: "Order Queue", action: "Start Preparing", nextStatus: "preparing", prevStatus: null        },
  { key: "preparing", label: "Preparing",   action: "Prepared",        nextStatus: "ready",     prevStatus: "queue"     },
  { key: "ready",     label: "Ready",       action: "Ready",           nextStatus: "done",      prevStatus: "preparing" },
];

// ── Kitchen ticket constants ───────────────────────────────────────
export const TICKET_TABS = ["All", "Queue", "Preparing", "Ready", "Done"];
export const TICKET_HEADERS = ["Ticket ID", "Order ID", "Status", "Assigned Chef", "Time Elapsed", "Actions"];
export const STATIONS = ["UNASSIGNED", "GRILL", "PREP", "FRY", "PASTRY", "SALADS"];

export const STATUS_FLOW = {
  Queue:     { next: "Preparing", label: "Start Preparing" },
  Preparing: { next: "Ready",     label: "Mark Ready" },
  Ready:     { next: "Done",      label: "Mark Done"  },
};

// ── Pure helpers ──────────────────────────────────────────────────
export function getActionButtonStyle(action) {
  if (action === "Start Preparing") return "bg-white text-[#1a1a1a] border border-[#d1d5db] hover:bg-gray-50";
  if (action === "Prepared")        return "bg-[#F97316] text-white border border-transparent hover:bg-orange-600 shadow-sm";
  if (action === "Ready")           return "bg-[#16A34A] text-white border border-transparent hover:bg-green-700 shadow-sm";
  return "";
}

export function getTicketActionStyle(status) {
  if (status === "Queue")     return "bg-white text-[#1a1a1a] border border-[#d1d5db] hover:bg-gray-50";
  if (status === "Preparing") return "bg-[#F97316] text-white hover:bg-orange-600";
  if (status === "Ready")     return "bg-[#16A34A] text-white hover:bg-green-700";
  return "";
}

export function formatTicketTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours}h ${diffMins % 60}m ago`;
}

/** Build a deduplicated chef list from ticket data. */
export function buildChefsFromTickets(tickets) {
  const chefsMap = new Map();
  const safe = Array.isArray(tickets) ? tickets : [];

  safe.forEach((t) => {
    if (t.assignedChefId == null) return;
    if (!chefsMap.has(t.assignedChefId)) {
      chefsMap.set(t.assignedChefId, {
        id:          t.assignedChefId,
        displayName: t.chefDisplayName || `Chef #${t.assignedChefId}`,
        station:     t.chefStation     || "UNASSIGNED",
        status:      t.chefStatus      || "ACTIVE",
        ticketCount: 0,
      });
    }
    chefsMap.get(t.assignedChefId).ticketCount += 1;
  });

  return Array.from(chefsMap.values());
}
