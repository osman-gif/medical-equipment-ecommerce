import { useEffect, useState } from 'react'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Orders() {
  const { user } = useAuth()  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (!user) {
      console.log('User not logged in')
      return
    }

    const fetchOrders = async () => {
      try {
        console.log('🔍 Fetching orders for user:', user.email || user.username)
        const response = await orderService.getMyOrders()
        console.log('📊 API Response Status:', response.status)
        console.log('📊 API Response Headers:', response.headers)
        console.log('📊 API Response Data:', response.data)
        console.log('📊 API Response Data Type:', typeof response.data)
        
        let orderData = response.data.results || response.data
        
        // Additional debugging for response type
        if (orderData && typeof orderData === 'object' && !Array.isArray(orderData)) {
          console.warn('⚠️ Response is object but not array. Keys:', Object.keys(orderData))
          // If it's paginated, extract results
          if (orderData.results) {
            orderData = orderData.results
          } else if (orderData.data) {
            orderData = orderData.data
          } else {
            orderData = []
          }
        }
        
        console.log('📋 Parsed orders:', orderData)
        console.log('📈 Number of orders:', Array.isArray(orderData) ? orderData.length : 'NOT AN ARRAY')
        
        if (!Array.isArray(orderData)) {
          console.error('❌ API returned non-array data:', typeof orderData, orderData)
          setOrders([])
          toast.error('Failed to parse order data from server')
        } else {
          setOrders(orderData)
          if (orderData.length === 0) {
            console.log('ℹ️ User has no orders yet')
          }
        }
      } catch (error) {
        console.error('❌ Error fetching orders:')
        console.error('   Status:', error.response?.status)
        console.error('   Data:', error.response?.data)
        console.error('   Message:', error.message)
        console.error('   Full error:', error)
        toast.error('Failed to load orders: ' + (error.response?.data?.detail || error.message))
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Filter orders by status
  const formatCurrency = (amount) => {
    const value = Number(amount || 0)
    return Number.isNaN(value) ? '0.00' : value.toFixed(2)
  }

  const filteredOrders = statusFilter 
    ? orders.filter(order => order.status === statusFilter)
    : orders

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at)
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at)
    } else if (sortBy === 'highest') {
      return b.total - a.total
    } else if (sortBy === 'lowest') {
      return a.total - b.total
    }
    return 0
  })

  // Calculate statistics
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const averageOrder = orders.length > 0 ? totalSpent / orders.length : 0
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Sign in to view your orders</h1>
        <Link to="/login" className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary">
          Go to Login
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xl">Loading your purchase history...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">No orders yet</h1>
        <p className="text-gray-600 mb-8">Start shopping to place your first order</p>
        <Link to="/products" className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary">
          Shop Now
        </Link>
      </div>
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">My Orders & Purchase History</h1>
      <p className="text-gray-600 mb-8">Track all your orders and purchases in one place</p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-primary">{orders.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Spent</p>
          <p className="text-3xl font-bold text-green-600">${formatCurrency(totalSpent)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Average Order</p>
          <p className="text-3xl font-bold text-blue-600">${formatCurrency(averageOrder)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Status</p>
          <p className="text-lg font-bold">
            <span className="text-green-600">{deliveredOrders}</span>
            <span className="text-gray-400"> / </span>
            <span className="text-blue-600">{pendingOrders}</span>
          </p>
          <p className="text-xs text-gray-600">delivered / pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Order #{order.id}</h3>
                  <p className="text-gray-600 text-sm">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Order Items Preview */}
              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        • {item.product_details?.name || 'Product'} × {item.quantity}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500 italic">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {order.address && (
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Delivery To:</p>
                  <p className="text-sm text-gray-600">
                    {order.address.line1}
                    {order.address.line2 && `, ${order.address.line2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.city}, {order.address.state} {order.address.postal_code}
                  </p>
                </div>
              )}

              {/* Order Total and Action */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-gray-600">
                    <strong>Total:</strong> <span className="text-2xl font-bold text-primary">${formatCurrency(order.total)}</span>
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-500 mt-1">
                      Notes: {order.notes}
                    </p>
                  )}
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="mt-4 md:mt-0 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No orders matching your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

