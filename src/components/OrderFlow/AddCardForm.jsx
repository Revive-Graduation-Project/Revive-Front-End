import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInput from "../UI/FormInput";

/**
 * Validation Schema for Credit Card
 * Enforces:
 * - 16-digit card number (masked input)
 * - Expiry date in MM/YY format
 * - CVV (3-4 digits)
 * - Name required
 */
const cardSchema = z.object({
  cardNumber: z.string()
    .min(19, "Card number must be 16 digits") // 16 digits + 3 spaces
    .max(19, "Card number must be 16 digits"),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid date (MM/YY)")
    .refine((val) => {
      if (!val) return false;
      const [month, year] = val.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      // Set now to start of current month for fair comparison
      const currentMonth = new Date(now.getFullYear(), now.getMonth());
      return expiry >= currentMonth;
    }, "Card has expired"),
  cvv: z.string()
    .regex(/^\d{3,4}$/, "Must be 3-4 digits"),
  cardName: z.string()
    .min(1, "Name is required"),
});

/**
 * AddCardForm Component
 * A modal form for adding a new credit card.
 * Features:
 * - Live card preview
 * - Auto-formatting for card inputs
 * - Zod validation
 *
 * @param {Object} props
 * @param {Function} props.onCancel - Handler to close modal
 * @param {Function} props.onSubmit - Handler for valid submission
 * @param {boolean} props.loading - Submission loading state
 */
export default function AddCardForm({ onCancel, onSubmit, loading }) {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(cardSchema),
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

  // Formatters
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.length > 1 ? parts.join(" ") : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      const monthPart = parseInt(v.slice(0, 2));
      // If month is invalid (> 12) or 00, reject the last character entered
      if (monthPart > 12 || monthPart === 0) {
         return v.slice(0, 1);
      }

      // Year Validation (prevent typing past years)
      if (v.length >= 4) {
        const yearPart = parseInt(v.slice(2, 4));
        const currentYearShort = new Date().getFullYear() % 100;
        
        if (yearPart < currentYearShort) {
            return `${v.slice(0, 2)}/${v.slice(2, 3)}`;
        }
      }

      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const onSubmitForm = (data) => {
    // Strip spaces for submission
    const cleanData = {
      ...data,
      cardNumber: data.cardNumber.replace(/\s/g, "")
    };
    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
       
       {/* Card Banner Image */}
       <div className="h-32 bg-gray-900 rounded-xl mb-6 relative overflow-hidden group">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          
          <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
              <div className="flex justify-between items-start">
                  <span className="text-xs font-mono uppercase tracking-widest opacity-70">Credit Card</span>
                  <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6M22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6M22 6H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </div>
              <div className="space-y-1">
                  <p className="font-mono text-xl tracking-wider text-shadow-sm">
                      {cardNumber || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between items-end text-xs opacity-80 font-mono">
                      <span>{cardName || "YOUR NAME"}</span>
                      <span>{expiryDate || "MM/YY"}</span>
                  </div>
              </div>
          </div>
       </div>

       <div className="space-y-4">
          <FormInput
            label="Card number"
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="rounded-lg"
            error={errors.cardNumber?.message}
            {...register("cardNumber", {
              onChange: (e) => {
                const formatted = formatCardNumber(e.target.value);
                setValue("cardNumber", formatted);
              }
            })}
          />

          <div className="grid grid-cols-2 gap-4">
             <FormInput
               label="Expiry date"
               id="expiryDate"
               placeholder="MM/YY"
               maxLength={5}
               error={errors.expiryDate?.message}
               {...register("expiryDate", {
                 onChange: (e) => {
                    const formatted = formatExpiry(e.target.value);
                    setValue("expiryDate", formatted);
                 }
               })}
             />
             <FormInput
               label="CVV"
               id="cvv"
               placeholder="123"
               type="password"
               maxLength={4}
               error={errors.cvv?.message}
               {...register("cvv", {
                 onChange: (e) => {
                   setValue("cvv", e.target.value.replace(/\D/g, "").slice(0, 4));
                 }
               })}
             />
          </div>

          <FormInput
            label="Card name (Option)"
            id="cardName"
            placeholder="Enter card name"
            error={errors.cardName?.message}
            {...register("cardName")}
          />
          
          <div className="flex items-center gap-2 mt-2">
             <input type="checkbox" id="remember" className="w-4 h-4 rounded text-orange-500 border-gray-300 focus:ring-orange-500" />
             <label htmlFor="remember" className="text-sm text-gray-600 select-none">Remember this card</label>
          </div>
       </div>

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
