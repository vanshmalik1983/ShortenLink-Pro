import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { copyToClipboard, truncateUrl, getFaviconUrl, formatNumber } from '@/utils/helpers'
import toast from 'react-hot-toast'

const UrlRow = ({ url, selected, onSelect, onEdit, onDelete, onQR, onToggleFavorite }) => {
  const handleCopy = async () => {
    await copyToClipboard(url.shortUrl)
    toast.success('Copied to clipboard')
  }

  const isExpired = url.expiresAt && new Date() > new Date(url.expiresAt)
  const favicon = getFaviconUrl(url.originalUrl)

  return (
    <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/60 transition-colors ${selected ? 'bg-indigo-50/40' : ''}`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect(url._id)}
        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
      />

      <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
        {favicon ? <img src={favicon} alt="" className="w-5 h-5" onError={(e) => (e.target.style.display = 'none')} /> : <Icon.Link className="text-slate-400" width="16" height="16" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a href={url.shortUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline truncate-url">
            {url.shortUrl?.replace(/^https?:\/\//, '')}
          </a>
          {url.isPasswordProtected && <Icon.Lock className="text-slate-400 shrink-0" width="13" height="13" />}
          {url.isFavorite && <Icon.Star className="text-amber-400 fill-amber-400 shrink-0" width="13" height="13" />}
        </div>
        <p className="text-xs text-slate-400 truncate-url mt-0.5">{url.title || truncateUrl(url.originalUrl, 50)}</p>
      </div>

      <div className="hidden md:flex flex-col items-end shrink-0 w-20">
        <span className="text-sm font-semibold text-slate-700">{formatNumber(url.totalClicks)}</span>
        <span className="text-xs text-slate-400">clicks</span>
      </div>

      <div className="hidden sm:block shrink-0">
        {isExpired ? (
          <span className="badge-danger">Expired</span>
        ) : url.isActive ? (
          <span className="badge-success">Active</span>
        ) : (
          <span className="badge-gray">Disabled</span>
        )}
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button onClick={() => onToggleFavorite(url._id)} className="btn-ghost !p-2" title="Favorite">
          <Icon.Star className={url.isFavorite ? 'text-amber-400 fill-amber-400' : ''} />
        </button>
        <button onClick={handleCopy} className="btn-ghost !p-2" title="Copy"><Icon.Copy /></button>
        <button onClick={() => onQR(url)} className="btn-ghost !p-2" title="QR Code"><Icon.QR /></button>
        <Link to={`/analytics/${url._id}`} className="btn-ghost !p-2" title="Analytics"><Icon.BarChart /></Link>
        <button onClick={() => onEdit(url)} className="btn-ghost !p-2" title="Edit"><Icon.Edit /></button>
        <button onClick={() => onDelete(url)} className="btn-ghost !p-2 hover:!text-red-600 hover:!bg-red-50" title="Delete"><Icon.Trash /></button>
      </div>
    </div>
  )
}

export default UrlRow
