import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import OrderSuccessModal from "./OrderSuccessModal";
import FormInput from "../UI/FormInput";
import FormSelect from "../UI/FormSelect";

/**
 * CheckoutForm Component
 * Handles user input for shipping/billing details and order submission.
 * Uses `orderStore` for state management and submission logic.
 */
export default function CheckoutForm() {
  const navigate = useNavigate();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use store for state access
  const customerDetails = useOrderStore((state) => state.customerDetails);
  const setCustomerDetails = useOrderStore((state) => state.setCustomerDetails);
  const clearCart = useOrderStore((state) => state.clearCart);
  
  // New actions for API submission
  const submitOrder = useOrderStore((state) => state.submitOrder);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);

  /**
   * Handle input changes and persist to store
   */
  const handleChange = (e) => {
    setCustomerDetails({
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle form submission
   * Calls the async submitOrder action from store
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call async submit order
    const success = await submitOrder();
    
    if (success) {
       // Show success modal instead of alert
       setShowSuccessModal(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    clearCart();
    navigate("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Customer Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer details</h2>
          
          <div className="space-y-4">
            {/* Email */}
            <FormInput
              label="Email"
              id="email"
              name="email"
              type="email"
              value={customerDetails.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            {/* First and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="First name"
                id="firstName"
                name="firstName"
                value={customerDetails.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
              
              <FormInput
                label="Last name"
                id="lastName"
                name="lastName"
                value={customerDetails.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>

            {/* Phone */}
            <FormInput
              label="Phone"
              id="phone"
              name="phone"
              type="tel"
              value={customerDetails.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        {/* Delivery Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery details</h2>
          
          <div className="space-y-4">
            {/* Region */}
            <FormSelect
              label="Region"
              id="region"
              name="region"
              value={customerDetails.region}
              onChange={handleChange}
              required
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
              name="city"
              value={customerDetails.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />

            {/* Address */}
            <FormInput
              label="Address"
              id="address"
              name="address"
              value={customerDetails.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />

            {/* Zip/Postal Code */}
            <FormInput
              label="Zip / Postal code"
              id="zipCode"
              name="zipCode"
              value={customerDetails.zipCode}
              onChange={handleChange}
              placeholder="Enter zip code"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
            </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center ${
            loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? (
             <span className="flex items-center gap-2">
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Processing...
             </span>
          ) : (
            "Continue"
          )}
        </button>
      </form>
      
      <OrderSuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleModalClose} 
      />
    </div>
  );
}
