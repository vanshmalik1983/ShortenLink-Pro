export const SkeletonText = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`skeleton ${width} ${height} ${className}`} />
)

export const SkeletonCard = () => (
  <div className="card">
    <div className="flex items-center justify-between mb-4">
      <SkeletonText width="w-24" height="h-3" />
      <div className="skeleton w-8 h-8 rounded-lg" />
    </div>
    <SkeletonText width="w-16" height="h-8" className="mb-2" />
    <SkeletonText width="w-32" height="h-3" />
  </div>
)

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 border-b border-slate-100">
    <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonText width="w-1/3" height="h-3.5" />
      <SkeletonText width="w-2/3" height="h-3" />
    </div>
    <SkeletonText width="w-16" height="h-6" />
    <SkeletonText width="w-20" height="h-8" />
  </div>
)

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="card !p-0 overflow-hidden">
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
)

export const SkeletonChart = () => (
  <div className="card">
    <SkeletonText width="w-40" height="h-5" className="mb-6" />
    <div className="skeleton w-full h-64 rounded-xl" />
  </div>
)

export const SkeletonStatsGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)
