import { useState, useCallback } from "react";
import { FiInbox, FiRefreshCw } from "react-icons/fi";
import DashboardHeader from "./DashboardHeader";
import { useRealtimeKitchen, useUpdateKitchenStatus } from "../../hooks/dashboard/useKitchenOrders";
import { DashboardPageSkeleton, KanbanCardSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import ConfirmModal from "./shared/ConfirmModal";

const COLUMNS = [
  { key: "queue", label: "Order Queue", action: "Start Preparing", nextStatus: "preparing", prevStatus: null },
  { key: "preparing", label: "Preparing", action: "Prepared", nextStatus: "ready", prevStatus: "queue" },
  { key: "ready", label: "Ready", action: "Ready", nextStatus: "done", prevStatus: "preparing" },
];

/**
 * A single kitchen order card matching the Figma design:
 * white card, label/value grid (Order / Time / Name / Notes), status button at bottom
 */
function OrderCard({ order, columnKey, onAction }) {
  const col = COLUMNS.find((c) => c.key === columnKey);

  const getButtonStyle = (action) => {
    if (action === "Start Preparing") return "bg-white text-[#1a1a1a] border-[1px] border-[#d1d5db] hover:bg-gray-50";
    if (action === "Prepared") return "bg-[#F97316] text-white border-[1px] border-transparent hover:bg-orange-600 shadow-sm";
    if (action === "Ready") return "bg-[#16A34A] text-white border-[1px] border-transparent hover:bg-green-700 shadow-sm";
    return "";
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col gap-3">
      {/* Info grid */}
      <div className="grid grid-cols-[44px_1fr] gap-x-2 gap-y-1 text-[11px] sm:text-[12px]">
        <span className="text-gray-500 font-medium pt-0.5">Order</span>
        <span className="text-[#1a1a1a] font-semibold text-right pt-0.5">{order.id}</span>

        <span className="text-gray-500 font-medium">Time</span>
        <span className="text-[#1a1a1a] font-semibold text-right">{order.time}</span>

        <span className="text-gray-500 font-medium">Name</span>
        <span className="text-[#1a1a1a] font-semibold truncate text-right">{order.name || order.items?.[0]}</span>

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

      {/* Action buttons */}
      <div className="flex justify-center mt-1 gap-2">
        {col.prevStatus && (
          <button
            type="button"
            onClick={() => onAction(order.id, col.prevStatus)}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-colors bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
            title="Move Back"
          >
            Back
          </button>
        )}
        {columnKey === "queue" && (
          <button
            type="button"
            onClick={() => onAction(order.id, "cancelled")}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-colors bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Cancel Order"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={() => onAction(order.id, col.nextStatus)}
          className={`flex-1 px-5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-colors ${getButtonStyle(col.action)}`}
        >
          {col.action}
        </button>
      </div>
    </div>
  );
}

function LiveKitchenView() {
  const { boards, isConnected, isFetching, error, refetch } = useRealtimeKitchen();
  const { mutate: updateStatus } = useUpdateKitchenStatus();
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToMarkDone, setOrderToMarkDone] = useState(null);

  const handleAction = useCallback((orderId, nextStatus) => {
    if (nextStatus === "cancelled") {
      setOrderToCancel(orderId);
      return;
    }
    if (nextStatus === "done") {
      setOrderToMarkDone(orderId);
      return;
    }
    updateStatus({ orderId, nextStatus });
  }, [updateStatus]);

  const confirmCancel = () => {
    if (orderToCancel) {
      updateStatus({ orderId: orderToCancel, nextStatus: "cancelled" });
      setOrderToCancel(null);
    }
  };

  const confirmMarkDone = () => {
    if (orderToMarkDone) {
      updateStatus({ orderId: orderToMarkDone, nextStatus: "done" });
      setOrderToMarkDone(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-full">
        <DashboardHeader title="Live Kitchen" />
        <ErrorState message="Failed to connect to kitchen stream." onRetry={refetch} />
      </div>
    );
  }

  const doneCount = boards.done?.length || 0;

  return (
    <div className="min-h-full bg-[#FEF9E6] rounded-3xl p-6 lg:p-12 pb-12 shadow-sm">
      <div className="w-full max-w-[1400px] mx-auto">
        <DashboardHeader title="Live Kitchen" />

        <div className="flex flex-col gap-6 overflow-hidden mt-6">
          {/* Live indicator + Refresh */}
          <div className="bg-[#F5F6F8] rounded-xl px-6 py-3 shadow-sm relative flex items-center justify-center min-h-[48px]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-700 animate-pulse shadow-sm shadow-red-700/60" />
              <span className="text-[16px] font-medium text-[#1a1a1a] uppercase tracking-wider">Live Kitchen</span>
            </div>
            
            <div className="absolute right-6">
              <button
                type="button"
                onClick={() => { console.log('[KITCHEN] manual refresh triggered'); refetch(); }}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
              >
                <FiRefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* 3-Column Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {COLUMNS.map((col) => {
              const cards = boards[col.key] || [];
              return (
                <div key={col.key} className="flex flex-col gap-4">
                  {/* Column header */}
                  <h3 className="text-[20px] font-medium text-center m-0 text-[#22C55E]">
                    {col.label} <span className="text-[#22C55E] ml-1">{cards.length}</span>
                  </h3>

                  {/* Cards Container */}
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
                        />
                      ))
                    )}
                    {!isFetching && cards.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                        <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shadow-inner">
                          <FiInbox size={26} className="text-gray-300" />
                        </div>
                        <span className="text-[14px] font-medium text-gray-400 tracking-wide">No orders here</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Done section */}
          <div className="flex flex-col gap-4 mt-8">
            <h3 className="text-[20px] font-medium text-[#22C55E] m-0 px-2">Done <span className="text-[#22C55E] ml-1">{doneCount}</span></h3>

            <div className="bg-white rounded-4xl p-5 shadow-sm overflow-x-auto pb-6 min-h-[200px]">
              {boards.done && boards.done.length > 0 ? (
                <div className="flex gap-5">
                  {(boards.done || []).map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition-shadow flex flex-col gap-3 min-w-[280px] shrink-0">
                    <div className="grid grid-cols-[44px_1fr] gap-x-2 gap-y-1 text-[11px] sm:text-[12px]">
                      <span className="text-gray-500 font-medium pt-0.5">Order</span>
                      <span className="text-[#1a1a1a] font-semibold text-right pt-0.5">{order.id}</span>
                      <span className="text-gray-500 font-medium">Time</span>
                      <span className="text-[#1a1a1a] font-semibold text-right">{order.time}</span>
                      <span className="text-gray-500 font-medium">Name</span>
                      <span className="text-[#1a1a1a] font-semibold truncate text-right">{order.name || order.items?.[0]}</span>
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
                    <div className="flex justify-center mt-2">
                      <div className="w-9 h-9 rounded-full bg-[#16A34A] flex items-center justify-center shadow-md shadow-green-500/30">
                        <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shadow-inner">
                    <FiInbox size={26} className="text-gray-300" />
                  </div>
                  <span className="text-[14px] font-medium text-gray-400 tracking-wide">No completed orders yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
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
        title="Mark as Done?"
        message="This order will be moved to the Done list and marked as completed."
        confirmLabel="Mark Done"
        confirmClassName="bg-[#16A34A] hover:bg-green-700 shadow-lg shadow-green-500/30"
      />
    </div>
  );
}

export default LiveKitchenView;
