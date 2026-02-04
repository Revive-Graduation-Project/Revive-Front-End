import { DEFAULT_COUNTRY } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

/**
 * OrderConfirmationDetails Component
 * 
 * A specialized receiver-style display for the "Thank You" page.
 * Renders a list of purchased items with individual prices, followed by 
 * a detailed breakdown of subtotal, delivery, and grand total.
 */
export default function OrderConfirmationDetails({ items, totalAmount, deliveryFee, finalTotal }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-8 text-left bg-white">
      {/* Items List */}
      <div className="space-y-6 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            {/* Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-100 shrink-0">
              <img 
                src={item.imageUrl || item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-800 font-medium text-lg">{item.name}</h3>
                <p className="text-gray-400 font-medium title-font">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex justify-between md:justify-end gap-12 items-start">
                 <span className="text-gray-800 font-medium">Qty:{item.quantity}</span>
                 <span className="text-gray-800 font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 my-6"></div>

      {/* Totals */}
      <div className="space-y-3 md:w-1/2 md:ml-auto">
        <div className="flex justify-between text-gray-600">
           <span>Subtotal</span>
           <span className="font-medium text-gray-900">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
           <span>Delivery</span>
           <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
        </div>
        
        <div className="border-t border-gray-100 my-3"></div>
        
        <div className="flex justify-between items-center text-xl">
           <span className="font-bold text-gray-900">Total</span>
           <span className="font-bold text-gray-900">{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}
