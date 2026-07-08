import React from "react";
import { DELIVERY_FEE } from "../../../constants";
/**
 * OrderDetailsModal
 *
 * Props:
 *   order   — order object from getMergedOrders / lastOrder / myOrders
 *   onClose — callback to close the modal
 */
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const { items = [], totalPrice = 0} = order;

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
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              {/* Image */}
              <div className="h-15.5 w-15.5 shrink-0 overflow-hidden rounded-full bg-orange-400 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">🍽️</span>
                )}
              </div>

              {/* Name + price */}
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-900">
                  {item.name}
                </span>
                <span className="text-sm text-gray-400">
                  {Number(item.price).toFixed(2)} EGP
                </span>
              </div>

              {/* Qty */}
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                Qty: {item.quantity}
              </span>
            </li>
          ))}
        </ul>

        <hr className="border-gray-100 my-4" />

        {/* Subtotal + Delivery */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{Number(totalPrice).toFixed(2)} EGP</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Delivery</span>
            <span>{Number(DELIVERY_FEE).toFixed(2)} EGP</span>
          </div>
        </div>

        <hr className="border-gray-100 my-4" />

        {/* Total */}
        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{Number(totalPrice + DELIVERY_FEE).toFixed(2)} EGP</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;