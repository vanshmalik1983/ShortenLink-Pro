import { formatNumber } from '@/utils/helpers'

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  slate: 'bg-slate-100 text-slate-600',
}

const StatCard = ({ icon: StatIcon, label, value, trend, color = 'indigo' }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${colorMap[color]}`}>
        <StatIcon width="18" height="18" />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-extrabold text-slate-900">{typeof value === 'number' ? formatNumber(value) : value}</span>
      {trend !== undefined && (
        <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
)

export default StatCard
