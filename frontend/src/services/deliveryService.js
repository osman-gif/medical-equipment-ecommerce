import api from './api'

const deliveryService = {
  getAreas: () => api.get('/delivery/areas/'),
  getActiveAreas: () => api.get('/delivery/areas/active/'),
  getAreaById: (id) => api.get(`/delivery/areas/${id}/`),
  checkAvailability: (id) => api.get(`/delivery/areas/${id}/check_availability/`),
  createArea: (data) => api.post('/delivery/areas/', data),
  updateArea: (id, data) => api.put(`/delivery/areas/${id}/`, data),
  deleteArea: (id) => api.delete(`/delivery/areas/${id}/`),
}

export default deliveryService
