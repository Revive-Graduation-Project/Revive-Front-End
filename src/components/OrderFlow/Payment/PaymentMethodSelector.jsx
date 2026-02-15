const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod, savedCard, onAddCard, onEditCard }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      
      {/* Cash on Delivery Option */}
      <div 
        onClick={() => setPaymentMethod("cash")}
        className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
          paymentMethod === "cash" ? "bg-orange-50/50" : ""
        }`}
      >
        <div className="w-10 h-10 flex items-center justify-center text-gray-600">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
           </svg>
        </div>
        <span className="font-medium text-gray-800">Cash on delivery</span>
        {paymentMethod === "cash" && (
          <div className="ml-auto text-orange-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
        )}
      </div>

      {/* Credit Card Option */}
      <div 
        onClick={() => {
            setPaymentMethod("credit_card");
            if (!savedCard) onAddCard();
        }}
        className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
          paymentMethod === "credit_card" ? "bg-orange-50/50" : ""
        }`}
      >
         <div className="w-10 h-10 flex items-center justify-center text-gray-600">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
           </svg>
         </div>
         
         <div className="flex-1">
            <span className="font-medium text-gray-800 block">Credit card</span>
            {savedCard && (
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-mono">
                         {savedCard.cardNumber}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditCard();
                        }}
                        className="cursor-pointer text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-medium  hover:underline"
                    >
                        Change
                    </button>
                </div>
            )}
         </div>

         {paymentMethod === "credit_card" && (
          <div className="ml-auto text-orange-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
        )}
      </div>

    </div>
  );
};

export default PaymentMethodSelector;
