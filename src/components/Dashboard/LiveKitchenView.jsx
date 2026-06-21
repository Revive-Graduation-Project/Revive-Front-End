import { useState, useCallback } from "react";
import { FiInbox, FiRefreshCw } from "react-icons/fi";
import DashboardHeader from "./DashboardHeader";
import { useRealtimeKitchen, useUpdateKitchenStatus } from "../../hooks/dashboard/useKitchenOrders";
import { DashboardPageSkeleton, KanbanCardSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import ConfirmModal from "./shared/ConfirmModal";
import OrderDetailsModal from "./shared/OrderDetailsModal";

// ── Column config — defined outside the component so it is never recreated ──
const COLUMNS = [
  { key: "queue",     label: "Order Queue", action: "Start Preparing", nextStatus: "preparing", prevStatus: null       },
  { key: "preparing", label: "Preparing",   action: "Prepared",        nextStatus: "ready",     prevStatus: "queue"    },
  { key: "ready",     label: "Ready",       action: "Ready",           nextStatus: "done",      prevStatus: "preparing" },
];

// ── Button styles — pure function, no state or closure deps ──────────────────
function getActionButtonStyle(action) {
  if (action === "Start Preparing") return "bg-white text-[#1a1a1a] border border-[#d1d5db] hover:bg-gray-50";
  if (action === "Prepared")        return "bg-[#F97316] text-white border border-transparent hover:bg-orange-600 shadow-sm";
  if (action === "Ready")           return "bg-[#16A34A] text-white border border-transparent hover:bg-green-700 shadow-sm";
  return "";
}

// ── Reusable info grid — shared by active cards and done cards ────────────────
function OrderInfoGrid({ order }) {
  const displayName = order.name ||
    (Array.isArray(order.items) ? order.items.join(", ") : order.items);

  return (
    <div className="grid grid-cols-[44px_1fr] gap-x-2 gap-y-1 text-[11px] sm:text-[12px]">
      <span className="text-gray-500 font-medium pt-0.5">Order</span>
      <span className="text-[#1a1a1a] font-semibold text-right pt-0.5">{order.id}</span>

      <span className="text-gray-500 font-medium">Time</span>
      <span className="text-[#1a1a1a] font-semibold text-right">{order.time}</span>

      <span className="text-gray-500 font-medium">Name</span>
      <span className="text-[#1a1a1a] font-semibold truncate text-right" title={displayName}>
        {displayName}
      </span>

      <span className="text-gray-500 font-medium pt-1">Notes</span>
      <div className="flex justify-end pt-1">
        {order.notes ? (
          <span className="bg-[#FFF4D2] text-[#B48400] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            {order.notes}
          </span>
        ) : (
          <span className="text-gray-400 text-[10px] font-medium italic">None</span>
        )}
      </div>
    </div>
  );
}

// ── Hover hint — shared decoration ──────────────────────────────────────────
function ViewDetailsHint() {
  return (
    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -mt-1 translate-y-1 group-hover:translate-y-0">
      <span className="text-[10px] font-semibold text-orange-400 tracking-wide">Click to view details</span>
      <span className="text-orange-400 text-[10px]">→</span>
    </div>
  );
}

/**
 * OrderCard — active kanban card (queue / preparing / ready)
 */
function OrderCard({ order, columnKey, onAction, onViewOrder }) {
  const col = COLUMNS.find((c) => c.key === columnKey);

  return (
    <div
      className="group bg-white rounded-2xl p-4 shadow-md flex flex-col gap-3 cursor-pointer hover:shadow-lg transition-all duration-200 border border-transparent hover:border-orange-200"
      onClick={onViewOrder}
    >
      <OrderInfoGrid order={order} />
      <ViewDetailsHint />

      {/* Action buttons */}
      <div className="flex justify-center mt-1 gap-2">
        {col.prevStatus && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction(order.id, col.prevStatus); }}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all shadow-sm ${getActionButtonStyle("Start Preparing")}`}
          >
            Undo
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onAction(order.id, col.nextStatus); }}
          className={`flex-2 py-2 rounded-xl text-[12px] font-bold transition-all shadow-sm ${getActionButtonStyle(col.action)}`}
        >
          {col.action}
        </button>
      </div>
    </div>
  );
}

/**
 * DoneCard — completed order card (done section, read-only)
 * Reuses OrderInfoGrid and ViewDetailsHint instead of duplicating JSX.
 */
function DoneCard({ order, onViewOrder }) {
  return (
    <div
      className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col gap-3 min-w-[280px] shrink-0 cursor-pointer hover:border-orange-200"
      onClick={onViewOrder}
    >
      <OrderInfoGrid order={order} />
      <ViewDetailsHint />
      <div className="flex justify-center mt-1">
        <button
          disabled
          className="w-full py-2 rounded-xl text-[12px] font-bold transition-all shadow-sm bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ── Empty column placeholder ──────────────────────────────────────────────────
function EmptyColumn({ label }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shadow-inner">
        <FiInbox size={26} className="text-gray-300" />
      </div>
      <span className="text-[14px] font-medium text-gray-400 tracking-wide">{label}</span>
    </div>
  );
}

function LiveKitchenView() {
  const [viewingOrder,    setViewingOrder]    = useState(null);
  const [orderToCancel,   setOrderToCancel]   = useState(null);
  const [orderToMarkDone, setOrderToMarkDone] = useState(null);
  const [orderToRevert,   setOrderToRevert]   = useState(null);

  const { boards, isFetching, error, refetch } = useRealtimeKitchen();
  const { mutate: updateStatus } = useUpdateKitchenStatus();

  // ── Action handler — routes to confirmation modals for destructive actions ──
  const handleAction = useCallback((orderId, nextStatus) => {
    if (nextStatus === "cancelled") { setOrderToCancel(orderId);   return; }
    if (nextStatus === "done")      { setOrderToMarkDone(orderId); return; }
    updateStatus({ orderId, nextStatus });
  }, [updateStatus]);

  const confirmCancel   = () => { if (orderToCancel)   { updateStatus({ orderId: orderToCancel,   nextStatus: "cancelled" }); setOrderToCancel(null);   } };
  const confirmMarkDone = () => { if (orderToMarkDone) { updateStatus({ orderId: orderToMarkDone, nextStatus: "done"      }); setOrderToMarkDone(null); } };
  const confirmRevert   = () => { if (orderToRevert)   { updateStatus({ orderId: orderToRevert,   nextStatus: "ready"     }); setOrderToRevert(null);   } };

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-full">
        <DashboardHeader title="Live Kitchen" />
        <ErrorState message="Failed to connect to kitchen stream." onRetry={refetch} />
      </div>
    );
  }

  const doneCount = boards.done?.length ?? 0;

  return (
    <div className="min-h-full bg-[#FEF9E6] rounded-3xl p-6 lg:p-12 pb-12 shadow-sm">
      <div className="w-full max-w-[1400px] mx-auto">
        <DashboardHeader title="Live Kitchen" />

        <div className="flex flex-col gap-6 overflow-hidden mt-6">

          {/* Live indicator + refresh */}
          <div className="bg-[#F5F6F8] rounded-xl px-6 py-3 shadow-sm relative flex items-center justify-center min-h-[48px]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-700 animate-pulse shadow-sm shadow-red-700/60" />
              <span className="text-[16px] font-medium text-[#1a1a1a] uppercase tracking-wider">Live Kitchen</span>
            </div>
            <div className="absolute right-6">
              <button
                type="button"
                onClick={refetch}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
              >
                <FiRefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {/* 3-column kanban */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {COLUMNS.map((col) => {
              const cards = boards[col.key] || [];
              return (
                <div key={col.key} className="flex flex-col gap-4">
                  <h3 className="text-[20px] font-medium text-center m-0 text-[#22C55E]">
                    {col.label} <span className="ml-1">{cards.length}</span>
                  </h3>
                  <div className="bg-white rounded-4xl p-5 flex flex-col gap-4 min-h-[400px] max-h-[600px] overflow-y-auto shadow-sm">
                    {isFetching && cards.length === 0 ? (
                      <>
                        <KanbanCardSkeleton />
                        <KanbanCardSkeleton />
                      </>
                    ) : (
                      cards.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          columnKey={col.key}
                          onAction={handleAction}
                          onViewOrder={() =>
                            setViewingOrder({
                              ...order,
                              status: col.key === "queue" ? "Pending" : col.label,
                            })
                          }
                        />
                      ))
                    )}
                    {!isFetching && cards.length === 0 && (
                      <EmptyColumn label="No orders here" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Done section */}
          <div className="flex flex-col gap-4 mt-8">
            <h3 className="text-[20px] font-medium text-[#22C55E] m-0 px-2">
              Done <span className="ml-1">{doneCount}</span>
            </h3>
            <div className="bg-white rounded-4xl p-5 shadow-sm overflow-x-auto pb-6 min-h-[200px]">
              {boards.done?.length > 0 ? (
                <div className="flex gap-5">
                  {boards.done.map((order) => (
                    <DoneCard
                      key={order.id}
                      order={order}
                      onViewOrder={() => setViewingOrder({ ...order, status: "Done" })}
                    />
                  ))}
                </div>
              ) : (
                <EmptyColumn label="No completed orders yet" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm modals ── */}
      <ConfirmModal
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirm={confirmCancel}
        title="Cancel Order?"
        message="This order will be permanently removed from the kitchen board and marked as cancelled. This action cannot be undone."
      />
      <ConfirmModal
        isOpen={!!orderToMarkDone}
        onClose={() => setOrderToMarkDone(null)}
        onConfirm={confirmMarkDone}
        title="Mark as Ready?"
        message="Are you sure this order is ready and should be moved to the Done list?"
        confirmLabel="Ready"
        confirmClassName="bg-[#16A34A] hover:bg-green-700 shadow-lg shadow-green-500/30"
      />
      <ConfirmModal
        isOpen={!!orderToRevert}
        onClose={() => setOrderToRevert(null)}
        onConfirm={confirmRevert}
        title="Not Done?"
        message="Are you sure this order is not Done and should be moved back to the Ready list?"
        confirmLabel="Not Done"
        confirmClassName="bg-[#16A34A] hover:bg-green-700 shadow-lg shadow-green-500/30"
      />

      <OrderDetailsModal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
        showCustomerInfo={false}
      />
    </div>
  );
}

export default LiveKitchenView;
