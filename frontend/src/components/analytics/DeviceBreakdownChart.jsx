import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Icon } from '@/components/ui/Icon'

const COLORS = { desktop: '#6366F1', mobile: '#10B981', tablet: '#F59E0B', unknown: '#94A3B8' }
const ICONS = { desktop: Icon.Monitor, mobile: Icon.Smartphone, tablet: Icon.Tablet, unknown: Icon.Globe }

const DeviceBreakdownChart = ({ data = [] }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const chartData = data.map((d) => ({ name: d.type, value: d.count }))

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-800 mb-6">Device Breakdown</h3>
      {total === 0 ? (
        <div className="h-52 flex items-center justify-center text-sm text-slate-400">No data yet</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[entry.name] || COLORS.unknown} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} clicks`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {data.map((d) => {
              const ItemIcon = ICONS[d.type] || Icon.Globe
              const pct = total > 0 ? Math.round((d.count / total) * 100) : 0
              return (
                <div key={d.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600 capitalize">
                    <ItemIcon style={{ color: COLORS[d.type] || COLORS.unknown }} />
                    {d.type}
                  </div>
                  <span className="font-medium text-slate-700">{pct}%</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default DeviceBreakdownChart
