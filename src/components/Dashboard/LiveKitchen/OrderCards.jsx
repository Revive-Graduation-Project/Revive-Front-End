import { FiInbox } from "react-icons/fi";
import { COLUMNS, getActionButtonStyle } from "./constants";

export function OrderInfoGrid({ order }) {
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

export function ViewDetailsHint() {
  return (
    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -mt-1 translate-y-1 group-hover:translate-y-0">
      <span className="text-[10px] font-semibold text-orange-400 tracking-wide">Click to view details</span>
      <span className="text-orange-400 text-[10px]">→</span>
    </div>
  );
}

export function OrderCard({ order, columnKey, onAction, onViewOrder }) {
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

export function DoneCard({ order, onViewOrder }) {
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

export function EmptyColumn({ label }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center shadow-inner">
        <FiInbox size={26} className="text-gray-300" />
      </div>
      <span className="text-[14px] font-medium text-gray-400 tracking-wide">{label}</span>
    </div>
  );
}
