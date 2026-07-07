import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import Modal from "../ui/Modal";
import AddCardForm from "./AddCardForm";
import PaymentMethodSelector from "./Payment/PaymentMethodSelector";

/**
 * PaymentForm Component
 * 
 * The final step of the checkout flow where the user selects a payment method 
 * and confirms the order.
 * 
 * Logic & Orchestration:
 * - Method Switching: Supports 'cash' and 'credit_card'.
 * - Modal Orchestration: Automatically triggers the `AddCardForm` modal if 
 *   'credit_card' is selected without a saved card.
 * - Conditional Submission: Validates that a payment method is fully configured 
 *   before allowing the global `submitOrder` action to proceed.
 * - Navigation: Redirects to the "/thanks" success page upon transaction completion.
 */
export default function PaymentForm() {
  const navigate = useNavigate();
  
  // Store actions and state
  const submitOrder = useOrderStore((state) => state.submitOrder);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);
  const saveCard = useOrderStore((state) => state.saveCard);
  const savedCard = useOrderStore((state) => state.savedCard);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === "credit_card" && !savedCard) {
      setIsAddCardOpen(true);
    }
  };

  const handleAddCard = (details) => {
    // In a real app, validation and tokenization happen here
    // Save masked details to store
    const maskedDetails = {
        ...details,
        cardNumber: `**** **** **** ${details.cardNumber.slice(-4)}`
    };
    saveCard(maskedDetails);
    
    setIsAddCardOpen(false);
    setPaymentMethod("credit_card"); // Ensure it's selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if card is required but not added
    if (paymentMethod === "credit_card" && !savedCard) {
        setIsAddCardOpen(true);
        return;
    }

    const success = await submitOrder();
    if (success) navigate("/thanks");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        
        {/* Payment Options Container */}
        <PaymentMethodSelector 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            savedCard={savedCard}
            onAddCard={() => setIsAddCardOpen(true)}
            onEditCard={() => {
                setPaymentMethod("credit_card");
                setIsAddCardOpen(true);
            }}
        />

        {/* Error Message */}
        {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
            </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-full transition-colors shadow-lg shadow-orange-500/20 transform active:scale-[0.99] transition-transform ${
            loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Processing..." : "Confirm payment"}
        </button>

      </form>
      
      {/* Add Card Modal */}
      <Modal 
        isOpen={isAddCardOpen} 
        onClose={() => setIsAddCardOpen(false)}
        title="Add card"
      >
         <AddCardForm 
           onCancel={() => setIsAddCardOpen(false)}
           onSubmit={handleAddCard}
           loading={false}
         />
      </Modal>
    </div>
  );
}
