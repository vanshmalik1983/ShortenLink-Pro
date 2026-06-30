import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { userAPI } from '@/services/user.service'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Modal from '@/components/ui/Modal'
import { Icon } from '@/components/ui/Icon'

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [prefsLoading, setPrefsLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      marketing: user?.emailPreferences?.marketing ?? false,
      weeklyReport: user?.emailPreferences?.weeklyReport ?? true,
      securityAlerts: user?.emailPreferences?.securityAlerts ?? true,
    },
  })

  const deleteForm = useForm()

  const onPrefsSubmit = async (formData) => {
    setPrefsLoading(true)
    try {
      const { data } = await userAPI.updateProfile({ emailPreferences: formData })
      updateUser(data.data.user)
      toast.success('Email preferences saved')
    } catch (err) {
      toast.error('Failed to save preferences')
    } finally {
      setPrefsLoading(false)
    }
  }

  const onDeleteAccount = async (formData) => {
    try {
      await userAPI.deleteAccount(formData.password)
      toast.success('Account deleted')
      await logout()
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect password')
      throw err
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your preferences and account</p>
      </div>

      <form onSubmit={handleSubmit(onPrefsSubmit)} className="card space-y-5">
        <h3 className="text-sm font-semibold text-slate-800">Email preferences</h3>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-700">Weekly performance report</p>
            <p className="text-xs text-slate-400">Get a summary of your link performance every week</p>
          </div>
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" {...register('weeklyReport')} />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-700">Security alerts</p>
            <p className="text-xs text-slate-400">Get notified about new logins and security events</p>
          </div>
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" {...register('securityAlerts')} />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-700">Marketing emails</p>
            <p className="text-xs text-slate-400">Product updates, tips, and offers</p>
          </div>
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" {...register('marketing')} />
        </label>

        <button type="submit" className="btn-primary" disabled={prefsLoading}>{prefsLoading ? 'Saving...' : 'Save preferences'}</button>
      </form>

      <div className="card border-red-100">
        <h3 className="text-sm font-semibold text-red-600 mb-1">Danger zone</h3>
        <p className="text-xs text-slate-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button onClick={() => setDeleteModalOpen(true)} className="btn-danger">
          <Icon.Trash /> Delete account
        </button>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete account" maxWidth="max-w-sm">
        <form onSubmit={deleteForm.handleSubmit(onDeleteAccount)} className="space-y-4">
          <p className="text-sm text-slate-500">This will permanently delete your account, links, and analytics data. Enter your password to confirm.</p>
          <input type="password" placeholder="Your password" className="input" {...deleteForm.register('password', { required: true })} />
          <div className="flex gap-3">
            <button type="button" onClick={() => setDeleteModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-danger flex-1" disabled={deleteForm.formState.isSubmitting}>
              {deleteForm.formState.isSubmitting ? 'Deleting...' : 'Delete forever'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default SettingsPage
