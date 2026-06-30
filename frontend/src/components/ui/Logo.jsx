import { Link } from 'react-router-dom'

const Logo = ({ className = '', showText = true, to = '/' }) => (
  <Link to={to} className={`flex items-center gap-2 group ${className}`}>
    <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-sm group-hover:shadow-md transition-shadow">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </div>
    {showText && (
      <span className="font-bold text-lg text-slate-800 tracking-tight">
        ShortLink<span className="text-indigo-600">Pro</span>
      </span>
    )}
  </Link>
)

export default Logo
