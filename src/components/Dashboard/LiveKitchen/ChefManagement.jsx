import { useState } from "react";
import { FiUsers, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { STATIONS, buildChefsFromTickets } from "./constants";
import EmptyState from "../shared/EmptyState";
import StatusBadge from "../shared/StatusBadge";

function EditableChefName({ chefId, currentName, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState(currentName);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== currentName) onSave({ chefId, displayName: trimmed });
    setEditing(false);
  };
  const handleCancel = () => { setValue(currentName); setEditing(false); };

  if (!editing) {
    return (
      <div className="flex items-center gap-2 group/name">
        <span className="text-[14px] font-bold text-[#1a1a1a] truncate">{currentName || "Unnamed"}</span>
        <button type="button" onClick={() => setEditing(true)}
          className="opacity-0 group-hover/name:opacity-100 bg-transparent border-none cursor-pointer p-1 rounded hover:bg-orange-50 transition-all">
          <FiEdit2 size={13} className="text-orange-500" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
        autoFocus className="text-[13px] font-medium text-[#1a1a1a] border border-orange-300 rounded-lg px-2 py-1 outline-none focus:border-orange-500 w-[140px]" />
      <button type="button" onClick={handleSave} className="bg-transparent border-none cursor-pointer p-1 rounded hover:bg-green-50 transition-colors">
        <FiCheck size={14} className="text-green-600" />
      </button>
      <button type="button" onClick={handleCancel} className="bg-transparent border-none cursor-pointer p-1 rounded hover:bg-red-50 transition-colors">
        <FiX size={14} className="text-red-500" />
      </button>
    </div>
  );
}

export function ChefManagement({ tickets, onUpdateStatus, onUpdateStation, onUpdateName }) {
  const chefs = buildChefsFromTickets(tickets);

  return (
    <div className="flex flex-col gap-4 mt-8">
      <h3 className="text-[20px] font-bold text-[#1a1a1a] m-0 px-2 flex items-center gap-2">
        <FiUsers size={20} className="text-orange-500" />
        Chef Management
      </h3>

      {chefs.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm">
          <EmptyState icon={FiUsers} title="No chefs found"
            description="Chef data will appear here once tickets with assigned chefs are loaded." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chefs.map((chef) => (
            <div key={chef.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <EditableChefName chefId={chef.id} currentName={chef.displayName} onSave={onUpdateName} />
                  <span className="text-[11px] text-gray-400 font-medium">ID: {chef.id}</span>
                </div>
                <StatusBadge status={chef.status} />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Station</label>
                <select value={chef.station} onChange={(e) => onUpdateStation({ chefId: chef.id, station: e.target.value })}
                  className="text-[13px] font-medium text-[#1a1a1a] border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-400 bg-white cursor-pointer transition-colors hover:border-gray-300">
                  {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-400 font-medium">
                  {chef.ticketCount} active ticket{chef.ticketCount !== 1 ? "s" : ""}
                </span>
                <button type="button"
                  onClick={() => onUpdateStatus({ chefId: chef.id, status: chef.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border-none shadow-sm ${
                    chef.status === "ACTIVE" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}>
                  {chef.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
