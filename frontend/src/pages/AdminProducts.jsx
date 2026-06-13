/* Documentation for frontend/src/pages/AdminProducts.jsx.*/

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import productService from '../services/productService'
import toast from 'react-hot-toast'

export default function AdminProducts() {
    /* Renders the AdminProducts UI component. */
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    available: true,
    image: null,
  })

  useEffect(() => {
    if (!user?.is_staff) {
      toast.error('Access denied. Admin only.')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ])
      setProducts(productsRes.data.results || productsRes.data)
      setCategories(categoriesRes.data.results || categoriesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key])
        }
      })

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, submitData)
        toast.success('Product updated successfully!')
      } else {
        await productService.createProduct(submitData)
        toast.success('Product created successfully!')
      }

      setShowForm(false)
      setEditingProduct(null)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      available: product.available,
      image: null, // Don't pre-fill image
    })
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await productService.deleteProduct(productId)
      toast.success('Product deleted successfully!')
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      available: true,
      image: null,
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
    resetForm()
  }

  if (!user?.is_staff) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary"
        >
          Add New Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Available</label>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Products ({products.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
