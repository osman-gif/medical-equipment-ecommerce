/* Documentation for frontend/src/services/orderService.js.*/

import api from './api'

const orderService = {
  getOrders: (params = {}) => api.get('/orders/', { params }),
  getOrderById: (id) => api.get(`/orders/${id}/`),
  getOrderDetail: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post('/orders/', data),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/update_status/`, { status }),
  getMyOrders: () => api.get('/orders/my_orders/'),
  getOrdersByStatus: (status) => api.get('/orders/by_status/', { params: { status } }),
  getPurchaseHistory: (params = {}) => api.get('/orders/purchase_history/', { params }),
}

export default orderService
