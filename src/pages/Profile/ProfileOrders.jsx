import React, { useEffect, useMemo, useState } from "react";
import OrderCard from "./components/OrderCard";
import OrderTracking from "./components/OrderTracking";
import { useOrderStore } from "../../store";
import {toast} from "sonner";
import { LoadingSpinner } from "../../components";
import { useShallow } from "zustand/shallow";


export default function Orders() {
  const [activeTab, setActiveTab] = useState("history");

  const {
  myOrders,
  lastOrder,
  myOrdersLoading,
  myOrdersError,
  fetchMyOrders,
  cancelMyOrder,
  getMergedOrders,
  getGroupedOrders,
  getTrackingOrder,
} = useOrderStore(
  useShallow((state) => ({
    myOrders: state.myOrders,
    lastOrder: state.lastOrder,
    myOrdersLoading: state.myOrdersLoading,
    myOrdersError: state.myOrdersError,
    fetchMyOrders: state.fetchMyOrders,
    cancelMyOrder: state.cancelMyOrder,
    getMergedOrders: state.getMergedOrders,
    getGroupedOrders: state.getGroupedOrders,
    getTrackingOrder: state.getTrackingOrder,
  }))
);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const mergedOrdersList = useMemo(
    () => getMergedOrders(),
    [getMergedOrders, myOrders, lastOrder]
  );

  const groupedOrders = useMemo(
    () => getGroupedOrders(),
    [getGroupedOrders, myOrders, lastOrder]
  );

  const trackingOrder = useMemo(
    () => getTrackingOrder(),
    [getTrackingOrder, myOrders, lastOrder]
  );

  const handleCancelOrder = async (orderId) => {
    const result = await cancelMyOrder(orderId);
    if (result?.ok) {
      toast.success(result?.message || "Order cancelled successfully.");
    } else {
      toast.error(result?.message || "Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="py-2">
      <div className="flex gap-8 mb-6">
        <button
          onClick={() => setActiveTab("history")}
          className="text-xl font-bold cursor-pointer transition-colors"
          style={{
            color: activeTab === "history" ? "#2e7d32" : "#9e9e9e",
          }}
        >
          Order History
        </button>
        <button
          onClick={() => setActiveTab("tracking")}
          className="text-xl font-bold cursor-pointer transition-colors"
          style={{ 
            color: activeTab === "tracking" ? "#2e7d32" : "#9e9e9e",
          }}
        >
          Track Orders
        </button>
      </div>

      {activeTab === "history" && (
        <>
          <h2 className="text-2xl font-bold" style={{ color: "#2e7d32" }}>
            Orders
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-8">
            View your history or check the status of recent order
          </p>
        </>
      )}

      {myOrdersLoading && activeTab === "history" && (
        <div className="py-8">
          <LoadingSpinner/>
        </div>
      )}

      {myOrdersError && activeTab === "history" && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {myOrdersError}
        </div>
      )}

      {!myOrdersLoading && (
        activeTab === "history" ? (
          mergedOrdersList.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No orders found.</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <div key={date}>
                  <p className="text-sm text-gray-500 text-right mb-3 font-medium">
                    {date}
                  </p>
                  <div className="space-y-4">
                    {dateOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onCancelOrder={handleCancelOrder} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : trackingOrder ? (
          <OrderTracking
            order={trackingOrder}
            onCancelOrder={handleCancelOrder}
          />
        ) : (
          <div className="py-8 text-center text-gray-500">
            No active orders to track.
          </div>
        )
      )}
    </div>
  );
}
