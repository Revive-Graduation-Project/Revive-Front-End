import { useState, useEffect, useMemo } from "react";
import { FiFileText } from "react-icons/fi";
import { useShallow } from "zustand/react/shallow";
import { useOrderStore, useFavoritesStore, useProfileStore } from "../../store";
import CartSection from "../../components/OrderFlow/CartSection";

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

  // Skip checkout page if user doesn't have enough points for vouchers
  // Wait for hydration to complete before deciding eligibility
  const isEligibleForVoucher = hasHydrated && points >= 100;
  const checkoutButtonLink = isEligibleForVoucher ? "/checkout" : "/payment";

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
              total={totalAmount}
              buttonText="Checkout"
              buttonLink={checkoutButtonLink}
              showItems={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
