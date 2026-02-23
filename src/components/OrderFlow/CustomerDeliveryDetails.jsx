import { DEFAULT_COUNTRY } from '../../constants';

/**
 * CustomerDeliveryDetails Component
 * 
 * A compact, readonly summary card used on the Payment page to remind 
 * the user of their shipping destination and contact info before purchasing.
 */
export default function CustomerDeliveryDetails({ customerDetails, onEdit }) {
  if (!customerDetails) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex justify-between items-start mb-2">
         <h2 className="text-xl font-bold text-gray-900">Customer & Delivery details</h2>
         <button 
           onClick={onEdit}
           className="text-green-600 font-medium hover:text-green-700 text-sm cursor-pointer"
         >
           Edit
         </button>
      </div>
      <div className="text-gray-500 text-sm leading-relaxed">
         <p className="font-medium text-gray-800 capitalize">{customerDetails.firstName} {customerDetails.lastName}</p>
         <p>{customerDetails.email}</p>
         <p>{customerDetails.phone}</p>
         <p className="mt-1">{customerDetails.address}, {customerDetails.city}, {customerDetails.region}</p>
         <p>{customerDetails.zipCode}, {DEFAULT_COUNTRY}</p>
      </div>
    </div>
  );
}
