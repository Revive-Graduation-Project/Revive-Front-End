import { useState, useEffect, useMemo } from "react";
import { FiFileText } from "react-icons/fi";
import { useShallow } from "zustand/react/shallow";
import { useOrderStore, useFavoritesStore } from "../../store";
import { DELIVERY_FEE } from "../../constants";
import CartSection from "../../components/OrderFlow/CartSection";
import { mockMeals } from "../../mocks/meals";
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

  const deliveryFee = useMemo(() => (items.length > 0 ? DELIVERY_FEE : 0), [items.length]);
  const totalWithDelivery = useMemo(() => totalAmount + deliveryFee, [totalAmount, deliveryFee]);

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
              delivery={deliveryFee}
              total={totalWithDelivery}
              buttonText="Checkout"
              buttonLink="/checkout"
              showItems={false}
            />
          </div>
          {/* remove when the menu is ready */}
          {items.length === 0 && (
            <div className="lg:col-span-3 text-center mt-8">
              <button
                onClick={() => addItem(mockMeals[0])}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition mr-4"
              >
                Add Test Item (Dev Only)
              </button>
              {/* remove when the menu is ready */}
              <button
                onClick={() => toggleFavorite(mockMeals[0])}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Add Test Favorite (Dev Only)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
