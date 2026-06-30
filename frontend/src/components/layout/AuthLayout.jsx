import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen flex bg-white">
    {/* Left – form */}
    <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
      <div className="w-full max-w-sm mx-auto">
        <Logo className="mb-10" />
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-sm text-center text-slate-500">{footer}</div>}
      </div>
    </div>

    {/* Right – decorative panel */}
    <div className="hidden lg:flex flex-1 relative items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative max-w-md px-12 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Every click, accounted for.</h2>
        <p className="text-indigo-100 text-sm leading-relaxed">
          Track performance across every link with real-time analytics on clicks, devices, locations, and referral sources.
        </p>
      </div>
    </div>
  </div>
)

export default AuthLayout
