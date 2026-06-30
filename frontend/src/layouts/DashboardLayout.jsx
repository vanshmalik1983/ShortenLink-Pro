import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/create': 'Create Short URL',
  '/urls': 'Manage URLs',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

const DashboardLayout = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'ShortLink Pro'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
