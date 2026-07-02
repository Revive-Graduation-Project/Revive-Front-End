/**
 * DashboardSkeleton
 * Reusable skeleton placeholders for all dashboard pages.
 * Uses the `.animate-shimmer` keyframe defined in index.css
 * with a Tailwind pseudo-element pattern.
 */

/** Base shimmer block */
function Shimmer({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

/** Metric card skeleton — matches MetricCards layout */
export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-3.5">
      <Shimmer className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-6 w-28" />
      </div>
    </div>
  );
}

/** Chart card skeleton */
export function ChartSkeleton({ height = 280 }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3" style={{ height }}>
      <div className="flex justify-between">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-4 w-20" />
      </div>
      <Shimmer className="flex-1 rounded-xl" />
    </div>
  );
}

/** Table row skeleton */
export function TableRowSkeleton({ cols = 7 }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Shimmer className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/** Kanban card skeleton */
export function KanbanCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
      <div className="flex justify-between">
        <Shimmer className="h-4 w-16" />
        <Shimmer className="h-4 w-12" />
      </div>
      <Shimmer className="h-3 w-24" />
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-3/4" />
      <Shimmer className="h-8 w-full rounded-xl mt-1" />
    </div>
  );
}

/** Full page skeleton — 3 metric cards + chart */
export function DashboardPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-8">
      <div className="grid grid-cols-3 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <ChartSkeleton height={280} />
        <ChartSkeleton height={280} />
      </div>
    </div>
  );
}

export default Shimmer;
