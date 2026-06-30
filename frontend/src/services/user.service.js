import api from './api'

export const userAPI = {
  updateProfile: (data) => api.patch('/user/profile', data),
  changePassword: (data) => api.patch('/user/password', data),
  uploadAvatar: (avatar) => api.patch('/user/avatar', { avatar }),
  deleteAccount: (password) => api.delete('/user/account', { data: { password } }),
}
