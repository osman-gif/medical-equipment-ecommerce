import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

export default function AdminPurchaseHistory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState({
    days: 30,
    status: '',
  })

  // Check if user is admin
  useEffect(() => {
    if (user && !user.is_staff) {
      toast.error('Access denied. Admin only.')
      navigate('/products')
    }
  }, [user, navigate])

  // Fetch purchase history
  useEffect(() => {
    if (!user?.is_staff) return

    const fetchPurchaseHistory = async () => {
      setLoading(true)
      try {
        const params = {
          days: filters.days,
        }
        if (filters.status) {
          params.status = filters.status
        }
        const response = await orderService.getPurchaseHistory(params)
        setData(response.data)
      } catch (error) {
        console.error('Error fetching purchase history:', error)
        toast.error('Failed to load purchase history')
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseHistory()
  }, [user, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!user?.is_staff) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Purchase History & Analytics</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period (days)
            </label>
            <select
              name="days"
              value={filters.days}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ days: 30, status: '' })}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Loading purchase history...</p>
        </div>
      ) : data ? (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-primary">{data.statistics.total_orders}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${data.statistics.total_revenue.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Average Order Value</p>
              <p className="text-3xl font-bold text-blue-600">${data.statistics.average_order_value.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Period</p>
              <p className="text-lg font-bold text-gray-800">{data.period_days} days</p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Order Status Breakdown</h2>
              <div className="space-y-4">
                {Object.entries(data.statistics.status_breakdown).map(([status, info]) => (
                  <div key={status}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{info.label}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {info.count} ({info.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          status === 'pending' ? 'bg-yellow-500' :
                          status === 'processing' ? 'bg-blue-500' :
                          status === 'shipped' ? 'bg-indigo-500' :
                          status === 'delivered' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${info.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Top Customers</h2>
              <div className="space-y-4">
                {data.top_customers.length > 0 ? (
                  data.top_customers.map((customer, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{customer.user__first_name || 'Customer'}</p>
                        <p className="text-sm text-gray-600">{customer.user__email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${customer.total_spent.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{customer.order_count} orders</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No customers found</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Units Sold</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Times Ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_products.length > 0 ? (
                    data.top_products.map((product, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{product.product__name}</td>
                        <td className="text-right py-3 px-4">{product.total_quantity}</td>
                        <td className="text-right py-3 px-4">{product.times_ordered}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-center text-gray-600">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_orders.length > 0 ? (
                    data.recent_orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">#{order.id}</td>
                        <td className="py-3 px-4">{order.user_email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 font-bold">${Number(order.total)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-3 px-4 text-center text-gray-600">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No data available</p>
        </div>
      )}
    </div>
  )
}
