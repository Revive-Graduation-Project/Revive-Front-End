import React from "react";

/**
 * OrderDetailsModal
 *
 * Props:
 *   order   — order object from getMergedOrders / lastOrder / myOrders
 *   onClose — callback to close the modal
 */
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const { items = [], totalPrice = 0, discount = 0 } = order;

  // Subtotal computed from items, purely for display in the breakdown —
  // the actual charged Total below always comes from order.totalPrice
  // (backend-computed), never recalculated here, to avoid drift if this
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? item.snapshotPrice ?? 0) * (item.quantity || 0),
    0
  );

  const discountAmount = discount > 0 ? subtotal * (discount / 100) : 0;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Order details"
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl bg-white px-7 py-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#e07b00]">Order Details</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors text-base cursor-pointer"
          >
            ✕
          </button>
        </div>

        <hr className="border-gray-100 mb-4" />

        {/* Items */}
        <ul className="flex flex-col gap-4 max-h-55 overflow-y-auto pr-1">
          {items.map((item) => {
            const itemName = item.name || item.snapshotName;
            const unitPrice = item.price ?? item.snapshotPrice ?? 0;

            return (
              <li key={item.id || item.mealId} className="flex items-center gap-4">
                {/* Image */}
                <div className="h-15.5 w-15.5 shrink-0 overflow-hidden rounded-full bg-orange-400 flex items-center justify-center">
                  <img
                    src={item.imageUrl || item.image || "/images/bowl.png"}
                    alt={itemName || "meal"}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Name + price */}
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {itemName}
                  </span>
                  <span className="text-sm text-gray-400">
                    {Number(unitPrice).toFixed(2)}$
                  </span>
                </div>

                {/* Qty */}
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Qty: {item.quantity || 0}
                </span>
              </li>
            );
          })}
        </ul>

        <hr className="border-gray-100 my-4" />

        {/* Price breakdown */}
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)}$</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Discount (points redeemed) · {discount}%</span>
              <span>-{discountAmount.toFixed(2)}$</span>
            </div>
          )}
        </div>

        <hr className="border-gray-100 my-4" />

        {/* Total */}
        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{Number(totalPrice).toFixed(2)}$</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;