import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

function AlertItem({ image, name }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[56px]">
      <div className="w-[44px] h-[44px] rounded-2xl bg-red-50/80 flex items-center justify-center text-[16px] font-bold text-red-600 shadow-2xs border border-red-100 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <span className="text-[11px] font-semibold text-[#1a1a1a] text-center max-w-[70px] truncate">{name}</span>
    </div>
  );
}

function InventoryAlerts({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lowStockItems = data?.lowStock || [];

  return (
    <div className="bg-white rounded-3xl px-6 py-6 shadow-sm border border-gray-100/60">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <FiAlertTriangle size={20} className="text-red-600" fill="#fee2e2" />
          <h3 className="text-[14px] font-bold text-[#1a1a1a] m-0 uppercase tracking-wider">
            INVENTORY ALERTS (LOW STOCK)
          </h3>
        </div>
        {lowStockItems.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[12px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
          >
            View All ({lowStockItems.length})
          </button>
        )}
      </div>
      {/* Threshold hint */}
      <p className="text-[11px] font-medium text-gray-400 mb-4">
        Ingredients with stock below <span className="font-bold text-red-400">100g</span> or <span className="font-bold text-red-400">100ml</span> are flagged as low stock.
      </p>

      <div className="bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-[0_2px_10px_rgba(254,226,226,0.3)] flex flex-col justify-between min-h-[100px]">
        <div className="flex gap-5 items-center overflow-x-auto py-2">
          {lowStockItems.length === 0 ? (
            <p className="text-[13px] text-gray-400 font-medium italic py-2">All ingredients are currently well stocked!</p>
          ) : (
            lowStockItems.slice(0, 8).map((item) => (
              <AlertItem
                key={item.id}
                image={item.image}
                name={item.name}
              />
            ))
          )}
          {lowStockItems.length > 8 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center justify-center h-[44px] cursor-pointer group shrink-0"
              title="See all low stock items"
            >
              <div className="w-[36px] h-[36px] rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center text-[12px] text-red-600 font-bold border border-red-200 transition-colors shadow-xs">
                +{lowStockItems.length - 8}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Modal for viewing full list of low stock ingredients */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                  <FiAlertTriangle size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-[#1a1a1a] m-0">
                  Low Stock Ingredients ({lowStockItems.length})
                </h3>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                  Below <span className="font-bold text-red-400">100g</span> or <span className="font-bold text-red-400">100ml</span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm font-medium">No low stock ingredients found.</p>
              ) : (
                lowStockItems.map((item) => {
                  const initial = item.name ? item.name.charAt(0).toUpperCase() : "?";
                  const isZero = String(item.stock).startsWith("0");
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3.5 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-200/60 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center text-[18px] font-bold text-red-600 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            initial
                          )}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-gray-900 m-0">{item.name}</h4>
                          {item.stock && (
                            <span className="text-[12px] font-semibold text-gray-500">Stock: {item.stock}</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${isZero ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                        {isZero ? "Out of Stock" : "Low Stock"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryAlerts;
