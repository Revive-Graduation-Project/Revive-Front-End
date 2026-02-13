import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import { useEffect } from "react";
import OrderConfirmationDetails from "../../components/OrderFlow/OrderConfirmationDetails";
import CustomerInfoSummary from "../../components/OrderFlow/CustomerInfoSummary";

export default function Thanks() {
  const navigate = useNavigate();
  
  // Get confirmed order state
  const lastOrder = useOrderStore((state) => state.lastOrder);

  useEffect(() => {
     if (!lastOrder) {
    navigate("/");
     }
  }, [lastOrder, navigate]);

  if (!lastOrder) return null; // Or a loading spinner

  const { items, customerDetails, finalTotal, totalAmount, deliveryFee, id } = lastOrder;

  const handleContinue = () => {
    navigate("/");
  };

  return (
        <div className="thanks-page bg-white min-h-screen pt-42 pb-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* Header Section */}
        <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-3">
          Thank you, <span className="capitalize">{customerDetails.firstName || "Guest"} {customerDetails.lastName || ""}</span>
        </h1>
        <p className="text-gray-500 mb-2">you'll receive a confirmation email soon.</p>
        <p className="text-gray-900 font-medium mb-12">Order number: {id}</p>

        {/* Order Details Card */}
        <OrderConfirmationDetails 
          items={items}
          totalAmount={totalAmount}
          deliveryFee={deliveryFee}
          finalTotal={finalTotal}
        />

        {/* Customer Info Card */}
        <CustomerInfoSummary 
          customerDetails={customerDetails}
          paymentMethod={lastOrder.paymentMethod}
          cardDetails={lastOrder.cardDetails}
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

      </div>
    </div>
  );
}
