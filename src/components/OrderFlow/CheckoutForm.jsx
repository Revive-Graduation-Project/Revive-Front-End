import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrderStore } from "../../store";
import { checkoutSchema } from "./Checkout/checkoutValidation";
import CustomerDetails from "./Checkout/CustomerDetails";
import DeliveryDetails from "./Checkout/DeliveryDetails";

/**
 * CheckoutForm Component
 * 
 * The first step of the checkout process, responsible for gathering and 
 * validating customer contact and delivery information.
 * 
 * Features:
 * - Zod Validation: Strict schema enforcement for emails, phones, and addresses.
 * - Auto-Persistence: Uses a `watch` subscription to automatically sync 
 *   form state to the global `orderStore` as the user types, preserving progress 
 *   across navigation.
 * - Centralized Options: Geography data (Regions) is pulled from `src/constants.js`.
 */
export default function CheckoutForm() {
  const navigate = useNavigate();

  // Store access
  const customerDetails = useOrderStore((state) => state.customerDetails);
  const setCustomerDetails = useOrderStore((state) => state.setCustomerDetails);

  // Initialize form
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: customerDetails || {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      region: "",
      city: "",
      address: "",
      zipCode: ""
    }
  });

  // Sync form changes to store (Persistence)
  useEffect(() => {
    const subscription = watch((value) => {
      setCustomerDetails(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, setCustomerDetails]);

  const onSubmit = (data) => {
    // Final sync and navigate
    setCustomerDetails(data);
    navigate("/payment");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        
        <CustomerDetails register={register} errors={errors} />

        <DeliveryDetails register={register} errors={errors} />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center cursor-pointer shadow-sm"
        >
            Continue to Payment
        </button>
      </form>
    </div>
  );
}
