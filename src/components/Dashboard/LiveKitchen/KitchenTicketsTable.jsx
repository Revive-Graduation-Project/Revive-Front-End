import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { TICKET_TABS, TICKET_HEADERS, STATUS_FLOW, formatTicketTime, getTicketActionStyle } from "./constants";
import EmptyState from "../shared/EmptyState";
import StatusBadge from "../shared/StatusBadge";
import { DashboardPageSkeleton } from "../shared/DashboardSkeleton";
import ErrorState from "../shared/ErrorState";
import { useAuthStore } from "../../../store";
import { isAdminUser } from "../../../utils/roleUtils";

export function KitchenTicketsTable({ tickets, isLoading, error, isFetching, onRetry, onAction }) {
  const [activeTab, setActiveTab] = useState("All");
  const { user } = useAuthStore();
  const isAdmin = isAdminUser(user);

  if (error) return <ErrorState message="Failed to load kitchen tickets." onRetry={onRetry} />;
  if (isLoading) return <DashboardPageSkeleton />;

  const allTickets = Array.isArray(tickets) ? tickets : [];
  const tabFiltered = activeTab === "All"
    ? [...allTickets]
    : allTickets.filter((t) => {
      if (activeTab === "Cancelled") return t.status === "Cancelled" || t.status === "CANCELED" || t.status === "CANCELLED";
      return t.status === activeTab;
    });
  const totalCount = allTickets.length;
  const countsByStatus = allTickets.reduce((acc, t) => {
    const key = (t.status === "CANCELED" || t.status === "CANCELLED") ? "Cancelled" : t.status;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4 mt-10">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[20px] font-bold text-[#1a1a1a] m-0">Kitchen Tickets</h3>
        <button type="button" onClick={onRetry}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-orange-500 hover:text-orange-600 cursor-pointer transition-colors bg-transparent border-none">
          <FiRefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TICKET_TABS.map((tab) => {
          const count = tab === "All" ? totalCount : countsByStatus[tab] || 0;
          const isActive = activeTab === tab;
          return (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all shrink-0 cursor-pointer border-none flex items-center gap-2 ${isActive ? "bg-orange-500 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
              <span>{tab}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {TICKET_HEADERS.map((h) => (
                  <th key={h} className="text-left py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tabFiltered.length === 0 ? (
                <tr>
                  <td colSpan={TICKET_HEADERS.length} className="py-8">
                    <EmptyState message={`No ${activeTab !== "All" ? activeTab.toLowerCase() : ""} tickets found.`} />
                  </td>
                </tr>
              ) : tabFiltered.map((ticket) => {
                const flow = STATUS_FLOW[ticket.status] || STATUS_FLOW[ticket.status?.toUpperCase()];
                // Always use the orderId for status changes so the Kanban board + ticket stay in sync
                const actionId = ticket.orderId || ticket.id;
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-[13px] font-bold text-[#1a1a1a]">#{ticket.id}</td>
                    <td className="py-3.5 px-4 text-[13px] font-semibold text-gray-600">#{ticket.orderId}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={ticket.status} /></td>
                    <td className="py-3.5 px-4 text-[13px] text-gray-600">{formatTicketTime(ticket.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {(ticket.status === "Queue" || ticket.status === "QUEUED") && isAdmin && (
                          <button
                            type="button"
                            onClick={() => onAction(actionId, "cancelled", "Cancel Ticket")}
                            className="px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all shadow-sm cursor-pointer border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                          >
                            Cancel
                          </button>
                        )}
                        {flow ? (
                          <button type="button" onClick={() => onAction(actionId, flow.next.toLowerCase(), flow.label)}
                            className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all shadow-sm cursor-pointer border-none ${getTicketActionStyle(ticket.status)}`}>
                            {flow.label}
                          </button>
                        ) : (ticket.status === "Done" || ticket.status === "DONE") ? (
                          isAdmin ? (
                            <button
                              type="button"
                              onClick={() => onAction(actionId, "ready", "Move back to Ready")}
                              className="px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all shadow-sm cursor-pointer border border-gray-200 bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 flex items-center gap-1"
                            >
                              <span className="font-extrabold">&lt;</span> Ready
                            </button>
                          ) : (
                            <span className="text-[12px] font-semibold text-gray-400 italic">Completed</span>
                          )
                        ) : (ticket.status === "Cancelled" || ticket.status === "CANCELED" || ticket.status === "CANCELLED") ? (
                          isAdmin ? (
                            <button
                              type="button"
                              onClick={() => onAction(actionId, "queue", "Restore to Queue")}
                              className="px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all shadow-sm cursor-pointer border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center gap-1"
                            >
                              <span className="font-extrabold">&lt;</span> Queue
                            </button>
                          ) : (
                            <span className="text-[12px] font-semibold text-rose-500 italic">Cancelled</span>
                          )
                        ) : (
                          <span className="text-[12px] font-semibold text-gray-400 italic">{ticket.status}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
