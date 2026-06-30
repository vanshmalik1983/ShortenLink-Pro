import api from './api'

export const urlAPI = {
  create: (data) => api.post('/urls', data),
  getAll: (params) => api.get('/urls', { params }),
  getById: (id) => api.get(`/urls/${id}`),
  update: (id, data) => api.patch(`/urls/${id}`, data),
  delete: (id) => api.delete(`/urls/${id}`),
  bulkDelete: (urlIds) => api.delete('/urls/bulk', { data: { urlIds } }),
  toggleFavorite: (id) => api.patch(`/urls/${id}/favorite`),
  getDashboardStats: () => api.get('/urls/stats/dashboard'),
  getQRCode: (id) => api.get(`/urls/${id}/qrcode`),
}
