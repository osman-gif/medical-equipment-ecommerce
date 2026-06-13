/* Documentation for frontend/src/App.jsx.*/

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import Addresses from './pages/Addresses'
import AdminPurchaseHistory from './pages/AdminPurchaseHistory'
import AdminProducts from './pages/AdminProducts'
import NotFound from './components/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addresses"
                element={
                  <ProtectedRoute>
                    <Addresses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/purchase-history"
                element={
                  <ProtectedRoute>
                    <AdminPurchaseHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#000',
            },
          }}
        />
      </Router>
    </ErrorBoundary>
  )
}

export default App
