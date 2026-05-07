import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import productService from '../services/productService'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let response
        if (selectedCategory) {
          response = await productService.getProductsByCategory(selectedCategory)
        } else if (searchQuery) {
          response = await productService.searchProducts(searchQuery)
        } else {
          response = await productService.getProducts()
        }
        setProducts(response.data.results || response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, searchQuery])

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar - Categories */}
        <div>
          <CategoryFilter onCategoryChange={setSelectedCategory} />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
