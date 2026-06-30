import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-card-hover border border-slate-100 px-3 py-2">
      <p className="text-xs text-slate-400 mb-0.5">{format(parseISO(label), 'MMM d, yyyy')}</p>
      <p className="text-sm font-semibold text-slate-800">{payload[0].value} clicks</p>
    </div>
  )
}

const ClickTimelineChart = ({ data = [] }) => (
  <div className="card">
    <h3 className="text-sm font-semibold text-slate-800 mb-6">Click Timeline</h3>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'MMM d')}
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="clicks" stroke="#6366F1" strokeWidth={2} fill="url(#colorClicks)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default ClickTimelineChart
