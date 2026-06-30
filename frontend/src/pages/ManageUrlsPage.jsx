import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useUrls } from '@/hooks/useUrls'
import { useDebounce } from '@/hooks/useDebounce'
import { urlAPI } from '@/services/url.service'
import UrlRow from '@/components/url/UrlRow'
import EditUrlModal from '@/components/url/EditUrlModal'
import QRCodeModal from '@/components/url/QRCodeModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { Icon } from '@/components/ui/Icon'

const filterOptions = [
  { value: '', label: 'All links' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'protected', label: 'Password protected' },
]

const sortOptions = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'totalClicks:desc', label: 'Most clicked' },
  { value: 'totalClicks:asc', label: 'Least clicked' },
]

const ManageUrlsPage = () => {
  const { urls, pagination, loading, fetchUrls, deleteUrl, bulkDelete, toggleFavorite, setUrls } = useUrls()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('createdAt:desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])

  const [editingUrl, setEditingUrl] = useState(null)
  const [qrUrl, setQrUrl] = useState(null)
  const [deletingUrl, setDeletingUrl] = useState(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  const loadUrls = useCallback(() => {
    const [sortBy, sortOrder] = sort.split(':')
    fetchUrls({ page, limit: 10, search: debouncedSearch, filter, sortBy, sortOrder })
  }, [page, debouncedSearch, filter, sort, fetchUrls])

  useEffect(() => {
    loadUrls()
  }, [loadUrls])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filter, sort])

  const handleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    setSelected(selected.length === urls.length ? [] : urls.map((u) => u._id))
  }

  const handleSaveEdit = async (id, payload) => {
    const { data } = await urlAPI.update(id, payload)
    setUrls((prev) => prev.map((u) => (u._id === id ? data.data.url : u)))
    toast.success('URL updated')
  }

  const handleBulkDelete = async () => {
    await bulkDelete(selected)
    setSelected([])
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage URLs</h2>
          <p className="text-sm text-slate-500 mt-0.5">{pagination?.total ?? 0} total links</p>
        </div>
        <Link to="/create" className="btn-primary shrink-0"><Icon.Plus /> Create URL</Link>
      </div>

      {/* Filters bar */}
      <div className="card !p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"><Icon.Search /></span>
          <input
            type="text"
            placeholder="Search by URL, alias, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input !pl-10"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input sm:w-48">
          {filterOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-48">
          {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Bulk actions bar */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 animate-fade-in">
          <span className="text-sm font-medium text-indigo-700">{selected.length} selected</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelected([])} className="btn-ghost !py-1.5">Cancel</button>
            <button onClick={() => setBulkDeleteOpen(true)} className="btn-danger !py-1.5">
              <Icon.Trash /> Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={6} />
      ) : urls.length === 0 ? (
        <div className="card !p-0">
          <EmptyState
            icon={<Icon.Link width="28" height="28" />}
            title={search || filter ? 'No matching links' : 'No links yet'}
            description={search || filter ? 'Try adjusting your search or filters.' : 'Create your first short URL to get started.'}
            action={!search && !filter && <Link to="/create" className="btn-primary"><Icon.Plus /> Create your first link</Link>}
          />
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/50">
            <input
              type="checkbox"
              checked={selected.length === urls.length && urls.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Link</span>
          </div>
          <div className="divide-y divide-slate-50">
            {urls.map((url) => (
              <UrlRow
                key={url._id}
                url={url}
                selected={selected.includes(url._id)}
                onSelect={handleSelect}
                onEdit={setEditingUrl}
                onDelete={setDeletingUrl}
                onQR={setQrUrl}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => p - 1)} disabled={!pagination.hasPrev} className="btn-secondary !py-2 !px-3">
              <Icon.ChevronLeft />
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={!pagination.hasNext} className="btn-secondary !py-2 !px-3">
              <Icon.ChevronRight />
            </button>
          </div>
        </div>
      )}

      <EditUrlModal url={editingUrl} isOpen={!!editingUrl} onClose={() => setEditingUrl(null)} onSave={handleSaveEdit} />
      <QRCodeModal url={qrUrl} isOpen={!!qrUrl} onClose={() => setQrUrl(null)} />
      <ConfirmDialog
        isOpen={!!deletingUrl}
        onClose={() => setDeletingUrl(null)}
        onConfirm={() => deleteUrl(deletingUrl._id)}
        title="Delete this link?"
        description="This will permanently delete the link and all its analytics data."
        confirmText="Delete link"
      />
      <ConfirmDialog
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selected.length} links?`}
        description="This will permanently delete the selected links and all their analytics data."
        confirmText="Delete all"
      />
    </div>
  )
}

export default ManageUrlsPage
