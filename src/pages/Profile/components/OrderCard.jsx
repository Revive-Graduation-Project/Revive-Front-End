import React, { useState } from "react";
import { FaBell} from "react-icons/fa6";
import { FiCheckCircle, FiChevronDown, FiChevronUp, FiClock, FiXCircle } from "react-icons/fi";
import { formatOrderTime } from "../../../utils/orderHelpers";

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
      case "PREPARING":
        return (
          <span className="flex items-center gap-1.5 text-amber-600">
            <FiClock className="w-4 h-4 animate-pulse shrink-0" />
            <span className="text-sm font-medium">Preparing</span>
          </span>
        );
      case "PAID":
        return (
          <span className="flex items-center gap-1.5 text-blue-600">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Paid</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="flex items-center gap-1.5 text-green-600">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Confirmed</span>
          </span>
        );
      case "READY":
        return (
          <span className="flex items-center gap-1.5 text-green-700">
             <FaBell className="w-4 h-4" />
            <span className="text-sm font-medium">Ready</span>
          </span>
        );
      case "CANCELLATION_PENDING":
        return (
          <span className="flex items-center gap-1.5 text-orange-500">
            <FiClock className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Canceling</span>
          </span>
        );
      case "CANCELED":
        return (
          <span className="flex items-center gap-1.5 text-red-500">
            <FiXCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Canceled</span>
          </span>
        );
      default:
        return (
          <span className="text-sm text-gray-500 font-medium">{status}</span>
        );
    }
  };

  const friendlyTime = formatOrderTime(order?.createdAt);
  const totalQuantity = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const shortOrderId = `#${String(order?.id || '').slice(-6)}`;
  const hasDiscount = (order.discount || 0) > 0;

  return (
    <div
      className="rounded-2xl transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "#fafafa",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* Main Card Content */}
      <div className="flex items-center justify-between px-5 py-4">
        {/* Left content: Added flex-wrap and gap-y for better mobile handling */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          
          {/* Top row: Order ID + Price + Discount */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
            <h4 className="text-base font-semibold text-gray-800">
              Order {shortOrderId}
            </h4>
            <span
              className="text-sm font-bold whitespace-nowrap"
              style={{ color: "#2e7d32" }}
            >
              {Number(order.totalPrice ?? 0).toFixed(2)}$
            </span>
            {hasDiscount && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 whitespace-nowrap">
                -{order.discount}% off
              </span>
            )}
          </div>

          {/* Bottom row: Time + Item Count + Status */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-500">
            <span className="text-sm whitespace-nowrap">{friendlyTime}</span>

            {totalQuantity > 0 && (
              <span className="flex items-center gap-1 text-sm whitespace-nowrap">
                <svg
                  className="w-4 h-4 text-red-400 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" strokeLinecap="round" />
                </svg>
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            )}

            {getStatusIcon(order.status)}
          </div>
        </div>

        {/* Right: Chevron button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
          aria-label={isExpanded ? "Collapse order details" : "Expand order details"}
        >
          {isExpanded ? (
            <FiChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Expanded Items Section */}
      {isExpanded && (
        <div className="px-5 pb-4 pt-0 border-t border-gray-200">
          <div className="space-y-3 mt-4">
            {order.items?.map((item, index) => {
              const unitPrice = item.price ?? item.snapshotPrice ?? 0;
              const quantity = item.quantity || 0;

              return (
                <div key={item.id || item.mealId || index} className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 shrink-0">
                    <img
                      src={item.imageUrl || item.image || "/images/bowl.png"}
                      alt={item.name || "meal"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name || item.snapshotName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Number(unitPrice).toFixed(2)}$ × {quantity}
                    </p>
                  </div>

                  {/* Item Total */}
                  <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                    {Number(unitPrice * quantity).toFixed(2)}$
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;