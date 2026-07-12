import React, { useMemo, useState } from "react";
import { FaCheck, FaUtensils, FaBoxOpen, FaClock } from "react-icons/fa6";
import { isOrderCancellable, formatOrderTime, parseTimestamp } from "../../../utils/orderHelpers";
import OrderDetailsModal from "./OrderDetailsModal";
import { toast } from "sonner";

const OrderTracking = ({ order, onCancelOrder }) => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const steps = [
    { key: "pending", label: "Pending", icon: <FaClock /> },
    { key: "confirmed", label: "Confirmed", icon: <FaCheck /> },
    { key: "preparing", label: "Preparing", icon: <FaUtensils /> },
    { key: "ready", label: "Ready", icon: <FaBoxOpen /> },
  ];

  const getActiveStepIndex = () => {
    const s = order?.status?.toLowerCase() || "";
    if (s === "ready" || s === "completed") return 3;
    if (s === "preparing") return 2;
    if (s === "confirmed" || s === "paid") return 1;
    if (s === "pending" || s === "awaiting_payment" || s === "cancellation_pending") return 0;
    return 0;
  };

  const activeStepIndex = getActiveStepIndex();

 const timelineSteps = [
  {
    name: "Pending",
    statusTitle: "Your Order is being reviewed",
    description: "Order is being processed",
    subtitle: "We've received your order and it's waiting to be confirmed by the restaurant.",
    icon: <FaClock className="text-xs text-white" />,
    status:
      activeStepIndex >= 0
        ? activeStepIndex > 0
          ? "completed"
          : "active"
        : "pending",
  },
  {
    name: "Confirmed",
    statusTitle: "Your Order has been confirmed",
    description: "Order has been confirmed",
    subtitle: "Great news! The restaurant has accepted your order and will start soon.",
    icon: <FaCheck className="text-xs text-white" />,
    status:
      activeStepIndex >= 1
        ? activeStepIndex > 1
          ? "completed"
          : "active"
        : "pending",
  },
  {
    name: "Preparing",
    statusTitle: "Your Order is being prepared",
    description: "The kitchen has started crafting your organic meal",
    subtitle: "Our kitchen team is crafting your healthy bowls with fresh ingredients.",
    icon: <FaUtensils className="text-xs text-white" />,
    status:
      activeStepIndex >= 2
        ? activeStepIndex > 2
          ? "completed"
          : "active"
        : "pending",
  },
  {
    name: "Ready",
    statusTitle: "Your Order is ready!",
    description: "Your order is ready for pickup/delivery",
    subtitle: "Your order is packed and ready — it's waiting for pickup!",
    icon: <FaBoxOpen className="text-xs text-white" />,
    status:
      activeStepIndex >= 3
        ? activeStepIndex > 3
          ? "completed"
          : "active"
        : "pending",
  },
];

  // Get the active step object based on the activeStepIndex
  const activeStep = timelineSteps[activeStepIndex];

  const friendlyTime = useMemo(() => {
    return formatOrderTime(order?.time || order?.createdAt);
  }, [order?.time, order?.createdAt]);

  const estimatedDeliveryTime = useMemo(() => {
    const date = parseTimestamp(order?.time || order?.createdAt);
    if (!date) return "--:--";
    date.setMinutes(date.getMinutes() + 25);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, [order?.time, order?.createdAt]);

  const handleCancelOrder = async () => {
    if (isCancelling) return;
    
    setIsCancelling(true);
    try {
      await onCancelOrder?.(order.id);
    } catch (error) {
      toast.error("Cancellation failed:", error.message || "Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold" style={{ color: "#2e7d32" }}>
              Last Order
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Order #{order?.id || "N/A"} . placed at {friendlyTime} .
            </p>
          </div>
          <div
            className="px-5 py-2 rounded-2xl text-white text-center shrink-0"
            style={{ backgroundColor: "#2e7d32" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider leading-tight">
              Estimated Delivery
            </p>
            <p className="text-lg font-bold leading-tight">
              {estimatedDeliveryTime}
            </p>
          </div>
        </div>
      </div>

      {/* ── Horizontal Progress Stepper ── */}
      <div className="py-4">
        <div className="flex items-center justify-between relative">
          {steps.map((step, i) => {
            const isCompleted = i < activeStepIndex;
            const isActive = i === activeStepIndex;
            const isPending = i > activeStepIndex;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center relative"
                style={{ flex: 1 }}
              >
                {i > 0 && (
                  <div
                    className="absolute top-4 right-1/2 h-0.5"
                    style={{
                      width: "100%",
                      backgroundColor:
                        isCompleted || isActive ? "#2e7d32" : "#e0e0e0",
                    }}
                  />
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm relative z-10"
                  style={{
                    backgroundColor:
                      isCompleted || isActive ? "#2e7d32" : "#f5f5f5",
                    color: isCompleted || isActive ? "white" : "#bdbdbd",
                    border: isPending ? "2px solid #e0e0e0" : "none",
                  }}
                >
                  <span>{step.icon}</span>
                </div>
                <p
                  className="text-[11px] mt-2 text-center font-medium"
                  style={{
                    color: isCompleted || isActive ? "#2e7d32" : "#9e9e9e",
                  }}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Status Card ── */}
      {order?.status?.toUpperCase() === "CANCELLATION_PENDING" ? (
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl px-5 py-4"
          style={{ backgroundColor: "#fff3e0", border: "1px solid #ffe0b2" }}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#f57c00" }}
            >
              <span className="text-white text-base">
                <FaClock />
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-orange-800">
                Cancellation Pending
              </p>
              <p className="text-sm text-orange-700 mt-0.5">
                Waiting for kitchen approval to cancel your order...
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOrderDetails(true)}
            className="w-full sm:w-auto text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            style={{ color: "#333" }}
          >
            View Order
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl px-5 py-4"
          style={{ backgroundColor: "#e8f5e9", border: "1px solid #c8e6c9" }}
        >
          {/* Left: icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#2e7d32" }}
            >
              {/* reuse the same icon already defined in timelineSteps */}
              <span className="text-white text-lg">
                {React.cloneElement(activeStep.icon, {
                  className: "text-white text-base",
                })}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-green-700">
                {activeStep.statusTitle}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {activeStep.subtitle}
              </p>
            </div>
          </div>

          {/* Right: button — full width on mobile, auto on desktop */}
          <button
            onClick={() => setShowOrderDetails(true)}
            className="w-full sm:w-auto text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            style={{ color: "#333" }}
          >
            View Order
          </button>
        </div>
      )}

      {/* ── Bottom Two-Column: Timeline + Policy ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Left: Journey Timeline */}
        <div>
          <h4 className="text-lg font-bold mb-5" style={{ color: "#2e7d32" }}>
            Journey Timeline
          </h4>
          <div className="relative pl-6">
            {timelineSteps.map((step, i) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";

              return (
                <div key={i} className="relative pb-7 last:pb-0">
                  {i < timelineSteps.length - 1 && (
                    <div
                      className="absolute -left-3 top-8 w-0.5"
                      style={{
                        height: "calc(100% - 12px)",
                        backgroundColor: isCompleted ? "#2e7d32" : "#e0e0e0",
                        ...(isActive
                          ? {
                              backgroundImage:
                                "repeating-linear-gradient(to bottom, #ff9800 0, #ff9800 4px, transparent 4px, transparent 8px)",
                              backgroundColor: "transparent",
                            }
                          : {}),
                      }}
                    />
                  )}
                  <div className="absolute -left-4.5 top-1 w-3 h-3 rounded-full">
                    {isCompleted ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center -ml-1.5 -mt-1.5"
                        style={{ backgroundColor: "#2e7d32" }}
                      >
                        {step.icon}
                      </div>
                    ) : isActive ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center -ml-1.5 -mt-1.5"
                        style={{ backgroundColor: "#ff9800" }}
                      >
                        {step.icon}
                      </div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center -ml-1.5 -mt-1.5"
                        style={{ backgroundColor: "#e0e0e0" }}
                      >
                        {step.icon &&
                          React.cloneElement(step.icon, {
                            className: "text-xs text-gray-500",
                          })}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: isActive
                          ? "#ff9800"
                          : isCompleted
                            ? "#333"
                            : "#9e9e9e",
                      }}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cancellation Policy + Need Help */}
        <div className="space-y-5">
          <div>
            <h4 className="flex items-center gap-2 text-base font-bold text-red-600 mb-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
              </svg>
              Cancellation Policy
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Orders can only be cancelled before the kitchen begins
              preparation.
            </p>

            {isOrderCancellable(order) ? (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            ) : (
              <div
                className="rounded-lg p-3 text-xs"
                style={{
                  backgroundColor: "#fff3e0",
                  border: "1px solid #ffe0b2",
                }}
              >
                <p className="flex items-center gap-1.5 font-semibold text-amber-700 mb-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  This order can no longer be cancelled because preparation has
                  already started.
                </p>
                <p className="text-amber-700 mt-1 leading-relaxed">
                  We regret to inform you that the Order has already moved to
                  immediate preparation stage to ensure speedy delivery, we
                  promise you a unique dining experience!
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 pt-2">
            <span className="text-2xl">🔑</span>
            <div>
              <p className="text-sm font-bold text-gray-800">Need Help?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Our support team is available 24/7 for any order issues.
              </p>
              <a
                href="#"
                className="text-sm font-semibold mt-1 inline-block"
                style={{ color: "#2e7d32" }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Details Modal ── */}
      {showOrderDetails && (
        <OrderDetailsModal
          order={order}
          onClose={() => setShowOrderDetails(false)}
        />
      )}
    </div>
  );
};

export default OrderTracking;
