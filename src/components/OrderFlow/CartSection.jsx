import { useState } from "react";
import { FiFileText } from "react-icons/fi";
import { useOrderStore } from "../../store";
import CartItem from "./CartItem";

/**
 * CartSection Component
 * Displays list of items in the cart and allows updating quantities/removing items.
 * Also handles adding an "Order Note".
 */
export default function CartSection() {
  const items = useOrderStore((state) => state.items);
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeItem = useOrderStore((state) => state.removeItem);
  const note = useOrderStore((state) => state.note);
  const setNote = useOrderStore((state) => state.setNote);
  const [isEditingNote, setIsEditingNote] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                showDelete={true}
                showCalories={true}
              />
            ))}
          </div>

          {/* Add a Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {!isEditingNote ? (
              <button
                onClick={() => setIsEditingNote(true)}
                className="cursor-pointer flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <FiFileText className="text-xl" />
                <span>{note ? "Edit note" : "Add a note"}</span>
              </button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Special instructions for your order..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  rows="3"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="cursor-pointer text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Save Note
                </button>
              </div>
            )}
            
            {!isEditingNote && note && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg flex justify-between items-start group">
                <p className="text-sm text-gray-700">{note}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
