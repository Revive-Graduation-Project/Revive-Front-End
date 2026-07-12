import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import PaymentMethodSelector from "./Payment/PaymentMethodSelector";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === "credit_card" && (!stripe || !elements)) {
      return;
    }

    setIsProcessing(true);
    const result = await submitOrder();

    if (result?.success) {
       if (paymentMethod === "credit_card" && result.clientSecret) {
           const { error } = await stripe.confirmCardPayment(result.clientSecret, {
              payment_method: {
                 card: elements.getElement(CardElement),
                 // Ideally pass customer details here:
                 // billing_details: { name: "..." }
              }
           });
           
           if (error) {
              useOrderStore.getState().setError(error.message);
              setIsProcessing(false);
              return;
           }
       }
       setIsProcessing(false);
       navigate("/thanks");
    } else {
       setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        
        {/* Payment Options Container */}
        <PaymentMethodSelector 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
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
          disabled={loading || isProcessing}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-full transition-colors shadow-lg shadow-orange-500/20 transform active:scale-[0.99] ${
            (loading || isProcessing) ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading || isProcessing ? "Processing..." : "Confirm payment"}
        </button>

      </form>
    </div>
  );
}
