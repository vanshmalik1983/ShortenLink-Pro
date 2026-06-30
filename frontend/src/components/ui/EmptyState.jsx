const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mb-4">
      {icon}
    </div>
    <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
    {action}
  </div>
)

export default EmptyState
