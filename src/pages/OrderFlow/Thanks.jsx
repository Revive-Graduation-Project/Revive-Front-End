import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import { useEffect, useState } from "react";
import OrderConfirmationDetails from "../../components/OrderFlow/OrderConfirmationDetails";

export default function Thanks() {
  const navigate = useNavigate();

  // Get confirmed order state
  const lastOrder = useOrderStore((state) => state.lastOrder);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
     if (!lastOrder) {
    navigate("/");
     }

     // If order exists but not yet CONFIRMED, show loading
     if (lastOrder && lastOrder.status !== 'CONFIRMED') {
       setIsPolling(true);
     } else {
       setIsPolling(false);
     }
  }, [lastOrder, navigate]);

  if (!lastOrder) return null; // Or a loading spinner

  const { items, customerDetails, totalPrice, id, status } = lastOrder;

  const handleContinue = () => {
    navigate("/");
  };

  return (
        <div className="thanks-page bg-white min-h-screen pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 text-center">

        {/* Loading state while polling for CONFIRMED status */}
        {isPolling ? (
          <div className="py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Processing your order...</h2>
            <p className="text-gray-500">Please wait while we confirm your payment.</p>
            <p className="text-sm text-gray-400 mt-2">Order number: {id}</p>
          </div>
        ) : (
          <>
            {/* Header Section - Only show when CONFIRMED */}
            <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-3">
              Thank you, <span className="capitalize">{customerDetails.firstName || "Guest"} {customerDetails.lastName || ""}</span>
            </h1>
            <p className="text-gray-500 mb-2">you'll receive a confirmation email soon.</p>
            <p className="text-gray-900 font-medium mb-12">Order number: {id}</p>

            {/* Order Details Card - Only show when CONFIRMED */}
            <OrderConfirmationDetails
              items={items}
              totalAmount={totalPrice}
            />

            {/* Continue Browsing */}
            <div className="mt-12">
              <button
                onClick={handleContinue}
                className="cursor-pointer text-green-600 border-b border-green-600 pb-0.5 hover:text-green-700 font-medium transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
