import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import { urlAPI } from '@/services/url.service'
import { downloadFile } from '@/utils/helpers'
import { Icon } from '@/components/ui/Icon'

const QRCodeModal = ({ url, isOpen, onClose }) => {
  const [qrCode, setQrCode] = useState(url?.qrCode || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && url && !url.qrCode) {
      setLoading(true)
      urlAPI
        .getQRCode(url._id)
        .then(({ data }) => setQrCode(data.data.qrCode))
        .catch(() => toast.error('Failed to generate QR code'))
        .finally(() => setLoading(false))
    } else if (url?.qrCode) {
      setQrCode(url.qrCode)
    }
  }, [isOpen, url])

  const handleDownload = () => {
    downloadFile(qrCode, `${url.shortCode}-qrcode.png`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code" maxWidth="max-w-sm">
      <div className="text-center">
        {loading ? (
          <div className="w-56 h-56 mx-auto skeleton rounded-xl" />
        ) : qrCode ? (
          <img src={qrCode} alt="QR Code" className="w-56 h-56 mx-auto rounded-xl border border-slate-100 p-3" />
        ) : (
          <div className="w-56 h-56 mx-auto flex items-center justify-center text-slate-300">
            <Icon.QR width="48" height="48" />
          </div>
        )}
        <p className="text-sm text-slate-500 mt-4 font-mono">{url?.shortUrl}</p>
        <button onClick={handleDownload} disabled={!qrCode} className="btn-primary w-full mt-5">
          <Icon.Download /> Download QR Code
        </button>
      </div>
    </Modal>
  )
}

export default QRCodeModal
