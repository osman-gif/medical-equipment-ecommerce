export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

        {/* Category */}
        <div className="mb-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {product.category_name || 'Uncategorized'}
          </span>
        </div>

        {/* Stock Status */}
        <div className="mb-3">
          {product.stock > 0 ? (
            <span className="text-sm text-green-600 font-semibold">In Stock: {product.stock}</span>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.available || product.stock === 0}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
