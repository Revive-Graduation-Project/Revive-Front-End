// import CheckoutForm from "../../components/OrderFlow/CheckoutForm";
import OrderSummary from "../../components/OrderFlow/OrderSummary";
import { useOrderStore } from "../../store";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function Checkout() {
  const { items, totalAmount } = useOrderStore(
    useShallow((state) => ({
      items: state.items,
      totalAmount: state.totalAmount,
    }))
  );
  
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/", { replace: true });
    } else {
      // Skip customer details, go directly to payment
      navigate("/payment", { replace: true });
    }
  }, [items, navigate]);

  return (
    <div className="checkout-page bg-gray-50 min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            {/* <CheckoutForm /> */}
          </div>

          {/* Order Summary - Takes 1 column */}
          <div>
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              total={totalAmount}
              buttonText="Continue"
              buttonLink="/payment"
              showItems={true}
              onEdit={() => navigate("/cart")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
