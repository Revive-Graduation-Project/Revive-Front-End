import OrderSummary from "../../components/OrderFlow/OrderSummary";
import { useOrderStore, useProfileStore } from "../../store";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import VoucherSelection from "../../components/OrderFlow/VoucherSelection";

export default function Checkout() {
  const { items, totalAmount, selectedDiscount } = useOrderStore(
    useShallow((state) => ({
      items: state.items,
      totalAmount: state.totalAmount,
      selectedDiscount: state.selectedDiscount,
    })),
  );

  const points = useProfileStore((state) => state.user?.loyaltyPoints ?? 0);
  const navigate = useNavigate();

  // Only reason to leave this page automatically: an empty cart.
  // No more points-based redirect — voucher becomes an inline optional
  // section on this same page instead of a separate route/step.
  useEffect(() => {
    if (items.length === 0) {
      navigate("/", { replace: true });
    }
  }, [items, navigate]);

  if (items.length === 0) {
    return null;
  }

  const discountAmount = (totalAmount * selectedDiscount) / 100;
  const finalTotal = totalAmount - discountAmount;

  // Eligibility check lives here now, purely for what to render —
  // it's no longer tied to navigation at all.
  const isEligibleForVoucher = points >= 100;

  const handleCheckout = () => {
    // If the user never selected a voucher, selectedDiscount stays 0
    // and pointsToRedeem (read inside OrderSummary/place-order call)
    // stays 0 too — no discount applied, full price charged. That's
    // the default state already, nothing extra needed here.
    navigate("/payment");
  };

  return (
    <div className="checkout-page bg-gray-50 min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart items always shown, voucher shown underneath only if eligible */}
          <div className="lg:col-span-2 space-y-6">
            {isEligibleForVoucher && <VoucherSelection />}
          </div>

          {/* Right: Order summary, always visible, button always proceeds to payment */}
          <div>
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              total={finalTotal}
              discount={selectedDiscount}
              buttonText="Checkout"
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
