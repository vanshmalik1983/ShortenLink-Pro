import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '@/components/layout/AuthLayout'
import { authAPI } from '@/services/auth.service'
import { Icon } from '@/components/ui/Icon'

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors }, getValues } = useForm()

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <Icon.Mail width="24" height="24" />
          </div>
          <p className="text-sm text-slate-600 mb-1">We've sent a password reset link to</p>
          <p className="text-sm font-semibold text-slate-800 mb-6">{getValues('email')}</p>
          <p className="text-xs text-slate-400">Didn't receive it? Check your spam folder or try again in a few minutes.</p>
          <Link to="/login" className="btn-secondary w-full mt-6">Back to login</Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={<>Remember your password? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={errors.email ? 'input-error' : 'input'}
            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' } })}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
