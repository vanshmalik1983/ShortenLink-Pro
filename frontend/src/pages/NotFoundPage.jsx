import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import { Icon } from '@/components/ui/Icon'

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
    <Logo className="mb-12" />
    <div className="relative mb-6">
      <span className="text-[120px] sm:text-[160px] font-extrabold text-indigo-50 leading-none select-none">404</span>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-card-hover">
          <Icon.Link width="28" height="28" />
        </div>
      </div>
    </div>
    <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
    <p className="mt-2 text-slate-500 max-w-sm">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link to="/" className="btn-primary mt-8">
      <Icon.Home /> Back to home
    </Link>
  </div>
)

export default NotFoundPage
