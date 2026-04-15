

/**
 * CustomerInfoSummary Component
 * 
 * A high-level overview of the final order status, typically displayed 
 * on success pages. Uses a responsive 3-column grid to show Delivery, 
 * Billing, and Payment Method summaries side-by-side.
 */
export default function CustomerInfoSummary({ customerDetails, paymentMethod, cardDetails }) {
  if (!customerDetails) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-8 text-left bg-white grid grid-cols-1 md:grid-cols-3 gap-8">
       {/* Delivery Address */}
       <div>
          <h4 className="text-sm text-gray-500 mb-4">Delivery address</h4>
          <div className="text-gray-900 text-sm space-y-1">
             <p className="font-medium capitalize">{customerDetails.firstName} {customerDetails.lastName}</p>
             <p>{customerDetails.address}</p>
             <p>{customerDetails.city}, {customerDetails.region}</p>
             <p>{customerDetails.zipCode}</p>
             <p className="mt-2">{customerDetails.phone}</p>
          </div>
       </div>

       {/* Billing Address */}
       <div>
          <h4 className="text-sm text-gray-500 mb-4">Billing address</h4>
          <div className="text-gray-900 text-sm space-y-1">
             <p className="font-medium capitalize">{customerDetails.firstName} {customerDetails.lastName}</p>
             <p>{customerDetails.address}</p>
             <p>{customerDetails.city}, {customerDetails.region}</p>
             <p>{customerDetails.zipCode}</p>
             <p className="mt-2">{customerDetails.phone}</p>
          </div>
       </div>

       {/* Payment Method */}
       <div>
          <h4 className="text-sm text-gray-500 mb-4">Payment method</h4>
          <div className="text-gray-900 text-sm">
             <p>{paymentMethod === 'credit_card' ? 'Credit Card' : 'Cash on Delivery'}</p>
             {cardDetails && (
                <p className="text-xs text-gray-500 mt-1">{cardDetails.cardNumber}</p>
             )}
          </div>
       </div>
    </div>
  );
}
