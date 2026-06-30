import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { getInitials } from '@/utils/helpers'

const Topbar = ({ title }) => {
  const { user, logout } = useAuth()
  const { toggleSidebar } = useUI()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800">
          <Icon.Menu />
        </button>
        {title && <h1 className="text-lg font-semibold text-slate-800">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Icon.Bell />
        </button>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((p) => !p)} className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-slate-50 transition-colors">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xs font-bold flex items-center justify-center">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">{user?.name}</span>
            <Icon.ChevronDown className="hidden sm:block text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-modal border border-slate-100 py-2 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <button onClick={() => { setMenuOpen(false); navigate('/profile') }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Icon.User className="text-slate-400" /> Profile
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/settings') }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Icon.Settings className="text-slate-400" /> Settings
              </button>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Icon.Logout /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
