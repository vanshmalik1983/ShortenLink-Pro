import { useState } from 'react'
import Modal from './Modal'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', description, confirmText = 'Confirm', variant = 'danger' }) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center">
        <div className={`w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        {description && <p className="text-sm text-slate-500 mb-6">{description}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={loading}>Cancel</button>
          <button onClick={handleConfirm} className={variant === 'danger' ? 'btn-danger flex-1' : 'btn-primary flex-1'} disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
