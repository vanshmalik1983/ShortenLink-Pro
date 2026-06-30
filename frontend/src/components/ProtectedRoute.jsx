import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  </div>
)

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <FullPageLoader />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

export default FullPageLoader
