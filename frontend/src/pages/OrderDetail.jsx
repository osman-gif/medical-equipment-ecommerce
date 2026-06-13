/* Documentation for frontend/src/pages/OrderDetail.jsx.*/

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

export default function OrderDetail() {
    /* Renders the OrderDetail UI component. */
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderDetail(id)
        setOrder(response.data)
      } catch (error) {
        console.error('Error fetching order:', error)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return <div className="text-center py-12">Loading order details...</div>
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>
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

  const getStatusSteps = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered']
    return steps
  }

  const currentStepIndex = getStatusSteps().indexOf(order.status)

  const formatCurrency = (value) => {
    const amount = Number(value || 0)
    return Number.isNaN(amount) ? '0.00' : amount.toFixed(2)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link to="/orders" className="inline-flex items-center text-primary hover:text-secondary mb-6">
        <span className="mr-2">←</span> Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Order #{order.id}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <span className={`px-6 py-3 rounded-full font-semibold text-lg ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-8">Delivery Status</h2>
        <div className="relative">
          <div className="flex justify-between relative">
            {getStatusSteps().map((step, index) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    index <= currentStepIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-sm font-semibold mt-2 capitalize text-center">{step}</p>
              </div>
            ))}
          </div>
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-300 -z-10">
            <div
              className={`h-full bg-primary transition-all duration-500`}
              style={{ width: `${(currentStepIndex / (getStatusSteps().length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Order Items</h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold">{item.product_details?.name || 'Product'}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${formatCurrency(item.price_at_order)}</p>
                <p className="text-gray-600 text-sm">Unit: ${formatCurrency(item.price_at_order)}</p>
                <p className="text-primary font-semibold text-sm">
                  Subtotal: ${formatCurrency(Number(item.quantity || 0) * Number(item.price_at_order || 0))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
          <div className="space-y-2 text-gray-600">
            <p>{order.address?.line1}</p>
            {order.address?.line2 && <p>{order.address.line2}</p>}
            <p>
              {order.address?.city}, {order.address?.state} {order.address?.postal_code}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {order.items && (
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({order.items.length})</span>
                <span className="font-semibold">
                  ${formatCurrency(order.items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price_at_order || 0)), 0))}
                </span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between text-lg">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-primary">${formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-2">Order Notes</h3>
          <p className="text-gray-700">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
