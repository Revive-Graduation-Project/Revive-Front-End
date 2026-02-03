import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import Modal from "../UI/Modal";
import AddCardForm from "./AddCardForm";

/**
 * PaymentForm Component
 * Handles payment method selection and order submission.
 * Matches the specific design: Vertical options list + Popup for Add Card.
 */
/**
 * PaymentForm Component
 * Handles the final step of the order process: Method selection and submission.
 * 
 * Logic:
 * - Supports 'cash' and 'credit_card'
 * - If 'credit_card' is selected, enforces that a card must be saved.
 * - Triggers global submitOrder action which handles API simulation and store updates.
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          
          {/* Cash on Delivery Option */}
          <div 
            onClick={() => setPaymentMethod("cash")}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
              paymentMethod === "cash" ? "bg-orange-50/50" : ""
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center text-gray-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
            </div>
            <span className="font-medium text-gray-800">Cash on delivery</span>
            {paymentMethod === "cash" && (
              <div className="ml-auto text-orange-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            )}
          </div>

          {/* Credit Card Option */}
          <div 
            onClick={() => handleMethodSelect("credit_card")}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              paymentMethod === "credit_card" ? "bg-orange-50/50" : ""
            }`}
          >
             <div className="w-10 h-10 flex items-center justify-center text-gray-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
             </div>
             
             <div className="flex-1">
                <span className="font-medium text-gray-800 block">Credit card</span>
                {savedCard && (
                    <span className="text-xs text-gray-500 font-mono">
                         {savedCard.cardNumber}
                    </span>
                )}
             </div>

             {paymentMethod === "credit_card" && (
              <div className="ml-auto text-orange-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            )}
          </div>

        </div>

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
