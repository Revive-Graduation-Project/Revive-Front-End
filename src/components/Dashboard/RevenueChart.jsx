import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { FiTrendingUp, FiDollarSign } from "react-icons/fi";
import TimeFilter from "./shared/TimeFilter";

/* ── Clean light tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value || 0);
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 text-xs shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
        <p className="mb-1.5 font-semibold text-gray-500 text-[10px] uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.4)]" />
          <p className="my-0 text-[13px] font-bold text-[#1a1a1a]">
            {val.toLocaleString()} <span className="text-orange-500 font-semibold">EGP</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/* ── Custom active dot with glow ── */
const GlowDot = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="#F97316" fillOpacity={0.15} />
      <circle cx={cx} cy={cy} r={5} fill="#F97316" stroke="#fff" strokeWidth={2.5} />
    </g>
  );
};

function RevenueChart({ data, totalRevenue = 0, period = "This Month", onPeriodChange }) {
  const formattedTotal = `${Number(totalRevenue || 0).toLocaleString()} EGP`;
  
  /* Compute a simple trend % (compare last two data points if available) */
  const trendPct = (() => {
    if (!data || data.length < 2) return null;
    const curr = data[data.length - 1]?.revenue || 0;
    const prev = data[data.length - 2]?.revenue || 0;
    if (prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
  })();

  return (
    <div className="bg-white rounded-3xl px-6 py-6 shadow-sm border border-gray-100 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <FiDollarSign size={18} className="text-orange-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] text-gray-500 font-medium m-0 uppercase tracking-wider">Total Revenue</p>
            <div className="flex items-center gap-2.5">
              <h3 className="text-[26px] font-extrabold text-[#1a1a1a] m-0 leading-none tracking-tight">{formattedTotal}</h3>
              {trendPct !== null && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  trendPct >= 0 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "bg-red-50 text-red-600"
                }`}>
                  <FiTrendingUp size={10} className={trendPct < 0 ? "rotate-180" : ""} />
                  {Math.abs(trendPct)}%
                </div>
              )}
            </div>
          </div>
        </div>
        <TimeFilter defaultValue={period} onChange={onPeriodChange} />
      </div>

      {/* Chart */}
      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <defs>
              {/* Rich multi-stop fill gradient */}
              <linearGradient id="revenueGradientPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#F97316" stopOpacity={0.25} />
                <stop offset="50%"  stopColor="#F97316" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>

              {/* Stroke gradient for the line itself */}
              <linearGradient id="revenueStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#FDBA74" />
                <stop offset="50%"  stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>

              {/* Dot glow filter */}
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#F3F4F6" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
              dy={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(v % 1000 !== 0 ? 1 : 0)}k` : v}
              dx={-5}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "rgba(249,115,22,0.15)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            {/* Shadow layer underneath for depth */}
            <Area
              type="natural"
              dataKey="revenue"
              stroke="transparent"
              strokeWidth={0}
              fill="url(#revenueGradientPremium)"
              dot={false}
              activeDot={false}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-in-out"
            />

            {/* Main visible line with gradient stroke */}
            <Area
              type="natural"
              dataKey="revenue"
              name="Revenue"
              stroke="url(#revenueStrokeGrad)"
              strokeWidth={3}
              fill="none"
              dot={(props) => {
                const { cx, cy, index } = props;
                return (
                  <g key={`dot-${index}`}>
                    <circle cx={cx} cy={cy} r={3.5} fill="#F97316" stroke="#fff" strokeWidth={2} filter="url(#dotGlow)" />
                  </g>
                );
              }}
              activeDot={<GlowDot />}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
