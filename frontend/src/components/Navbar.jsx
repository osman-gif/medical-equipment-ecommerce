/* Documentation for frontend/src/components/Navbar.jsx.*/

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiMenu, FiX, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    /* Renders the Navbar UI component. */
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { cart, getTotalItems } = useCart()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl">
            <span>🏥</span>
            <span>Avicinna-Med</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/products" className="hover:text-blue-200">Products</Link>
            {user && <Link to="/orders" className="hover:text-blue-200">Orders</Link>}
            {user?.is_staff && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center hover:text-blue-200 font-semibold"
                >
                  Admin <FiChevronDown size={16} />
                </button>
                {isProfileOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                    <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-100">Manage Products</Link>
                    <Link to="/admin/purchase-history" className="block px-4 py-2 hover:bg-gray-100">Purchase History</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-blue-200">
              <FiShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center hover:text-blue-200"
                >
                  <FiUser size={24} />
                  <FiChevronDown size={16} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/addresses" className="block px-4 py-2 hover:bg-gray-100">Addresses</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-secondary px-4 py-2 rounded hover:bg-blue-900">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:text-blue-200">Home</Link>
            <Link to="/products" className="block hover:text-blue-200">Products</Link>
            {user && <Link to="/orders" className="block hover:text-blue-200">Orders</Link>}
            {user?.is_staff && (
              <>
                <Link to="/admin/products" className="block hover:text-blue-200 font-semibold">Admin - Products</Link>
                <Link to="/admin/purchase-history" className="block hover:text-blue-200 font-semibold">Admin - Purchase History</Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="block hover:text-blue-200">Login</Link>
                <Link to="/register" className="block hover:text-blue-200">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
