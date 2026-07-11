import { useState } from "react";
import { FiFileText, FiTag } from "react-icons/fi";
import { useShallow } from "zustand/react/shallow";
import { useOrderStore, useFavoritesStore, useProfileStore } from "../../store";
import CartSection from "../../components/OrderFlow/CartSection";
import VoucherSelection from "../../components/OrderFlow/VoucherSelection";
import OrderSummary from "../../components/OrderFlow/OrderSummary";

export default function Cart() {
  const { items, totalAmount, addItem } = useOrderStore(
    useShallow((state) => ({
      items: state.items,
      totalAmount: state.totalAmount,
      addItem: state.addItem,
    }))
  );

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const points = useProfileStore((state) => state.user?.loyaltyPoints ?? 0);
  const hasHydrated = useProfileStore((state) => state.hasHydrated);
  const selectedDiscount = useOrderStore((state) => state.selectedDiscount);

  // Show voucher CTA only when user has enough points and hydration is complete
  const isEligibleForVoucher = hasHydrated && points >= 100;
  const [showVoucherSelector, setShowVoucherSelector] = useState(false);

  const discountAmount = (totalAmount * selectedDiscount) / 100;
  const finalTotal = totalAmount - discountAmount;

  const handleBackToCart = () => {
    setShowVoucherSelector(false);
  };

  return (
    <div className="cart-page bg-gray-50 min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {showVoucherSelector ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <button
                  type="button"
                  onClick={handleBackToCart}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                >
                  <FiFileText className="text-lg" />
                  <span className="font-medium">← Back to Cart</span>
                </button>
                <VoucherSelection />
              </div>
            ) : (
              <>
                <CartSection 
                  voucherCTA={
                    isEligibleForVoucher && (
                      <button
                        type="button"
                        onClick={() => setShowVoucherSelector(true)}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        <FiTag className="text-lg" />
                        <span className="font-medium">Choose your Voucher →</span>
                      </button>
                    )
                  }
                />
              </>
            )}
          </div>

          {/* Order Summary - Takes 1 column */}
          <div>
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              total={finalTotal}
              discount={selectedDiscount}
              buttonText="Checkout"
              buttonLink="/payment"
              showItems={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
