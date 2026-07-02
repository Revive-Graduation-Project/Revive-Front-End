/**
 * MetricRingCard
 * ─────────────────────────────────────────
 * Reusable SVG ring + value card for dashboard metric headers.
 * Replaces the duplicate CircleMetric components in IngredientsView
 * and ChefMenuView.
 *
 * Props:
 *  label      {string}  - Card title / category name
 *  value      {number}  - Primary large number to display
 *  pct        {number}  - Fill percentage for the ring (0–100)
 *  change     {number}  - % change; shown with up/down arrow
 *  badge      {boolean} - Red "alert" variant (e.g. out-of-stock)
 *  size       {'sm'|'lg'} - 'sm' = compact (Ingredients page), 'lg' = wide (Chef Menu page)
 */
export default function MetricRingCard({ label, value, pct, change = 0, badge = false, size = "sm" }) {
  const isLg = size === "lg";

  // Ring geometry
  const r    = isLg ? 30 : 20;
  const sz   = isLg ? 76 : 50;
  const cx   = sz / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;

  // Color scheme
  const ringColor  = badge ? "#EF4444" : "#22C55E";
  const valueColor = badge ? "#EF4444" : (isLg ? "#F97316" : "#F97316");

  // ── Compact (sm) layout — ring left, text right ──
  if (!isLg) {
    return (
      <div
        className={`bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-2 ${
          badge ? "border border-red-500" : ""
        }`}
      >
        {/* Ring */}
        <div
          className="relative flex items-center justify-center shrink-0"
          style={{ width: sz, height: sz }}
        >
          <svg
            width={sz}
            height={sz}
            style={{ transform: "rotate(-90deg)" }}
            className="absolute inset-0"
          >
            <circle cx={cx} cy={cx} r={r} fill="none" stroke="#F3F4F6" strokeWidth="4" />
            <circle
              cx={cx} cy={cx} r={r}
              fill="none"
              stroke={ringColor}
              strokeWidth="4"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[9px] font-bold z-10 text-[#1a1a1a]">{pct}%</span>
        </div>

        {/* Text */}
        <div className="flex flex-col items-end">
          <p className="text-[12px] text-[#1a1a1a] font-medium m-0">{label}</p>
          <p className="text-[22px] font-bold m-0 leading-tight" style={{ color: valueColor }}>
            {value}
          </p>
          <p className="text-[9px] m-0 font-bold flex items-center gap-0.5" style={{ color: valueColor }}>
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(2)}%
          </p>
        </div>
      </div>
    );
  }

  // ── Large (lg) layout — ring left, text right, wider card ──
  return (
    <div className="bg-white rounded-3xl px-5 py-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200 min-w-[160px]">
      {/* Ring */}
      <div className="relative shrink-0" style={{ width: sz, height: sz }}>
        <svg
          width={sz}
          height={sz}
          style={{ transform: "rotate(-90deg)" }}
          className="absolute inset-0"
        >
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={ringColor}
            strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-extrabold leading-none text-green-600">{pct}%</span>
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-[13px] font-semibold text-[#1a1a1a] m-0 whitespace-nowrap">{label}</p>
        <p className="text-[24px] font-extrabold m-0 leading-none" style={{ color: valueColor }}>
          {value}
        </p>
        {change !== undefined && (
          <p className={`text-[10px] m-0 mt-1 font-medium ${change >= 0 ? "text-green-500" : "text-red-400"}`}>
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}
