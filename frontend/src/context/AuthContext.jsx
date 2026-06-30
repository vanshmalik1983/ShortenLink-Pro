import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '@/services/auth.service'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const { data } = await authAPI.getMe()
      setUser(data.data.user)
      setIsAuthenticated(true)
    } catch (err) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials)
    const { user: userData, accessToken, refreshToken } = data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(userData)
    setIsAuthenticated(true)
    return userData
  }

  const register = async (payload) => {
    const { data } = await authAPI.register(payload)
    return data.data.user
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await authAPI.logout(refreshToken)
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateUser, refetchUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
