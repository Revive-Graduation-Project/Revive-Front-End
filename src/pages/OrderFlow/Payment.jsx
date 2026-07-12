import { useOrderStore } from "../../store";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { DELIVERY_FEE } from "../../constants";
import OrderSummary from "../../components/OrderFlow/OrderSummary";
import PaymentForm from "../../components/OrderFlow/PaymentForm";
import CustomerDeliveryDetails from "../../components/OrderFlow/CustomerDeliveryDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to use your actual test publishable key in environment variables.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

export default function Payment() {
  const navigate = useNavigate();
  
  const { items, totalAmount, customerDetails } = useOrderStore(
    useShallow((state) => ({
      items: state.items,
      totalAmount: state.totalAmount,
      customerDetails: state.customerDetails,
    }))
  );

  const deliveryFee = useMemo(() => (items.length > 0 ? DELIVERY_FEE : 0), [items.length]);
  const totalWithDelivery = useMemo(() => totalAmount + deliveryFee, [totalAmount, deliveryFee]);

  return (
    <Elements stripe={stripePromise}>
      <div className="payment-page bg-gray-50 min-h-screen pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <CustomerDeliveryDetails 
                customerDetails={customerDetails} 
                onEdit={() => navigate("/checkout")} 
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Payment</h2>
                <PaymentForm />
              </div>
            </div>
            <div>
              <OrderSummary
                items={items}
                subtotal={totalAmount}
                delivery={deliveryFee}
                total={totalWithDelivery}
                buttonText="Confirm payment"
                buttonLink={null}
                showItems={true}
                showPointsRedemption={true}
                onEdit={() => navigate("/cart")}
              />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}
