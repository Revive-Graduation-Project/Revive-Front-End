import { useProfileStore } from "../../store";
import { useOrderStore } from "../../store";
import { FiCheck, FiLock } from "react-icons/fi"; // Added FiLock for locked states

/**
 * VoucherSelection Component
 * * Displays available discount vouchers based on user's loyalty points balance.
 * Includes visual treatment for locked and unlocked rewards.
 */
export default function VoucherSelection() {
  const points = useProfileStore((state) => state.user?.loyaltyPoints ?? 0);
  const selectedDiscount = useOrderStore((state) => state.selectedDiscount);
  const pointsToRedeem = useOrderStore((state) => state.pointsToRedeem);
  const setDiscount = useOrderStore((state) => state.setDiscount);
  const clearDiscount = useOrderStore((state) => state.clearDiscount);

  const vouchers = [
    { discount: 10, pointsRequired: 100, label: "10% OFF YOUR ORDER" },
    { discount: 20, pointsRequired: 200, label: "20% OFF YOUR ORDER" },
    { discount: 30, pointsRequired: 300, label: "30% OFF YOUR ORDER" },
  ];

  const handleSelectVoucher = (discount, pointsRequired) => {
    if (points < pointsRequired) return; // Guard clause for locked vouchers
    if (selectedDiscount === discount) {
      clearDiscount();
    } else {
      setDiscount(discount, pointsRequired);
    }
  };

  // If they haven't earned even the lowest reward yet, keep it minimal or hidden 
  if (points < 100) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm md:text-base font-bold text-gray-900 tracking-tight">Available Discounts</h3>
          <p className="text-xs text-gray-500 mt-0.5">Redeem your hard-earned points for rewards</p>
        </div>
        <div className="bg-orange-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-orange-100/60 inline-flex flex-col items-center justify-center">
          <p className="text-[10px] md:text-[11px] font-medium text-orange-600 uppercase tracking-wider text-center leading-tight">Your Balance</p>
          <p className="text-xs md:text-sm font-bold text-orange-600 text-center leading-tight">{points} pts</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {vouchers.map((voucher) => {
          const isSelected = selectedDiscount === voucher.discount;
          const isLocked = points < voucher.pointsRequired;
          
          return (
            <button
              key={voucher.discount}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelectVoucher(voucher.discount, voucher.pointsRequired)}
              className={`w-full p-3 md:p-4 rounded-xl border transition-all duration-200 text-left flex items-center justify-between relative overflow-hidden ${
                isLocked
                  ? "border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "border-orange-500 bg-linear-to-r from-orange-50/70 to-orange-50/20 shadow-sm ring-1 ring-orange-500/20"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm cursor-pointer"
              }`}
            >
              {/* Aesthetic Ticket Notch Design */}
              {!isLocked && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-r-full border-y border-r ${isSelected ? 'border-orange-300 bg-white' : 'border-gray-200 bg-gray-50'}`} />
              )}

              <div className="flex items-center gap-3 md:gap-4 pl-2">
                {/* Status Indicator (Check, Circle, or Lock) */}
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isLocked 
                      ? "border-gray-200 bg-gray-100 text-gray-400"
                      : isSelected 
                      ? "border-orange-500 bg-orange-500 text-white" 
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isLocked ? (
                    <FiLock className="text-[8px] md:text-[10px]" />
                  ) : isSelected ? (
                    <FiCheck className="text-[10px] md:text-xs stroke-3" />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-bold tracking-wide text-xs md:text-sm ${isLocked ? "text-gray-400" : "text-gray-800"}`}>
                    {voucher.label}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
                    {isLocked ? `Requires ${voucher.pointsRequired} points` : `Redeem ${voucher.pointsRequired} points`}
                  </p>
                </div>
              </div>

              {/* End badge */}
              {isSelected && (
                <span className="text-[10px] md:text-xs font-bold text-orange-600 bg-orange-100/80 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md tracking-wide uppercase shrink-0">
                  Applied
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Success Banner */}
      {selectedDiscount > 0 && (
        <div className="mt-5 p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-medium text-emerald-800 leading-relaxed">
            Sweet! You are saving <span className="font-bold underline decoration-emerald-300 decoration-2">{selectedDiscount}%</span> on this order by burning <span className="font-bold">{pointsToRedeem}</span> points.
          </p>
        </div>
      )}
    </div>
  );
}