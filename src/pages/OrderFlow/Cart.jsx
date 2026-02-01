import CartSection from "../../components/OrderFlow/CartSection";
import OrderSummary from "../../components/OrderFlow/OrderSummary";
import { useOrderStore } from "../../store";

export default function Cart() {
  const items = useOrderStore((state) => state.items);
  const totalAmount = useOrderStore((state) => state.totalAmount);
  const getDeliveryFee = useOrderStore((state) => state.getDeliveryFee);
  const getTotalWithDelivery = useOrderStore((state) => state.getTotalWithDelivery);

  return (
    <div className="cart-page bg-gray-50 min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CartSection />
          </div>

          {/* Order Summary - Takes 1 column */}
          <div>
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              delivery={getDeliveryFee()}
              total={getTotalWithDelivery()}
              buttonText="Checkout"
              buttonLink="/checkout"
              showItems={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
