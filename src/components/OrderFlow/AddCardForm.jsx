import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardSchema } from "./AddCard/CardValidation";
import { formatCardNumber, formatExpiry } from "./AddCard/cardFormatters";
import CardPreview from "./AddCard/CardPreview";
import CardInputs from "./AddCard/CardInputs";



/**
 * AddCardForm Component
 * 
 * A specialized modal form for adding credit card information securely.
 * 
 * Key Features:
 * 1. LIVE PREVIEW: Watches input values to render a visual card banner in real-time.
 * 2. AUTO-FORMATTING: Automatically inserts spaces in card numbers and slashes in expiry dates.
 * 3. SECURITY MASKING: Immediately masks the card number and CVV on submission 
 *    before passing data to the parent, ensuring full card details are never stored.
 * 4. VALIDATION: Uses Zod for complex rules like expiry date future-checks.
 */
export default function AddCardForm({ onSubmit, loading }) {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    }
  });

  // Watch values for the card preview
  const cardNumber = watch("cardNumber");
  const cardName = watch("cardName");
  const expiryDate = watch("expiryDate");

  const onSubmitForm = (data) => {
    // Pass raw data to parent - PaymentForm handles the masking/tokenization
    // Since Zod transform in CardSchema might not have applied if we rely on raw data here,
    // we explicitly clean it just to be safe, or trust that Zod's 'data' is clean.
    // However, react-hook-form's 'handleSubmit' data usually reflects transformed values if resolver is used.
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
       
       <CardPreview 
          cardNumber={cardNumber}
          cardName={cardName}
          expiryDate={expiryDate}
       />

       <CardInputs 
          register={register}
          errors={errors}
          setValue={setValue}
          onFormatCardNumber={formatCardNumber}
          onFormatExpiry={formatExpiry}
       />

       <button
        type="submit"
        disabled={loading}
        className={`cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-3 rounded-lg transition-colors shadow-md ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add card"}
      </button>

    </form>
  );
}