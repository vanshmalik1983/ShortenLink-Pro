import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '@/components/layout/AuthLayout'
import { authAPI } from '@/services/auth.service'
import { Icon } from '@/components/ui/Icon'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('verifying') // verifying | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    authAPI
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <AuthLayout title="Email verification" subtitle="">
      <div className="text-center py-4">
        {status === 'verifying' && (
          <>
            <div className="w-10 h-10 mx-auto mb-4 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Icon.Check width="24" height="24" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Email verified!</h3>
            <p className="text-sm text-slate-500 mb-6">Your account is now fully activated.</p>
            <Link to="/login" className="btn-primary w-full">Continue to login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Icon.AlertTriangle />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Verification failed</h3>
            <p className="text-sm text-slate-500 mb-6">This link is invalid or has expired.</p>
            <Link to="/login" className="btn-secondary w-full">Back to login</Link>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

export default VerifyEmailPage
