import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../../store";
import { formatCurrency } from "../../utils/formatters";
import { parseTimestamp } from "../../utils/orderHelpers";
import {
  CheckCircle2,
  Printer,
  Clock,
  Calendar,
  CreditCard,
  ShoppingBag,
  Award,
  ArrowRight,
  Home,
} from "lucide-react";

export default function Thanks() {
  const navigate = useNavigate();
  const lastOrder = useOrderStore((state) => state.lastOrder);

  useEffect(() => {
    if (!lastOrder) {
      navigate("/");
    }
  }, [lastOrder, navigate]);

  if (!lastOrder) return null;

  const {
    items = [],
    totalAmount = 0,
    deliveryFee = 0,
    finalTotal = 0,
    discount = 0,
    id = "N/A",
    createdAt,
    date,
    paymentMethod,
    status = "CONFIRMED",
  } = lastOrder;

  // Formatting date and time
  const timestamp = createdAt || date || new Date();
  const dateObj = parseTimestamp(timestamp) || new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const paymentLabel =
    paymentMethod === "CREDIT_CARD" || paymentMethod === "credit_card"
      ? "Credit Card"
      : "Cash on Delivery";

  const pointsEarned = lastOrder.pointsEarned ?? Math.floor(finalTotal / 5);

  const handleTrackOrder = () => {
    navigate("/profile/orders?tab=tracking");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-36 md:pt-44 pb-16 print:bg-white print:pt-0 print:pb-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── SCREEN VIEW: MODERN SUCCESS HERO ── */}
        <div className="print:hidden text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4 shadow-sm animate-bounce">
            <CheckCircle2 className="w-11 h-11" />
          </div>

          <div className="inline-block px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Order Confirmed
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-base text-gray-600 max-w-xl mx-auto">
            We&apos;ve received your order and our kitchen is preparing your fresh, healthy meal right away.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-xs text-sm font-semibold text-gray-800">
            <span>Order Number:</span>
            <span className="text-orange-600 font-bold">#{id}</span>
          </div>
        </div>

        {/* ── ACTION BUTTONS TOP BAR (SCREEN ONLY) ── */}
        <div className="print:hidden flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={handleTrackOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <span>Track Your Order</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrintReceipt}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold text-base shadow-xs transition-all duration-200 cursor-pointer"
          >
            <Printer className="w-5 h-5 text-gray-500" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* ── SCREEN CONTENT GRID ── */}
        <div className="print:hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: ORDER ITEMS LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-7">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Ordered Items
                  </h2>
                </div>
                <span className="text-sm font-semibold text-gray-500">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="py-4 first:pt-0 last:pb-0 flex items-start gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-orange-50 shrink-0 border border-gray-100">
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          {item.calories && (
                            <span className="inline-block mt-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                              {item.calories} kcal
                            </span>
                          )}
                        </div>
                        <span className="text-base font-bold text-gray-900 shrink-0">
                          {formatCurrency(item.price * (item.quantity || 1))}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>Unit: {formatCurrency(item.price)}</span>
                        <span className="font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">
                          Qty: {item.quantity || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & TOTALS */}
          <div className="space-y-6">
            
            {/* Order Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
              <h3 className="text-base font-bold text-gray-900 pb-4 mb-4 border-b border-gray-100">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> Date
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formattedDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" /> Time
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formattedTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" /> Payment
                  </span>
                  <span className="font-semibold text-gray-900">
                    {paymentLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Est. Prep Time</span>
                  <span className="font-semibold text-orange-600">
                    15 - 25 mins
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* Totals & Loyalty Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
              <h3 className="text-base font-bold text-gray-900 pb-4 mb-4 border-b border-gray-100">
                Payment Breakdown
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Delivery</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 my-2 flex justify-between items-center text-lg">
                  <span className="font-extrabold text-gray-900">Total</span>
                  <span className="font-extrabold text-orange-600">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {pointsEarned > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between bg-orange-50/70 rounded-xl p-3.5 border border-orange-100">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-orange-600" />
                    <div>
                      <span className="block text-xs font-bold text-orange-900 uppercase tracking-wider">
                        Loyalty Rewards
                      </span>
                      <span className="text-xs text-orange-700">
                        Added to your account
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-orange-700">
                    +{pointsEarned} Pts
                  </span>
                </div>
              )}
            </div>

            {/* Back to Home Link */}
            <div className="text-center pt-2">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── PRINT-ONLY RECEIPT LAYOUT ── */}
        <div className="hidden print:block text-black bg-white">
          <div className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold tracking-tight">REVIVE</h1>
            <p className="text-sm">Order Receipt & Confirmation</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p>
                <strong>Order ID:</strong> #{id}
              </p>
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>
              <p>
                <strong>Time:</strong> {formattedTime}
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>Status:</strong> {status}
              </p>
              <p>
                <strong>Payment Method:</strong> {paymentLabel}
              </p>
            </div>
          </div>

          <div className="border-t border-b border-black py-4 mb-6">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2 font-medium">{item.name}</td>
                    <td className="py-2 text-center">{item.quantity || 1}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {formatCurrency(item.price * (item.quantity || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-xs ml-auto text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes & Delivery:</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-black pt-2 mt-2">
              <span>Grand Total:</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs">
            <p>Thank you for choosing Revive!</p>
          </div>
        </div>

      </div>
    </div>
  );
}
