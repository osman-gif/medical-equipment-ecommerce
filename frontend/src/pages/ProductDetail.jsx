import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import productService from '../services/productService'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      toast.success(`${product.name} added to cart!`)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center">
        <p className="text-xl">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center">
        <p className="text-xl">Product not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-9xl">📦</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          {/* Category and SKU */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {product.category?.name || 'Uncategorized'}
            </span>
            <span className="text-gray-600">SKU: {product.sku}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>

          {/* Price */}
          <div className="mb-6">
            <span className="text-5xl font-bold text-primary">${product.price}</span>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-lg text-green-600 font-semibold">In Stock: {product.stock} units</span>
            ) : (
              <span className="text-lg text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Quantity:</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="w-16 text-center border rounded px-2 py-2"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary disabled:bg-gray-400 mb-4"
          >
            Add to Cart
          </button>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Category:</strong> {product.category?.name || 'N/A'}</li>
              <li><strong>SKU:</strong> {product.sku}</li>
              <li><strong>Available:</strong> {product.available ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
