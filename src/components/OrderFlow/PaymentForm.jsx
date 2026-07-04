import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Modal from "../UI/Modal";
import StripeCardElement from "./Payment/StripeCardElement";
import PaymentMethodSelector from "./Payment/PaymentMethodSelector";

/**
 * PaymentForm Component
 * 
 * The final step of the checkout flow where the user selects a payment method 
 * and confirms the order.
 * 
 * Logic & Orchestration:
 * - Method Switching: Supports 'cash' and 'credit_card'.
 * - Stripe Integration: Uses Stripe Elements for secure card input.
 * - Payment Flow:
 *   1. For cash: submitOrder directly, polls for status
 *   2. For credit card: submitOrder returns clientSecret, then confirm with Stripe
 * - Navigation: Redirects to the "/thanks" success page upon transaction completion.
 */
export default function PaymentForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  // Store actions and state
  const submitOrder = useOrderStore((state) => state.submitOrder);
  const confirmStripePayment = useOrderStore((state) => state.confirmStripePayment);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === "credit_card") {
      setIsAddCardOpen(true);
    }
  };

  const handleCardComplete = () => {
    setIsAddCardOpen(false);
    setPaymentMethod("credit_card");
    setStripeError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStripeError(null);

    // For cash orders, submit directly
    if (paymentMethod === "cash") {
      const success = await submitOrder();
      if (success) navigate("/thanks");
      return;
    }

    // For credit card, need card element
    if (paymentMethod === "credit_card") {
      if (!stripe || !elements) {
        setStripeError("Stripe not loaded. Please refresh the page.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setIsAddCardOpen(true);
        return;
      }

      // Step 1: Submit order to get clientSecret
      const orderResult = await submitOrder();
      
      if (orderResult?.requiresPayment) {
        // Step 2: Confirm payment with Stripe
        const success = await confirmStripePayment(stripe, cardElement);
        if (success) navigate("/thanks");
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        
        {/* Payment Options Container */}
        <PaymentMethodSelector 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onAddCard={() => setIsAddCardOpen(true)}
        />

        {/* Error Message */}
        {(error || stripeError) && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {stripeError || error}
            </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-full transition-colors shadow-lg shadow-orange-500/20 transform active:scale-[0.99] ${
            loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Processing..." : "Confirm payment"}
        </button>

      </form>
      
      {/* Add Card Modal with Stripe Elements */}
      <Modal 
        isOpen={isAddCardOpen} 
        onClose={() => setIsAddCardOpen(false)}
        title="Add card"
      >
         <StripeCardElement 
           onCardComplete={handleCardComplete}
           onError={setStripeError}
           loading={loading}
         />
      </Modal>
    </div>
  );
}
