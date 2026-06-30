import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '@/components/layout/AuthLayout'
import { authAPI } from '@/services/auth.service'
import { Icon } from '@/components/ui/Icon'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async ({ password: newPassword }) => {
    if (!token) {
      toast.error('Invalid or missing reset token')
      return
    }
    setLoading(true)
    try {
      await authAPI.resetPassword({ token, password: newPassword })
      toast.success('Password reset! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Icon.AlertTriangle />
          </div>
          <p className="text-sm text-slate-600 mb-6">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="btn-primary w-full">Request a new link</Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password for your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={errors.password ? 'input-error' : 'input'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Must be at least 8 characters' },
                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must include uppercase, lowercase, and a number' },
              })}
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <Icon.Eye />
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={errors.confirmPassword ? 'input-error' : 'input'}
            {...register('confirmPassword', { required: 'Please confirm your password', validate: (val) => val === password || 'Passwords do not match' })}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
