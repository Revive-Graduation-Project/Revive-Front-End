import React from 'react';

/**
 * CustomerDeliveryDetails Component
 * A readonly summary card for the Payment page.
 * Shows the user where the items will be shipped.
 *
 * @param {Object} props
 * @param {Object} props.customerDetails - The customer data object
 * @param {Function} props.onEdit - Handler for the edit button
 */
export default function CustomerDeliveryDetails({ customerDetails, onEdit }) {
  if (!customerDetails) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex justify-between items-start mb-2">
         <h2 className="text-xl font-bold text-gray-900">Customer & Delivery details</h2>
         <button 
           onClick={onEdit}
           className="text-green-600 font-medium hover:text-green-700 text-sm"
         >
           Edit
         </button>
      </div>
      <div className="text-gray-500 text-sm leading-relaxed">
         <p className="font-medium text-gray-800 capitalize">{customerDetails.firstName} {customerDetails.lastName}</p>
         <p>{customerDetails.email}</p>
         <p>{customerDetails.phone}</p>
         <p className="mt-1">{customerDetails.address}, {customerDetails.city}, {customerDetails.region}</p>
         <p>{customerDetails.zipCode}, Egypt</p>
      </div>
    </div>
  );
}
