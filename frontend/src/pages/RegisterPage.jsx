import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '@/components/layout/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { Icon } from '@/components/ui/Icon'

const RegisterPage = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      await registerUser(formData)
      toast.success('Account created! Check your email to verify.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start shortening links in seconds — free forever"
      footer={<>Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            className={errors.name ? 'input-error' : 'input'}
            {...register('name', { required: 'Name is required', maxLength: { value: 50, message: 'Name is too long' } })}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
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
          <p className="text-xs text-slate-400 mt-1.5">At least 8 characters with uppercase, lowercase, and a number</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={errors.confirmPassword ? 'input-error' : 'input'}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-xs text-center text-slate-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
