import { useOrderStore } from "../../store";
import { useNavigate } from "react-router";
import OrderSummary from "../../components/OrderFlow/OrderSummary";
import PaymentForm from "../../components/OrderFlow/PaymentForm";
import CustomerDeliveryDetails from "../../components/OrderFlow/CustomerDeliveryDetails";

export default function Payment() {
  const navigate = useNavigate();
  const items = useOrderStore((state) => state.items);
  const totalAmount = useOrderStore((state) => state.totalAmount);
  const getDeliveryFee = useOrderStore((state) => state.getDeliveryFee);
  const getTotalWithDelivery = useOrderStore((state) => state.getTotalWithDelivery);
  const customerDetails = useOrderStore((state) => state.customerDetails);

  return (
    <div className="payment-page bg-gray-50 min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* If desktop, we keep the side-by-side layout, but update the content to match the design style. 
            The design shows a clean white card for "Customer & Delivery details" and "Payment".
        */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            <CustomerDeliveryDetails 
              customerDetails={customerDetails} 
              onEdit={() => navigate("/checkout")} 
            />

            {/* Payment Method Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Payment</h2>
              <PaymentForm />
            </div>

          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              delivery={getDeliveryFee()}
              total={getTotalWithDelivery()}
              buttonText="Confirm payment" // This text will likely be managed by PaymentForm now effectively, or hidden
              buttonLink={null}
              showItems={true}
              onEdit={() => navigate("/cart")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
