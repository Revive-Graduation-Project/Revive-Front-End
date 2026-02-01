import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import CartItem from "./CartItem";

/**
 * SideCartDrawer Component
 * Slide-out drawer showing cart contents.
 * Controlled by `orderStore` state (`isCartDrawerOpen`).
 */
export default function SideCartDrawer() {
  const items = useOrderStore((state) => state.items);
  const isCartDrawerOpen = useOrderStore((state) => state.isCartDrawerOpen);
  const closeCartDrawer = useOrderStore((state) => state.closeCartDrawer);
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const getTotalWithDelivery = useOrderStore((state) => state.getTotalWithDelivery);
  const totalItems = useOrderStore((state) => state.totalItems);
  
  const navigate = useNavigate();

  const handleViewCart = () => {
    closeCartDrawer();
    navigate("/cart");
  };

  if (!isCartDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-50 transition-opacity"
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Order ({totalItems} items)
          </h2>
          <button
            onClick={closeCartDrawer}
            className="cursor-pointer text-white hover:bg-green-700 p-1 rounded transition-colors"
            aria-label="Close cart"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={() => {}} // No delete in side drawer
                  showDelete={false}
                  showCalories={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Estimated total</span>
              <span className="text-orange-500 font-bold text-xl">
                ${getTotalWithDelivery().toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={handleViewCart}
              className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              View cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
