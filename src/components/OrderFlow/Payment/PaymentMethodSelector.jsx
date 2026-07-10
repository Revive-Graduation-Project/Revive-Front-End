import { FiDollarSign, FiCreditCard, FiCheck } from "react-icons/fi";

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      
      {/* Cash on Delivery Option */}
      <button 
        type="button"
        onClick={() => setPaymentMethod("CASH")}
        className={`w-full text-left flex items-center gap-4 p-5 transition-all border-b border-gray-100 cursor-pointer ${
          paymentMethod === "CASH" 
            ? "bg-orange-50/40" 
            : "hover:bg-gray-50/80"
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          paymentMethod === "CASH" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
        }`}>
          <FiDollarSign className="w-5 h-5" />
        </div>
        <div>
          <span className="font-semibold text-gray-800 block text-sm">Cash on delivery</span>
          <span className="text-xs text-gray-400 mt-0.5">Pay with cash upon arrival</span>
        </div>
        {paymentMethod === "CASH" && (
          <div className="ml-auto text-orange-500 bg-orange-100/50 p-1 rounded-full">
            <FiCheck className="w-4 h-4 stroke-[3]" />
          </div>
        )}
      </button>

      {/* Credit Card Option */}
      <button 
        type="button"
        onClick={() => setPaymentMethod("CREDIT_CARD")} // Removed onAddCard() from here!
        className={`w-full text-left flex items-center gap-4 p-5 transition-all cursor-pointer ${
          paymentMethod === "CREDIT_CARD" 
            ? "bg-orange-50/40" 
            : "hover:bg-gray-50/80"
        }`}
      >
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          paymentMethod === "CREDIT_CARD" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
         }`}>
           <FiCreditCard className="w-5 h-5" />
         </div>
         
         <div className="flex-1">
            <span className="font-semibold text-gray-800 block text-sm">Credit card</span>
            <span className="text-xs text-gray-400 mt-0.5">Secure payment via Stripe</span>
         </div>

         {paymentMethod === "CREDIT_CARD" && (
          <div className="ml-auto text-orange-500 bg-orange-100/50 p-1 rounded-full">
            <FiCheck className="w-4 h-4 stroke-[3]" />
          </div>
        )}
      </button>

    </div>
  );
};

export default PaymentMethodSelector;