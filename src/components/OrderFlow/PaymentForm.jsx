import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import { useStripe } from "@stripe/react-stripe-js";
import StripeCardElement from "./Payment/StripeCardElement";
import PaymentMethodSelector from "./Payment/PaymentMethodSelector";
import Modal from '../ui/Modal';

/**
 * PaymentForm Component
 * * Maps state data to match the explicit backend JSON structures:
 * Request Payload matches: { items: [...], points: X, paymentMethod: STR }
 * Response Payload matches: { status: "PENDING", stripeClientSecret: "...", ... }
 */
export default function PaymentForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  
  // Store actions and state
  const submitOrder = useOrderStore((state) => state.submitOrder);
  const confirmStripePayment = useOrderStore((state) => state.confirmStripePayment);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [stripeError, setStripeError] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [currentClientSecret, setCurrentClientSecret] = useState(null);

  const handleElementReady = (element) => {
    setCardElement(element);
  };

  // Triggered when user enters valid card data and hits "Pay" inside the StripeCardElement
  const handleCardComplete = async () => {
    if (!stripe || !cardElement || !currentClientSecret) {
      setStripeError("Payment credentials or card elements are missing.");
      return;
    }

    try {
      // Pass the extracted stripeClientSecret directly to Stripe's SDK action
      const success = await confirmStripePayment(stripe, cardElement, currentClientSecret);
      if (success) {
        setIsAddCardOpen(false);
        navigate("/thanks");
      } else {
        setStripeError("Payment failed. Please try again or use a different card.");
      }
    } catch (err) {
      setStripeError(err.message || "Card validation failed. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsAddCardOpen(false);
    setCardElement(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStripeError(null);

    if (!paymentMethod) {
      setStripeError("Please select a payment method before submitting.");
      return;
    }

    try {
      // 1. Submit the order structure to the backend API via the store
      // Ensure your store maps cart state to match: { items: [{ mealId, quantity }], points, paymentMethod }
      const orderResponse = await submitOrder();

      if (!orderResponse) {
        setStripeError(error || "Failed to process order creation request.");
        return;
      }

      // 2. Route based on the chosen payment method and order status
      if (paymentMethod === "CASH") {
        if (orderResponse.status === "PENDING" || orderResponse.status === "CONFIRMED") {
          navigate("/thanks");
        }
        return;
      }

      if (paymentMethod === "CREDIT_CARD") {
        if (!stripe) {
          setStripeError("Stripe SDK is unavailable. Please check your connection.");
          return;
        }

        // Check for your exact response property key
        if (orderResponse.status === "PENDING" && orderResponse.stripeClientSecret) {
          setCurrentClientSecret(orderResponse.stripeClientSecret);
          setIsAddCardOpen(true);
        } else {
          setStripeError("Order initiated but no transaction token was provided by server.");
        }
      }
    } catch (err) {
      setStripeError(err.message || "Failed to process order creation request.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        
        <PaymentMethodSelector 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
        />

        {(error || stripeError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-medium animate-fadeIn">
                {stripeError || error}
            </div>
        )}

        <button
          type="submit"
          disabled={loading || !paymentMethod}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide uppercase py-4 rounded-full transition-all duration-200 shadow-md shadow-orange-500/10 active:scale-[0.98] ${
            loading || !paymentMethod ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Processing..." : paymentMethod === "CREDIT_CARD" ? "Continue to Payment" : "Place Order"}
        </button>

      </form>
      
      <Modal
        isOpen={isAddCardOpen} 
        onClose={handleModalClose}
        title="Enter Card Details"
      >
         <StripeCardElement 
           onCardComplete={handleCardComplete}
           onError={setStripeError}
           loading={loading}
           onElementReady={handleElementReady}
         />
      </Modal>
    </div>
  );
}