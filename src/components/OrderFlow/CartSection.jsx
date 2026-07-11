import { useState, useEffect } from "react";
import { FiFileText } from "react-icons/fi";
import { useShallow } from "zustand/react/shallow";
import { useOrderStore } from "../../store";
import CartItem from "./CartItem";

/**
 * CartSection Component
 * 
 * This is the main view for the shopping cart page.
 * 
 * Features:
 * 1. Inventory Management: Uses `CartItem` to allow quantity edits or removal.
 * 2. Performance: Employs `useShallow` for efficient store subscriptions.
 * 3. Local State Buffering: The 'Order Note' input is buffered locally and 
 *    only synced to the global store on "Save", preventing global re-renders on every keystroke.
 * 4. Error Handling: Displays validation messages (e.g., quantity limits) from the store.
 */
export default function CartSection({ voucherCTA }) {
  const { items, updateQuantity, removeItem, note, setNote, error, clearError } = useOrderStore(
    useShallow((state) => ({
      items: state.items,
      updateQuantity: state.updateQuantity,
      removeItem: state.removeItem,
      note: state.note,
      setNote: state.setNote,
      error: state.error,
      clearError: state.clearError,
    }))
  );

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [localNote, setLocalNote] = useState(note);

  // Sync local note when store note changes (e.g. from server or initial load)
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleSaveNote = () => {
    setNote(localNote);
    setIsEditingNote(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Cart</h1>
        {voucherCTA}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex justify-between items-center border border-red-100">
           <span>{error}</span>
           <button onClick={clearError} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

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
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                  placeholder="Special instructions for your order..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  rows="3"
                  autoFocus
                />
                <button
                  onClick={handleSaveNote}
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
