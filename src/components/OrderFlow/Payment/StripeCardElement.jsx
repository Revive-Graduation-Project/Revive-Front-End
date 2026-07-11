import { useState, useRef } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
} from "@stripe/react-stripe-js";
import CardPreview from "../AddCard/CardPreview";

/**
 * StripeCardElement Component
 *
 * A secure, PCI-compliant card input using Stripe's split Elements
 * (CardNumberElement / CardExpiryElement / CardCvcElement), paired with
 * a live CardPreview above the form.
 *
 * Reports completeness/errors upward via props. Exposes the CardNumberElement
 * ref via onElementReady for parent payment confirmation. Does NOT confirm payment
 * itself — the parent checkout flow owns that using the Stripe instance
 * and clientSecret from order creation.
 */

const ELEMENT_STYLE = {
  base: {
    fontSize: "15px",
    color: "#1f2937",
    fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    "::placeholder": { color: "#9ca3af" },
  },
  invalid: {
    color: "#ef4444",
    iconColor: "#ef4444",
  },
};

const CARD_FIELD_KEYS = ["cardNumber", "cardExpiry", "cardCvc"];

export default function StripeCardElement({ onCardComplete, onError, loading, onElementReady }) {
  const stripe = useStripe();
  const cardNumberRef = useRef(null);

  const [complete, setComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    cardNumber: null,
    cardExpiry: null,
    cardCvc: null,
  });
  const [focused, setFocused] = useState(null);
  const [brand, setBrand] = useState("unknown");
  const [cardName, setCardName] = useState("");

  const handleChange = (key) => (event) => {
    const nextComplete = { ...complete, [key]: event.complete };
    const nextErrors = { ...fieldErrors, [key]: event.error ? event.error.message : null };

    setComplete(nextComplete);
    setFieldErrors(nextErrors);
    if (key === "cardNumber" && event.brand) setBrand(event.brand);

    const firstError = CARD_FIELD_KEYS.map((k) => nextErrors[k]).find(Boolean) || null;
    
    onError(firstError);

    // Notify parent when card number element is ready
    if (key === "cardNumber" && cardNumberRef.current && onElementReady) {
      onElementReady(cardNumberRef.current);
    }
  };

  const handleConfirmCard = () => {
    const allComplete = CARD_FIELD_KEYS.every((k) => complete[k]);
    const firstError = CARD_FIELD_KEYS.map((k) => fieldErrors[k]).find(Boolean) || null;
    
    if (allComplete && !firstError) {
      onCardComplete();
    }
  };

  const handleNameChange = (e) => {
    setCardName(e.target.value);
  };

  const fieldWrapperClass = (key) =>
    [
      "rounded-lg border bg-white px-3.5 py-3 transition-colors",
      fieldErrors[key]
        ? "border-red-400"
        : focused === key
          ? "border-orange-500 ring-2 ring-orange-100"
          : "border-gray-300",
    ].join(" ");

  const allComplete = CARD_FIELD_KEYS.every((k) => complete[k]);

  return (
    <div>
      <CardPreview
        cardName={cardName}
        brand={brand}
        focusedField={focused}
        isComplete={allComplete}
      />

      <div className="space-y-4">
        {/* Card number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
            Card number
          </label>
          <div id="cardNumber" className={fieldWrapperClass("cardNumber")}>
            <CardNumberElement
              ref={cardNumberRef}
              options={{ style: ELEMENT_STYLE, placeholder: "0000 0000 0000 0000" }}
              onChange={handleChange("cardNumber")}
              onFocus={() => setFocused("cardNumber")}
              onBlur={() => setFocused(null)}
              disabled={loading}
              onReady={() => {
                if (onElementReady && cardNumberRef.current) {
                  onElementReady(cardNumberRef.current);
                }
              }}
            />
          </div>
          {fieldErrors.cardNumber && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.cardNumber}</p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1.5">
              Expiry date
            </label>
            <div id="cardExpiry" className={fieldWrapperClass("cardExpiry")}>
              <CardExpiryElement
                options={{ style: ELEMENT_STYLE, placeholder: "MM/YY" }}
                onChange={handleChange("cardExpiry")}
                onFocus={() => setFocused("cardExpiry")}
                onBlur={() => setFocused(null)}
                disabled={loading}
              />
            </div>
            {fieldErrors.cardExpiry && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.cardExpiry}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1.5">
              CVV
            </label>
            <div id="cardCvc" className={fieldWrapperClass("cardCvc")}>
              <CardCvcElement
                options={{ style: ELEMENT_STYLE, placeholder: "123" }}
                onChange={handleChange("cardCvc")}
                onFocus={() => setFocused("cardCvc")}
                onBlur={() => setFocused(null)}
                disabled={loading}
              />
            </div>
            {fieldErrors.cardCvc && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.cardCvc}</p>
            )}
          </div>
        </div>

        {/* Cardholder name — plain input, not Stripe-controlled.
            Safe to read/display directly since it's not sensitive card data. */}
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Card name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="cardName"
            type="text"
            placeholder="Enter card name"
            value={cardName}
            onChange={handleNameChange}
            onFocus={() => setFocused("cardName")}
            onBlur={() => setFocused(null)}
            disabled={loading}
            className={fieldWrapperClass("cardName") + " w-full outline-none text-sm text-gray-800"}
          />
        </div>

        {/* Confirm Card Button */}
        <button
          type="button"
          onClick={handleConfirmCard}
          disabled={!allComplete || loading}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors ${
            !allComplete || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Processing..." : "Confirm card"}
        </button>

        {!stripe && <p className="text-xs text-gray-400">Loading payment form...</p>}
      </div>
    </div>
  );
}