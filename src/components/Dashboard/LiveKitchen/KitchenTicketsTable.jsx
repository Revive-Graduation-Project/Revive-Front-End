import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { TICKET_TABS, TICKET_HEADERS, STATUS_FLOW, formatTicketTime, getTicketActionStyle } from "./constants";
import EmptyState from "../shared/EmptyState";
import StatusBadge from "../shared/StatusBadge";
import { DashboardPageSkeleton } from "../shared/DashboardSkeleton";
import ErrorState from "../shared/ErrorState";

export function KitchenTicketsTable({ tickets, isLoading, error, isFetching, onRetry, onAction }) {
  const [activeTab, setActiveTab] = useState("All");

  if (error) return <ErrorState message="Failed to load kitchen tickets." onRetry={onRetry} />;
  if (isLoading) return <DashboardPageSkeleton />;

  const allTickets = Array.isArray(tickets) ? tickets : [];
  const tabFiltered = activeTab === "All" ? [...allTickets] : allTickets.filter((t) => t.status === activeTab);
  const totalCount = allTickets.length;
  const countsByStatus = allTickets.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});

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

      <div className="bg-white rounded-3xl shadow-sm py-4 px-2">
        {/* Tab bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 pb-4 border-b border-gray-100 gap-4 sm:gap-0">
          <div className="flex items-center gap-6 overflow-x-auto w-full">
            {TICKET_TABS.map((tab) => {
              const count = tab === "All" ? totalCount : (countsByStatus[tab] || 0);
              const isActive = activeTab === tab;
              const label = tab === "All" ? "All Tickets" : tab;
              return (
                <button type="button" key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full cursor-pointer text-[13px] font-semibold transition-all duration-200 whitespace-nowrap border ${
                    isActive ? "border-orange-500 text-[#1a1a1a] bg-white" : "border-transparent text-gray-500 hover:text-gray-700 bg-transparent"
                  }`}>
                  {label} <span className={isActive ? "text-orange-500" : "text-orange-400"}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                {TICKET_HEADERS.map((h) => (
                  <th key={h} className="px-5 pt-4 pb-3 text-left text-[12px] font-bold text-gray-500 tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabFiltered.length === 0 && (
                <tr><td colSpan={6}>
                  <EmptyState title="No tickets found" description={`No tickets match "${activeTab}".`} />
                </td></tr>
              )}
              {tabFiltered.map((ticket) => {
                const flow = STATUS_FLOW[ticket.status];
                return (
                  <tr key={ticket.id} className="group transition-colors border-b border-gray-100 last:border-none hover:bg-orange-50/30">
                    <td className="px-5 py-4 text-[13px] font-mono font-medium text-gray-500">#{ticket.id}</td>
                    <td className="px-5 py-4 text-[13px] font-mono font-medium text-[#1a1a1a]">#{ticket.orderId}</td>
                    <td className="px-5 py-4"><StatusBadge status={ticket.status} /></td>
                    <td className="px-5 py-4 text-[13px] font-medium text-[#1a1a1a]">
                      {ticket.chefDisplayName || (ticket.assignedChefId != null ? `Chef #${ticket.assignedChefId}` : "Unassigned")}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 font-medium">{formatTicketTime(ticket.createdAt)}</td>
                    <td className="px-5 py-4">
                      {flow ? (
                        <button type="button" onClick={() => onAction(ticket.id, flow.next, flow.label)}
                          className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all shadow-sm cursor-pointer border-none ${getTicketActionStyle(ticket.status)}`}>
                          {flow.label}
                        </button>
                      ) : (
                        <span className="text-[12px] font-semibold text-gray-400 italic">Completed</span>
                      )}
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
