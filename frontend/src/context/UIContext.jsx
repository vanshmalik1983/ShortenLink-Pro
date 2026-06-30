import { createContext, useContext, useState, useEffect } from 'react'

const UIContext = createContext(null)

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed)
  }, [sidebarCollapsed])

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev)

  return (
    <UIContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar, sidebarCollapsed, toggleCollapse }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used within UIProvider')
  return context
}
