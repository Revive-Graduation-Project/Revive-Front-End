import React from "react";
import { FaUtensils } from "react-icons/fa6";
import { FiCheckCircle, FiXCircle, FiClock, FiHash } from "react-icons/fi";
import { formatOrderTime } from "../../../utils/orderHelpers";
import { NON_CANCELLABLE_ORDER_STATUSES } from "../../../constants";


const OrderCard = ({ order, onCancelOrder }) => {
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "PROCESSING":
      case "PENDING":
      case "PREPARING":
        return (
          <span className="flex items-center gap-1.5 text-amber-600">
            <FiClock className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Processing</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="flex items-center gap-1.5 text-green-600">
            <FiCheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Confirmed</span>
          </span>
        );
      case "READY":
        return (
          <span className="flex items-center gap-1.5 text-green-700">
             <FaUtensils className="w-4 h-4" />
            <span className="text-sm font-medium">Ready</span>
          </span>
        );
      case "CANCELED":
        return (
          <span className="flex items-center gap-1.5 text-red-500">
            <FiXCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Canceled</span>
          </span>
        );
      default:
        return (
          <span className="text-sm text-gray-500 font-medium">{status}</span>
        );
    }
  };

  const friendlyTime = formatOrderTime(order?.time || order?.createdAt);

  return (
    <div
      className="flex items-center justify-between rounded-2xl px-5 py-4 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "#fafafa",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* Left content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Top row: Name + Price */}
        <div className="flex items-center gap-4">
          <h4 className="text-base font-semibold text-gray-800 truncate">
            {order.items?.[0]?.name}
          </h4>
          <span
            className="text-sm font-bold whitespace-nowrap"
            style={{ color: "#2e7d32" }}
          >
            {order.totalPrice} EGP
          </span>
        </div>

        {/* Bottom row: Time + Quantity + Status */}
        <div className="flex items-center gap-4 text-gray-500 flex-wrap">
          <span className="text-sm">{friendlyTime}</span>

          {order.quantity && (
            <>
              <span className="flex items-center gap-1 text-sm">
                <svg
                  className="w-4 h-4 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" strokeLinecap="round" />
                </svg>
                {order.quantity}
              </span>
            </>
          )}

          {getStatusIcon(order.status)}

          {/* Cancel Button */}
          {onCancelOrder && !NON_CANCELLABLE_ORDER_STATUSES.includes(order.status?.toUpperCase()) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelOrder(order.id);
              }}
              className="ml-auto text-sm text-red-500 hover:text-red-700 font-semibold underline cursor-pointer bg-transparent border-none p-0"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Right: Food image — circular */}
      <div className="w-16 h-16 rounded-full overflow-hidden ml-4 shrink-0 border-2 border-gray-100 shadow-sm bg-white">
        <img
          src={order.image || order.items?.[0]?.imageUrl || "/images/bowl.png"}
          alt={order.items?.[0]?.name || "meal"}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default OrderCard;