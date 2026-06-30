import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { userAPI } from '@/services/user.service'
import { Icon } from '@/components/ui/Icon'
import { getInitials } from '@/utils/helpers'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const profileForm = useForm({ defaultValues: { name: user?.name || '' } })
  const passwordForm = useForm()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error('Image must be under 1.5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      setAvatarLoading(true)
      try {
        const { data } = await userAPI.uploadAvatar(reader.result)
        updateUser({ avatar: data.data.avatar })
        toast.success('Avatar updated')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to upload avatar')
      } finally {
        setAvatarLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const onProfileSubmit = async (formData) => {
    setProfileLoading(true)
    try {
      const { data } = await userAPI.updateProfile({ name: formData.name })
      updateUser(data.data.user)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setProfileLoading(false)
    }
  }

  const onPasswordSubmit = async (formData) => {
    setPasswordLoading(true)
    try {
      await userAPI.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword })
      toast.success('Password changed. Please log in again.')
      passwordForm.reset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your personal information and account security</p>
      </div>

      {/* Avatar + basic info */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">Profile picture</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-2xl font-bold flex items-center justify-center">
                {getInitials(user?.name)}
              </div>
            )}
            {avatarLoading && (
              <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
              <Icon.Camera /> Change photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <p className="text-xs text-slate-400 mt-2">JPG, PNG up to 1.5MB</p>
          </div>
        </div>
      </div>

      {/* Name / email */}
      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="card space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Personal information</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
          <input type="text" className="input" {...profileForm.register('name', { required: true, maxLength: 50 })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input type="email" value={user?.email || ''} disabled className="input opacity-60 cursor-not-allowed" />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
        </div>
        <button type="submit" className="btn-primary" disabled={profileLoading}>{profileLoading ? 'Saving...' : 'Save changes'}</button>
      </form>

      {/* Password */}
      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="card space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Change password</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Current password</label>
          <input type="password" className="input" {...passwordForm.register('currentPassword', { required: 'Required' })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
          <input
            type="password"
            className="input"
            {...passwordForm.register('newPassword', {
              required: 'Required',
              minLength: { value: 8, message: 'At least 8 characters' },
              pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must include uppercase, lowercase, and a number' },
            })}
          />
          {passwordForm.formState.errors.newPassword && <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
        </div>
        <button type="submit" className="btn-primary" disabled={passwordLoading}>{passwordLoading ? 'Updating...' : 'Update password'}</button>
      </form>
    </div>
  )
}

export default ProfilePage
