import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiMail, FiUser, FiPhone, FiMapPin, FiHash, FiFlag } from "react-icons/fi";
import { useOrderStore } from "../../store";
import FormInput from "../UI/FormInput";
import FormSelect from "../UI/FormSelect";

/**
 * Validation Schema for Checkout
 * Ensures all required delivery and contact info is present.
 */
const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z.string().min(10, "Phone number is invalid"),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is too short"),
  zipCode: z.string().min(4, "Invalid Zip Code"),
});

/**
 * CheckoutForm Component
 * Collects user shipping and billing details.
 * 
 * Features:
 * - Auto-persistence: Syncs with orderStore immediately on change.
 * - Validation: Prevents navigation if data is invalid.
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
    defaultValues: customerDetails
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
        {/* Customer Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiUser className="text-orange-500" />
            Customer details
          </h2>
          
          <div className="space-y-4">
            {/* Email */}
            <FormInput
              label="Email"
              id="email"
              type="email"
              placeholder="Enter your email"
              icon={FiMail}
              error={errors.email?.message}
              {...register("email")}
            />

            {/* First and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="First name"
                id="firstName"
                placeholder="First name"
                icon={FiUser}
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              
              <FormInput
                label="Last name"
                id="lastName"
                placeholder="Last name"
                icon={FiUser}
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            {/* Phone */}
            <FormInput
              label="Phone"
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              icon={FiPhone}
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
        </div>

        {/* Delivery Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiMapPin className="text-orange-500" />
            Delivery details
          </h2>
          
          <div className="space-y-4">
            {/* Region */}
            <FormSelect
              label="Region"
              id="region"
              error={errors.region?.message}
              {...register("region")}
            >
              <option value="">Select region</option>
              <option value="cairo">Cairo</option>
              <option value="giza">Giza</option>
              <option value="alexandria">Alexandria</option>
            </FormSelect>

            {/* City */}
            <FormInput
              label="City"
              id="city"
              placeholder="Enter city"
              icon={FiFlag}
              error={errors.city?.message}
              {...register("city")}
            />

            {/* Address */}
            <FormInput
              label="Address"
              id="address"
              placeholder="Enter your address"
              icon={FiMapPin}
              error={errors.address?.message}
              {...register("address")}
            />

            {/* Zip/Postal Code */}
            <FormInput
              label="Zip / Postal code"
              id="zipCode"
              placeholder="Enter zip code"
              icon={FiHash}
              error={errors.zipCode?.message}
              {...register("zipCode")}
            />
          </div>
        </div>

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

