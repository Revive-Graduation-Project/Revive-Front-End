import CheckoutForm from "../../components/OrderFlow/CheckoutForm";
import OrderSummary from "../../components/OrderFlow/OrderSummary";
import { useOrderStore } from "../../store";
import { useNavigate } from "react-router";

import { useEffect } from "react";

export default function Checkout() {
  const items = useOrderStore((state) => state.items);
  const totalAmount = useOrderStore((state) => state.totalAmount);
  const getDeliveryFee = useOrderStore((state) => state.getDeliveryFee);
  const getTotalWithDelivery = useOrderStore((state) => state.getTotalWithDelivery);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/menu", { replace: true });
    }
  }, [items, navigate]);

  return (
    <div className="checkout-page bg-gray-50 min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Order Summary - Takes 1 column */}
          <div>
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              delivery={getDeliveryFee()}
              total={getTotalWithDelivery()}
              buttonText="Continue"
              buttonLink="#"
              showItems={true}
              onEdit={() => navigate("/cart")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
