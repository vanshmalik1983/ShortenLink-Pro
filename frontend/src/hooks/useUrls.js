import { useState, useCallback } from 'react'
import { urlAPI } from '@/services/url.service'
import toast from 'react-hot-toast'

export const useUrls = () => {
  const [urls, setUrls] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUrls = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await urlAPI.getAll(params)
      setUrls(data.data.urls)
      setPagination(data.pagination)
      return data.data.urls
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load URLs')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createUrl = async (payload) => {
    const { data } = await urlAPI.create(payload)
    toast.success('Short URL created!')
    return data.data.url
  }

  const updateUrl = async (id, payload) => {
    const { data } = await urlAPI.update(id, payload)
    setUrls((prev) => prev.map((u) => (u._id === id ? data.data.url : u)))
    toast.success('URL updated')
    return data.data.url
  }

  const deleteUrl = async (id) => {
    await urlAPI.delete(id)
    setUrls((prev) => prev.filter((u) => u._id !== id))
    toast.success('URL deleted')
  }

  const bulkDelete = async (ids) => {
    await urlAPI.bulkDelete(ids)
    setUrls((prev) => prev.filter((u) => !ids.includes(u._id)))
    toast.success(`${ids.length} URLs deleted`)
  }

  const toggleFavorite = async (id) => {
    const { data } = await urlAPI.toggleFavorite(id)
    setUrls((prev) => prev.map((u) => (u._id === id ? { ...u, isFavorite: data.data.isFavorite } : u)))
  }

  return { urls, pagination, loading, fetchUrls, createUrl, updateUrl, deleteUrl, bulkDelete, toggleFavorite, setUrls }
}
