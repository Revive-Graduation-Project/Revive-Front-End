/**
 * StatusBadge
 * Reusable colored badge for order / ingredient statuses.
 *
 * Usage:
 *   <StatusBadge status="Preparing" />
 *   <StatusBadge status="In Stock" />
 *   <StatusBadge status="Out of Stock" />
 */

const STATUS_MAP = {
  // Order statuses
  Preparing: "bg-[#F97316] text-white",
  Ready: "bg-[#16A34A] text-white",
  Done: "bg-gray-400  text-white",
  Cancelled: "bg-red-500   text-white",
  Pending: "bg-yellow-500 text-white",
  Queue: "bg-yellow-500 text-white",
  // Menu statuses
  Active: "bg-green-50   text-green-600",
  Inactive: "bg-gray-100   text-gray-500",
  // Stock statuses (Ingredients)
  "In Stock": "bg-green-50   text-green-600",
  "Low Stock": "bg-yellow-50  text-yellow-600",
  "Out of Stock": "bg-red-50     text-red-500",
};

export function StatusBadge({ status }) {
  const cls = STATUS_MAP[status] ?? "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-block text-[11px] font-bold rounded px-2.5 py-1 text-center min-w-[70px] ${cls}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
