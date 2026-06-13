/* Documentation for frontend/src/services/authService.js.*/

import api from './api'

const authService = {
  register: (data) => api.post('/users/register/', data),
  login: (email, password) => api.post('/users/login/', { email, password }),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/update/', data),
  getAddresses: () => api.get('/users/addresses/'),
  createAddress: (data) => api.post('/users/addresses/', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}/`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}/`),
  setDefaultAddress: (addressId) => api.post('/users/addresses/set_default/', { address_id: addressId }),
}

export default authService
