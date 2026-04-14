import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { getKitchenOrders, updateOrderStatus } from "../../services/dashboardService";
import { mockKitchenIngredients } from "../../mocks/dashboardMock";
import { FiClock, FiList } from "react-icons/fi";

const COLUMNS = [
  { key: "queue",     label: "Order Queue", color: "#9CA3AF", bg: "bg-gray-50",   borderColor: "border-gray-300", action: "Start Preparing", nextStatus: "preparing" },
  { key: "preparing", label: "Preparing",   color: "#F97316", bg: "bg-orange-50", borderColor: "border-orange-300", action: "Mark as Ready",   nextStatus: "ready"     },
  { key: "ready",     label: "Ready",       color: "#16A34A", bg: "bg-green-50",  borderColor: "border-green-300", action: "Served ✓",        nextStatus: "done"      },
];

function useTimer(startedAt) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function OrderCard({ order, columnKey, onAction, onSelect, isSelected }) {
  const col = COLUMNS.find((c) => c.key === columnKey);

  return (
    <div
      onClick={() => onSelect(order)}
      className={`bg-white rounded-2xl p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isSelected
          ? "ring-2 ring-orange-500 shadow-[0_4px_16px_rgba(249,115,22,0.15)]"
          : "shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
      }`}
      style={{ borderLeftColor: col.color }}
    >
      {/* ID + Time */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[13px] font-bold" style={{ color: col.color }}>{order.id}</span>
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <FiClock size={11} />
          {order.time}
        </div>
      </div>

      {/* Customer */}
      <p className="text-xs text-gray-500 mb-2">👤 {order.customer}</p>

      {/* Items */}
      <div className="flex flex-col gap-0.5 mb-2.5">
        {order.items.map((item, i) => (
          <span key={i} className="text-xs text-gray-700">• {item}</span>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-[#FFF8F0] rounded-lg px-2.5 py-1.5 mb-2.5">
          <p className="text-[11px] text-orange-500 m-0">⚠️ {order.notes}</p>
        </div>
      )}

      {/* Action button */}
      {col.action !== "done" && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAction(order.id, col.nextStatus); }}
          className="w-full py-2 rounded-lg border-none text-white text-xs font-semibold cursor-pointer hover:opacity-85 transition-opacity"
          style={{ background: col.color }}
        >
          {col.action}
        </button>
      )}
    </div>
  );
}

function OrderDetail({ order }) {
  const timer = useTimer(order?.startedAt ? 0 : null);
  const [checklist, setChecklist] = useState(mockKitchenIngredients);

  const toggleItem = useCallback((id) => {
    setChecklist((prev) => prev.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  }, []);

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-3 min-h-[300px]">
        <FiList size={32} className="text-gray-300" />
        <p className="text-sm text-gray-400 m-0">Select an order to see details</p>
      </div>
    );
  }

  const done = checklist.filter((i) => i.checked).length;

  return (
    <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1a1a1a] mb-1">{order.id}</h3>
          <p className="text-xs text-gray-400 m-0">👤 {order.customer}</p>
        </div>
        {order.startedAt && (
          <div className="text-center bg-orange-50 rounded-[10px] px-3.5 py-2">
            <p className="text-xl font-extrabold text-orange-500 m-0 tabular-nums">{timer}</p>
            <p className="text-[10px] text-orange-500 m-0">elapsed</p>
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Items</p>
        {order.items.map((item, i) => (
          <p key={i} className="text-[13px] text-gray-700 mb-1">• {item}</p>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-[#FFF8F0] rounded-[10px] px-3.5 py-2.5 mb-4 border border-[#FFE8CC]">
          <p className="text-xs font-semibold text-orange-500 mb-0.5">Special Notes</p>
          <p className="text-xs text-gray-500 m-0">{order.notes}</p>
        </div>
      )}

      {/* Checklist */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide m-0">Ingredients</p>
          <span className="text-[11px] text-orange-500 font-semibold">{done}/{checklist.length}</span>
        </div>
        <div className="flex flex-col gap-2">
          {checklist.map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4 cursor-pointer accent-orange-500"
              />
              <span
                className={`text-[13px] transition-all duration-200 ${
                  item.checked ? "text-gray-400 line-through" : "text-gray-700"
                }`}
              >
                {item.name}
              </span>
            </label>
          ))}
        </div>
        {/* Progress */}
        <div className="mt-3 h-[5px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full transition-[width] duration-300"
            style={{ width: `${(done / checklist.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function LiveKitchenView() {
  const [boards, setBoards] = useState({ queue: [], preparing: [], ready: [] });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKitchenOrders()
      .then(setBoards)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = useCallback(async (orderId, nextStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      setBoards((prev) => {
        const next = { queue: [...prev.queue], preparing: [...prev.preparing], ready: [...prev.ready] };
        const statusMap = { preparing: "queue", ready: "preparing", done: "ready" };
        const fromKey = statusMap[nextStatus];
        if (!fromKey) return prev;
        const toKey = nextStatus === "done" ? null : nextStatus;
        const orderIdx = next[fromKey].findIndex((o) => o.id === orderId);
        if (orderIdx === -1) return prev;
        const [order] = next[fromKey].splice(orderIdx, 1);
        if (toKey) {
          order.startedAt = nextStatus === "preparing" ? new Date().toISOString() : order.startedAt;
          next[toKey].push(order);
        }
        return next;
      });
    } catch (err) {
      console.error("[LiveKitchen] updateOrderStatus failed:", err);
    }
  }, []);

  const totalActive = boards.queue.length + boards.preparing.length + boards.ready.length;

  const statBars = [
    { label: "In Queue",     value: boards.queue.length,     colorCls: "text-gray-400",   bg: "bg-gray-50"    },
    { label: "Preparing",    value: boards.preparing.length, colorCls: "text-orange-500", bg: "bg-orange-50"  },
    { label: "Ready",        value: boards.ready.length,     colorCls: "text-green-600",  bg: "bg-green-50"   },
    { label: "Total Active", value: totalActive,             colorCls: "text-gray-700",   bg: "bg-white"      },
  ];

  return (
    <div>
      <DashboardHeader title="Live Kitchen" subtitle="Hello Basmala, Welcome back" />

      <div className="p-8">
        {/* Stats bar */}
        <div className="flex gap-3 mb-5">
          {statBars.map(({ label, value, colorCls, bg }) => (
            <div key={label} className={`${bg} rounded-xl px-4 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.05)] flex items-center gap-2.5`}>
              <span className={`text-[22px] font-extrabold ${colorCls}`}>{value}</span>
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Kanban Grid */}
        <div className="grid gap-4 items-start" style={{ gridTemplateColumns: "1fr 1fr 1fr 300px" }}>
          {COLUMNS.map((col) => (
            <div key={col.key}>
              {/* Column header */}
              <div className={`${col.bg} rounded-t-xl px-4 py-3 flex items-center justify-between mb-0.5`}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                  <span className="text-[13px] font-bold" style={{ color: col.color }}>{col.label}</span>
                </div>
                <span className="text-[11px] font-bold bg-white rounded-md px-2 py-0.5" style={{ color: col.color }}>
                  {loading ? "—" : boards[col.key].length}
                </span>
              </div>

              {/* Cards */}
              <div className={`${col.bg} rounded-b-xl p-2 flex flex-col gap-2.5 min-h-[200px]`}>
                {!loading && boards[col.key].map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    columnKey={col.key}
                    onAction={handleAction}
                    onSelect={setSelectedOrder}
                    isSelected={selectedOrder?.id === order.id}
                  />
                ))}
                {!loading && boards[col.key].length === 0 && (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-xs text-gray-300 m-0">Empty</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Detail Panel */}
          <div className="sticky top-[88px]">
            <OrderDetail order={selectedOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveKitchenView;
