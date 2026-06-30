import { useState, useEffect, useCallback } from 'react'
import { urlAPI } from '@/services/url.service'
import toast from 'react-hot-toast'

export const useDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await urlAPI.getDashboardStats()
      setStats(data.data)
    } catch (err) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, refetch: fetchStats }
}
