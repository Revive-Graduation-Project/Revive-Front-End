import { FiX, FiUser, FiPhone, FiMapPin, FiClock, FiShoppingBag } from "react-icons/fi";
import StatusBadge from "./StatusBadge";

export default function OrderDetailsModal({ isOpen, onClose, order, showCustomerInfo }) {
  if (!isOpen || !order) return null;

  // Handle parsing items: it might be an array of objects (orderItems), array of strings (Live Kitchen), or a comma-separated string.
  let dishesList = [];
  if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
    dishesList = order.orderItems.map(item => `${item.quantity || 1}x ${item.name || "Item"}`);
  } else if (Array.isArray(order.items)) {
    dishesList = order.items;
  } else if (typeof order.name === 'string' && order.name.includes(',')) {
    dishesList = order.name.split(',').map(d => d.trim());
  } else if (typeof order.items === 'string') {
    dishesList = order.items.split(',').map(d => d.trim());
  } else {
    dishesList = [order.name || "Custom Order"];
  }

  // Fallback data for customer details if missing
  const customerName = order.customer || "Guest";
  const customerPhone = order.phone || null;
  const customerAddress = order.address || null;

  // Parse total price safely
  const totalPrice = order.total !== undefined ? `${Number(order.total).toFixed(2)} EGP` : "Paid / N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-in relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-[18px] font-extrabold text-[#1a1a1a] flex items-center gap-2">
              Order {order.id}
            </h2>
            <p className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
              <FiClock size={12} /> {order.time}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {order.status && <StatusBadge status={order.status} />}
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 flex flex-col gap-8 overflow-y-auto">
          
          {/* Customer Info Section */}
          {showCustomerInfo && (
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5">
              <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <FiUser className="text-orange-500" /> Customer Details
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                    <FiUser size={14} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide">Name</span>
                    <span className="block text-[13px] font-semibold text-[#1a1a1a]">{customerName}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                    <FiPhone size={14} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide">Phone</span>
                    <span className={`block text-[13px] font-semibold ${customerPhone ? "text-[#1a1a1a]" : "text-gray-400 italic"}`}>
                      {customerPhone || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                    <FiMapPin size={14} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide">Delivery Address</span>
                    <span className={`block text-[13px] font-semibold ${customerAddress ? "text-[#1a1a1a]" : "text-gray-400 italic"}`}>
                      {customerAddress || "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ordered Dishes Section */}
          <div>
            <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <FiShoppingBag className="text-orange-500" /> Ordered Dishes
            </h3>
            
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-2 flex flex-col gap-1">
              {dishesList.map((dishStr, idx) => {
                // Try to parse out the quantity if it exists, e.g. "Chicken Delight x2" or "Chicken Delight (x2)"
                const match = dishStr.match(/(.+?)(?:\s*\(?x(\d+)\)?)?$/i);
                const dishName = match ? match[1].trim() : dishStr;
                const quantity = match && match[2] ? parseInt(match[2], 10) : 1;

                return (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[11px]">
                        {quantity}x
                      </div>
                      <span className="text-[13px] font-semibold text-[#1a1a1a]">{dishName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5">
              <span className="shrink-0 mt-0.5 text-[18px]">📝</span>
              <div>
                <span className="block text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">Order Note</span>
                <span className="block text-[13px] font-medium text-amber-900 leading-relaxed">{order.notes}</span>
              </div>
            </div>
          )}

          {/* Total Price */}
          <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</span>
              <span className="block text-[11px] text-gray-400 font-medium mt-0.5">Incl. delivery &amp; fees</span>
            </div>
            <span className="text-[26px] font-black text-[#38761d] leading-none">{totalPrice}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
