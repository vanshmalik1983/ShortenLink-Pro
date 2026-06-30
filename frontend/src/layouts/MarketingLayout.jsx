import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Logo from '@/components/ui/Logo'
import { Icon } from '@/components/ui/Icon'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
]

const MarketingLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary">Get Started Free</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen((p) => !p)} className="md:hidden p-2 text-slate-600">
            {mobileOpen ? <Icon.Close /> : <Icon.Menu />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-6 py-4 flex flex-col gap-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-700">
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary w-full" onClick={() => setMobileOpen(false)}>Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full" onClick={() => setMobileOpen(false)}>Log in</Link>
                  <Link to="/register" className="btn-primary w-full" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="text-sm text-slate-500 mt-3 max-w-xs">
                The modern URL shortener with powerful analytics, built for teams who care about their links.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/features" className="hover:text-indigo-600">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/login" className="hover:text-indigo-600">Log in</Link></li>
                <li><Link to="/register" className="hover:text-indigo-600">Sign up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><span className="cursor-default">About</span></li>
                <li><span className="cursor-default">Contact</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200 text-sm text-slate-400 text-center">
            © {new Date().getFullYear()} ShortLink Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MarketingLayout
