import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'

const EditUrlModal = ({ url, isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (url) {
      reset({
        title: url.title || '',
        originalUrl: url.originalUrl || '',
        description: url.description || '',
        expiresAt: url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : '',
        isActive: url.isActive,
      })
    }
  }, [url, reset])

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const payload = {
        title: formData.title || null,
        originalUrl: formData.originalUrl,
        description: formData.description || null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        isActive: formData.isActive,
      }
      await onSave(url._id, payload)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update URL')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Link" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
          <input type="text" className="input" {...register('title')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Destination URL</label>
          <input type="text" className={errors.originalUrl ? 'input-error' : 'input'} {...register('originalUrl', { required: 'URL is required' })} />
          {errors.originalUrl && <p className="text-xs text-red-500 mt-1">{errors.originalUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea rows={2} className="input resize-none" {...register('description')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiration date</label>
          <input type="datetime-local" className="input" {...register('expiresAt')} />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer pt-1">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" {...register('isActive')} />
          Link is active
        </label>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</button>
        </div>
      </form>
    </Modal>
  )
}

export default EditUrlModal
