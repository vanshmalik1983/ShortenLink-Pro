const TopListCard = ({ title, items = [], labelKey = 'name', valueKey = 'count', emptyText = 'No data yet' }) => {
  const total = items.reduce((sum, i) => sum + i[valueKey], 0)

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-800 mb-5">{title}</h3>
      {items.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-sm text-slate-400">{emptyText}</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const pct = total > 0 ? Math.round((item[valueKey] / total) * 100) : 0
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600 truncate-url max-w-[70%]">{item[labelKey] || 'Unknown'}</span>
                  <span className="font-semibold text-slate-700 shrink-0">{item[valueKey]}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TopListCard
