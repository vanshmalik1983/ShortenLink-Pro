import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { urlAPI } from '@/services/url.service'
import { Icon } from '@/components/ui/Icon'
import { copyToClipboard } from '@/utils/helpers'

const CreateUrlPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [createdUrl, setCreatedUrl] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const payload = {
        originalUrl: formData.originalUrl,
        ...(formData.customAlias && { customAlias: formData.customAlias }),
        ...(formData.title && { title: formData.title }),
        ...(formData.description && { description: formData.description }),
        ...(formData.password && { password: formData.password }),
        ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt).toISOString() }),
      }
      const { data } = await urlAPI.create(payload)
      setCreatedUrl(data.data.url)
      reset()
      toast.success('Short URL created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create URL')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await copyToClipboard(createdUrl.shortUrl)
    toast.success('Copied to clipboard')
  }

  const handleCreateAnother = () => setCreatedUrl(null)

  if (createdUrl) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card text-center !py-12">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <Icon.Check width="24" height="24" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Your link is ready!</h2>
          <p className="text-sm text-slate-500 mb-6">Share it anywhere or track its performance from your dashboard.</p>

          <div className="flex items-center gap-2 max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-2 mb-6">
            <span className="flex-1 text-sm font-mono font-semibold text-indigo-600 px-2 truncate">{createdUrl.shortUrl}</span>
            <button onClick={handleCopy} className="btn-secondary !py-2 !px-3"><Icon.Copy /></button>
          </div>

          {createdUrl.qrCode && (
            <img src={createdUrl.qrCode} alt="QR Code" className="w-32 h-32 mx-auto mb-6 rounded-xl border border-slate-100 p-2" />
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleCreateAnother} className="btn-secondary"><Icon.Plus /> Create another</button>
            <button onClick={() => navigate('/urls')} className="btn-primary">View all links</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Create a short URL</h2>
        <p className="text-sm text-slate-500 mb-6">Shorten any link and optionally customize it.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Destination URL</label>
            <input
              type="text"
              placeholder="https://example.com/your-long-url"
              className={errors.originalUrl ? 'input-error' : 'input'}
              {...register('originalUrl', { required: 'A URL is required' })}
            />
            {errors.originalUrl && <p className="text-xs text-red-500 mt-1">{errors.originalUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title <span className="text-slate-400 font-normal">(optional)</span></label>
            <input type="text" placeholder="My campaign link" className="input" {...register('title')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Custom alias <span className="text-slate-400 font-normal">(optional)</span></label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 shrink-0">shortlink.pro/</span>
              <input
                type="text"
                placeholder="my-campaign"
                className={errors.customAlias ? 'input-error' : 'input'}
                {...register('customAlias', { pattern: { value: /^[a-zA-Z0-9-_]{3,30}$/, message: '3-30 letters, numbers, - or _' } })}
              />
            </div>
            {errors.customAlias && <p className="text-xs text-red-500 mt-1">{errors.customAlias.message}</p>}
          </div>

          <button type="button" onClick={() => setShowAdvanced((p) => !p)} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600">
            Advanced options <Icon.ChevronDown className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          {showAdvanced && (
            <div className="space-y-5 pt-1 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea rows={2} placeholder="Internal note about this link" className="input resize-none" {...register('description')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input type="password" placeholder="Protect this link" className="input" {...register('password', { minLength: { value: 4, message: 'At least 4 characters' } })} />
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiration date <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input type="datetime-local" className="input" {...register('expiresAt')} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateUrlPage
