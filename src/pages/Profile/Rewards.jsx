import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLoyaltyStore } from "../../store";

const Rewards = () => {
  const points = useLoyaltyStore((s) => s.points);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "#2e7d32" }}>
          Rewards
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Check out all of the rewards that are available to you
        </p>
        <hr className="mt-4 border-gray-200" />
      </div>

      {/* Points Card */}
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-blue-400"
        style={{ minHeight: "180px" }}
      >
        {/* Confetti background */}
        <div className="absolute inset-0" aria-hidden="true">
          <ConfettiBg />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full py-10 gap-1">
          <span className="text-5xl font-black text-gray-900">{points}</span>
          <span className="text-base text-gray-700 font-medium">
            Total point earned
          </span>
        </div>
      </div>

      {/* Reward policy */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-800 tracking-tight relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-12 after:rounded-full after:bg-orange">
          Reward Policy
        </h3>

        {/* How to earn */}
        <div className="bg-amber-50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm shrink-0"
              style={{ backgroundColor: "#2e7d32" }}
            >
              +
            </span>
            <h3 className="text-sm font-bold text-gray-800">
              How to earn points
            </h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed pl-9">
            For every <span className="font-semibold text-gray-700">5 EGP</span>{" "}
            spent on an order, you earn{" "}
            <span className="font-semibold text-gray-700">1 point</span>.
          </p>
        </div>

        {/* How to use */}
        <div className="bg-amber-50 rounded-xl px-4 py-3">
          {/* header — stacks on mobile, side by side on sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                style={{ backgroundColor: "#2e7d32" }}
              >
                %
              </span>
              <h3 className="text-sm font-bold text-gray-800">
                How to use points
              </h3>
            </div>
            <div className="hidden md:flex items-center gap-2 pl-9">
              <FaCheckCircle className="text-orange text-base shrink-0" />
              <span className="text-sm font-semibold text-gray-800">
                Order Discount
              </span>
            </div>
          </div>

          {/* tiers */}
          <div className="pl-0 sm:pl-7 space-y-2">
            {[
              { pts: 100, discount: "10%", note: "minimum" },
              { pts: 200, discount: "20%", note: null },
              { pts: 300, discount: "30%", note: "maximum" },
            ].map(({ pts, discount, note }) => (
              <div
                key={pts}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">
                    {pts} pts
                  </span>
                  {note && (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          note === "minimum" ? "#e8f5e9" : "#fff3e0",
                        color: note === "minimum" ? "#2e7d32" : "#e65100",
                      }}
                    >
                      {note}
                    </span>
                  )}
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#2e7d32" }}
                >
                  {discount} voucher
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-1">
              Points are only earned when ordering without using vouchers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* SVG confetti background — purely decorative */
const ConfettiBg = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 600 200"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* ribbons and confetti shapes scattered across the card */}
    <rect
      x="30"
      y="10"
      width="8"
      height="30"
      rx="3"
      fill="#f59e0b"
      transform="rotate(20 30 10)"
      opacity="0.85"
    />
    <rect
      x="80"
      y="30"
      width="6"
      height="25"
      rx="3"
      fill="#ef4444"
      transform="rotate(-15 80 30)"
      opacity="0.8"
    />
    <rect
      x="140"
      y="5"
      width="7"
      height="28"
      rx="3"
      fill="#8b5cf6"
      transform="rotate(30 140 5)"
      opacity="0.85"
    />
    <rect
      x="200"
      y="20"
      width="5"
      height="22"
      rx="2"
      fill="#10b981"
      transform="rotate(-25 200 20)"
      opacity="0.8"
    />
    <rect
      x="260"
      y="8"
      width="8"
      height="30"
      rx="3"
      fill="#f59e0b"
      transform="rotate(10 260 8)"
      opacity="0.75"
    />
    <rect
      x="320"
      y="15"
      width="6"
      height="26"
      rx="3"
      fill="#3b82f6"
      transform="rotate(-35 320 15)"
      opacity="0.8"
    />
    <rect
      x="380"
      y="5"
      width="7"
      height="30"
      rx="3"
      fill="#ec4899"
      transform="rotate(22 380 5)"
      opacity="0.85"
    />
    <rect
      x="440"
      y="25"
      width="5"
      height="22"
      rx="2"
      fill="#f59e0b"
      transform="rotate(-18 440 25)"
      opacity="0.8"
    />
    <rect
      x="500"
      y="10"
      width="8"
      height="28"
      rx="3"
      fill="#8b5cf6"
      transform="rotate(28 500 10)"
      opacity="0.75"
    />
    <rect
      x="555"
      y="30"
      width="6"
      height="24"
      rx="3"
      fill="#10b981"
      transform="rotate(-12 555 30)"
      opacity="0.8"
    />

    <rect
      x="50"
      y="130"
      width="7"
      height="28"
      rx="3"
      fill="#3b82f6"
      transform="rotate(-20 50 130)"
      opacity="0.8"
    />
    <rect
      x="110"
      y="150"
      width="5"
      height="22"
      rx="2"
      fill="#ec4899"
      transform="rotate(15 110 150)"
      opacity="0.75"
    />
    <rect
      x="170"
      y="140"
      width="8"
      height="30"
      rx="3"
      fill="#f59e0b"
      transform="rotate(-30 170 140)"
      opacity="0.85"
    />
    <rect
      x="230"
      y="155"
      width="6"
      height="25"
      rx="3"
      fill="#8b5cf6"
      transform="rotate(20 230 155)"
      opacity="0.8"
    />
    <rect
      x="290"
      y="145"
      width="7"
      height="27"
      rx="3"
      fill="#ef4444"
      transform="rotate(-22 290 145)"
      opacity="0.75"
    />
    <rect
      x="350"
      y="160"
      width="5"
      height="20"
      rx="2"
      fill="#10b981"
      transform="rotate(18 350 160)"
      opacity="0.8"
    />
    <rect
      x="410"
      y="135"
      width="8"
      height="28"
      rx="3"
      fill="#3b82f6"
      transform="rotate(-28 410 135)"
      opacity="0.85"
    />
    <rect
      x="470"
      y="150"
      width="6"
      height="26"
      rx="3"
      fill="#f59e0b"
      transform="rotate(12 470 150)"
      opacity="0.8"
    />
    <rect
      x="530"
      y="140"
      width="7"
      height="30"
      rx="3"
      fill="#ec4899"
      transform="rotate(-15 530 140)"
      opacity="0.75"
    />

    {/* small square confetti */}
    <rect
      x="60"
      y="70"
      width="8"
      height="8"
      rx="1"
      fill="#ef4444"
      transform="rotate(45 60 70)"
      opacity="0.7"
    />
    <rect
      x="120"
      y="90"
      width="7"
      height="7"
      rx="1"
      fill="#8b5cf6"
      transform="rotate(30 120 90)"
      opacity="0.75"
    />
    <rect
      x="180"
      y="65"
      width="9"
      height="9"
      rx="1"
      fill="#10b981"
      transform="rotate(20 180 65)"
      opacity="0.7"
    />
    <rect
      x="250"
      y="85"
      width="8"
      height="8"
      rx="1"
      fill="#3b82f6"
      transform="rotate(-40 250 85)"
      opacity="0.75"
    />
    <rect
      x="310"
      y="60"
      width="7"
      height="7"
      rx="1"
      fill="#f59e0b"
      transform="rotate(35 310 60)"
      opacity="0.7"
    />
    <rect
      x="370"
      y="90"
      width="9"
      height="9"
      rx="1"
      fill="#ec4899"
      transform="rotate(-25 370 90)"
      opacity="0.75"
    />
    <rect
      x="430"
      y="70"
      width="8"
      height="8"
      rx="1"
      fill="#8b5cf6"
      transform="rotate(15 430 70)"
      opacity="0.7"
    />
    <rect
      x="490"
      y="85"
      width="7"
      height="7"
      rx="1"
      fill="#ef4444"
      transform="rotate(-35 490 85)"
      opacity="0.75"
    />
    <rect
      x="550"
      y="65"
      width="9"
      height="9"
      rx="1"
      fill="#10b981"
      transform="rotate(25 550 65)"
      opacity="0.7"
    />

    {/* curly ribbon paths */}
    <path
      d="M20 60 Q40 40 60 60 Q80 80 100 60"
      stroke="#f59e0b"
      strokeWidth="3"
      fill="none"
      opacity="0.7"
      strokeLinecap="round"
    />
    <path
      d="M150 100 Q170 75 195 100 Q215 120 240 95"
      stroke="#8b5cf6"
      strokeWidth="3"
      fill="none"
      opacity="0.7"
      strokeLinecap="round"
    />
    <path
      d="M280 55 Q305 35 330 55 Q350 75 375 50"
      stroke="#ec4899"
      strokeWidth="3"
      fill="none"
      opacity="0.65"
      strokeLinecap="round"
    />
    <path
      d="M400 110 Q425 85 450 110 Q470 130 500 105"
      stroke="#3b82f6"
      strokeWidth="3"
      fill="none"
      opacity="0.7"
      strokeLinecap="round"
    />
    <path
      d="M510 60 Q535 40 560 60 Q580 80 600 55"
      stroke="#10b981"
      strokeWidth="3"
      fill="none"
      opacity="0.65"
      strokeLinecap="round"
    />
  </svg>
);

export default Rewards;
