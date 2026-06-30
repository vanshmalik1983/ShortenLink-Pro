import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const DistributionChart = ({ title, data = [], xKey, yKey = 'count' }) => (
  <div className="card">
    <h3 className="text-sm font-semibold text-slate-800 mb-6">{title}</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #F1F5F9', fontSize: 13, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
          cursor={{ fill: '#F8FAFC' }}
        />
        <Bar dataKey={yKey} fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

export default DistributionChart
