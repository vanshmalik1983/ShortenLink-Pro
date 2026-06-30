const periods = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
]

const PeriodSelector = ({ value, onChange }) => (
  <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
    {periods.map((p) => (
      <button
        key={p.value}
        onClick={() => onChange(p.value)}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${value === p.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        {p.label}
      </button>
    ))}
  </div>
)

export default PeriodSelector
