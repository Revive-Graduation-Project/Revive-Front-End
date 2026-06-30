import { useState, useCallback } from "react";
import DashboardHeader from "./DashboardHeader";
import {
  useRealtimeKitchen,
  useUpdateKitchenStatus,
  useActiveTickets,
  useUpdateTicketStatus,
  useUpdateChefStatus,
  useUpdateChefStation,
  useUpdateChefDisplayName,
} from "../../hooks/dashboard/useKitchenOrders";
import { KanbanCardSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import ConfirmModal from "./shared/ConfirmModal";
import OrderDetailsModal from "./shared/OrderDetailsModal";

import { COLUMNS } from "./LiveKitchen/constants";
import { LiveIndicator } from "./LiveKitchen/LiveIndicator";
import { OrderCard, DoneCard, EmptyColumn } from "./LiveKitchen/OrderCards";
import { KitchenTicketsTable } from "./LiveKitchen/KitchenTicketsTable";
import { ChefManagement } from "./LiveKitchen/ChefManagement";

function LiveKitchenView() {
  const [viewingOrder,    setViewingOrder]    = useState(null);
  const [orderToCancel,   setOrderToCancel]   = useState(null);
  const [orderToMarkDone, setOrderToMarkDone] = useState(null);
  const [orderToRevert,   setOrderToRevert]   = useState(null);

  // ── Kitchen-service state ──
  const [ticketConfirm, setTicketConfirm]   = useState(null); // { ticketId, status, label }

  const { boards, isFetching, error, refetch } = useRealtimeKitchen();
  const { mutate: updateStatus } = useUpdateKitchenStatus();

  // ── Kitchen-service hooks ──
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError, refetch: refetchTickets, isFetching: ticketsFetching } = useActiveTickets();
  const { mutate: mutateTicketStatus }   = useUpdateTicketStatus();
  const { mutate: mutateChefStatus }     = useUpdateChefStatus();
  const { mutate: mutateChefStation }    = useUpdateChefStation();
  const { mutate: mutateChefName }       = useUpdateChefDisplayName();

  // ── Action handler — routes to confirmation modals for destructive actions ──
  const handleAction = useCallback((orderId, nextStatus) => {
    if (nextStatus === "cancelled") { setOrderToCancel(orderId);   return; }
    if (nextStatus === "done")      { setOrderToMarkDone(orderId); return; }
    updateStatus({ orderId, nextStatus });
  }, [updateStatus]);

  const confirmCancel   = () => { if (orderToCancel)   { updateStatus({ orderId: orderToCancel,   nextStatus: "cancelled" }); setOrderToCancel(null);   } };
  const confirmMarkDone = () => { if (orderToMarkDone) { updateStatus({ orderId: orderToMarkDone, nextStatus: "done"      }); setOrderToMarkDone(null); } };
  const confirmRevert   = () => { if (orderToRevert)   { updateStatus({ orderId: orderToRevert,   nextStatus: "ready"     }); setOrderToRevert(null);   } };

  const handleTicketAction = useCallback((ticketId, status, label) => {
    setTicketConfirm({ ticketId, status, label });
  }, []);

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
          <LiveIndicator isFetching={isFetching} onRefresh={refetch} />

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

          {/* ══════════════════════════════════════════════════════
              SECTION: Kitchen Service — Active Tickets
          ═══════════════════════════════════════════════════════ */}
          <KitchenTicketsTable 
            tickets={tickets} 
            isLoading={ticketsLoading} 
            error={ticketsError} 
            isFetching={ticketsFetching} 
            onRetry={refetchTickets} 
            onAction={handleTicketAction} 
          />

          {/* ══════════════════════════════════════════════════════
              SECTION: Chef Management
          ═══════════════════════════════════════════════════════ */}
          <ChefManagement 
            tickets={tickets} 
            onUpdateStatus={mutateChefStatus} 
            onUpdateStation={mutateChefStation} 
            onUpdateName={mutateChefName} 
          />

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

      {/* ── Ticket status confirm modal ── */}
      <ConfirmModal
        isOpen={!!ticketConfirm}
        onClose={() => setTicketConfirm(null)}
        onConfirm={() => {
          if (ticketConfirm) {
            mutateTicketStatus({ ticketId: ticketConfirm.ticketId, status: ticketConfirm.status });
            setTicketConfirm(null);
          }
        }}
        title={ticketConfirm?.label || "Update Status?"}
        message={`Are you sure you want to move ticket #${ticketConfirm?.ticketId} to ${ticketConfirm?.status}?`}
        confirmLabel={ticketConfirm?.label || "Confirm"}
        confirmClassName={
          ticketConfirm?.status === "READY"
            ? "bg-[#F97316] hover:bg-orange-600 shadow-lg shadow-orange-500/30"
            : "bg-[#16A34A] hover:bg-green-700 shadow-lg shadow-green-500/30"
        }
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
