import { useOrderStore } from "../../store";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import OrderSummary from "../../components/OrderFlow/OrderSummary";
import PaymentForm from "../../components/OrderFlow/PaymentForm";

export default function Payment() {
  const navigate = useNavigate();

  const { items, totalAmount, selectedDiscount } = useOrderStore(
    useShallow((state) => ({
      items: state.items,
      totalAmount: state.totalAmount,
      selectedDiscount: state.selectedDiscount,
    }))
  );

  const discountAmount = (totalAmount * selectedDiscount) / 100;
  const finalTotal = totalAmount - discountAmount;

  return (
    <div className="payment-page bg-gray-50 min-h-screen pt-32 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Payment</h2>
            {/* PaymentForm handles BOTH cash and credit card internally,
                including the "Confirm payment" button, loading state,
                and error display. No need to branch on paymentMethod here. */}
            <PaymentForm />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              total={finalTotal}
              discount={selectedDiscount}
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