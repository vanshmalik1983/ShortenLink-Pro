import { useState, useEffect, useCallback } from 'react'
import { analyticsAPI } from '@/services/analytics.service'
import toast from 'react-hot-toast'

export const useAnalytics = (urlId, initialPeriod = '30d') => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(initialPeriod)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const res = urlId
        ? await analyticsAPI.getUrlAnalytics(urlId, period)
        : await analyticsAPI.getOverview(period)
      setData(res.data.data)
    } catch (err) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [urlId, period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { data, loading, period, setPeriod, refetch: fetchAnalytics }
}
