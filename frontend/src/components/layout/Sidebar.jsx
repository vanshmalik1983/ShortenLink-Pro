import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import Logo from '@/components/ui/Logo'
import { useUI } from '@/context/UIContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Icon.Home },
  { to: '/create', label: 'Create URL', icon: Icon.Plus },
  { to: '/urls', label: 'Manage URLs', icon: Icon.List },
  { to: '/analytics', label: 'Analytics', icon: Icon.BarChart },
  { to: '/profile', label: 'Profile', icon: Icon.User },
  { to: '/settings', label: 'Settings', icon: Icon.Settings },
]

const Sidebar = () => {
  const { sidebarOpen, closeSidebar, sidebarCollapsed, toggleCollapse } = useUI()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={closeSidebar} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 bg-white border-r border-slate-100 flex flex-col
          transition-all duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        <div className={`h-16 flex items-center border-b border-slate-100 shrink-0 ${sidebarCollapsed ? 'lg:justify-center lg:px-0 px-5' : 'px-5'}`}>
          <Logo showText={!sidebarCollapsed} />
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: ItemIcon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                ${sidebarCollapsed ? 'lg:justify-center' : ''}`
              }
              title={sidebarCollapsed ? label : undefined}
            >
              <ItemIcon className="shrink-0" />
              <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center gap-2 mx-3 mb-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors text-sm font-medium"
        >
          {sidebarCollapsed ? <Icon.ChevronRight /> : <><Icon.ChevronLeft /><span>Collapse</span></>}
        </button>
      </aside>
    </>
  )
}

export default Sidebar
