import api from './api'

export const analyticsAPI = {
  getOverview: (period = '30d') => api.get('/analytics/overview', { params: { period } }),
  getUrlAnalytics: (urlId, period = '30d') => api.get(`/analytics/${urlId}`, { params: { period } }),
}
