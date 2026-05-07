import api from './api'

const productService = {
  getProducts: (params = {}) => api.get('/products/', { params }),
  getProductById: (id) => api.get(`/products/${id}/`),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (id, data) => api.patch(`/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/products/${id}/`),
  getCategories: () => api.get('/products/categories/'),
  getProductsByCategory: (categoryId) => api.get('/products/by_category/', { params: { category_id: categoryId } }),
  getLowStockProducts: (threshold = 10) => api.get('/products/low_stock/', { params: { threshold } }),
  searchProducts: (query) => api.get('/products/', { params: { search: query } }),
}

export default productService
