import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { copyToClipboard, truncateUrl, formatNumber } from '@/utils/helpers'
import toast from 'react-hot-toast'

const RecentLinksTable = ({ links = [], title = 'Recent Links' }) => {
  const handleCopy = async (url) => {
    await copyToClipboard(url)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <Link to="/urls" className="text-xs font-medium text-indigo-600 hover:underline">View all</Link>
      </div>

      {links.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-400">No links yet. Create your first one!</div>
      ) : (
        <div className="divide-y divide-slate-50">
          {links.map((link) => (
            <div key={link._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                <Icon.Link width="16" height="16" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-indigo-600 truncate-url">{link.shortUrl?.replace(/^https?:\/\//, '')}</p>
                <p className="text-xs text-slate-400 truncate-url">{truncateUrl(link.originalUrl, 45)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-slate-700">{formatNumber(link.totalClicks)}</p>
                <p className="text-xs text-slate-400">clicks</p>
              </div>
              <button onClick={() => handleCopy(link.shortUrl)} className="btn-ghost !p-2 shrink-0">
                <Icon.Copy />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentLinksTable
