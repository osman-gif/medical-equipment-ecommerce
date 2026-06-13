/* Documentation for frontend/src/pages/Cart.jsx.*/

import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Cart() {
    /* Renders the Cart UI component. */
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-9xl mb-6">🛒</div>
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                    <p className="text-gray-600 text-sm">{item.category_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-24 text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeFromCart(item.id)
                      toast.success('Item removed')
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-red-600 hover:text-red-800 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({cart.length})</span>
              <span className="font-semibold">${getTotalPrice()}</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${getTotalPrice()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary font-semibold mb-4"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="block text-center text-primary hover:text-secondary font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
