/* Documentation for frontend/src/pages/Checkout.jsx.*/

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import orderService from '../services/orderService'
import deliveryService from '../services/deliveryService'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'

export default function Checkout() {
    /* Renders the Checkout UI component. */
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [deliveryAreas, setDeliveryAreas] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  })
  const [showDeliveryAreaForm, setShowDeliveryAreaForm] = useState(false)
  const [deliveryAreaForm, setDeliveryAreaForm] = useState({
    name: '',
    description: '',
    delivery_fee: '',
    estimated_days: 3,
    is_active: true,
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [addressRes, areaRes] = await Promise.all([
          authService.getAddresses(),
          deliveryService.getActiveAreas(),
        ])
        setAddresses(addressRes.data.results || addressRes.data)
        setDeliveryAreas(areaRes.data.results || areaRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [user, navigate])

  const handleDeliveryAreaChange = (e) => {
    const { name, value, type, checked } = e.target
    setDeliveryAreaForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value 
    }))
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddDeliveryArea = async (e) => {
    e.preventDefault()
    console.log('=== ADD DELIVERY AREA DEBUG ===')
    console.log('Delivery area form data:', deliveryAreaForm)
    console.log('User is admin:', user?.is_staff)
    
    if (!user?.is_staff) {
      toast.error('Only admins can add delivery areas')
      return
    }
    
    setLoading(true)
    try {
      const response = await deliveryService.createArea(deliveryAreaForm)
      console.log('Delivery area creation response:', response)
      toast.success('Delivery area added successfully!')
      setShowDeliveryAreaForm(false)
      setDeliveryAreaForm({
        name: '',
        description: '',
        delivery_fee: '',
        estimated_days: 3,
        is_active: true,
      })
      // Refresh delivery areas
      const areaRes = await deliveryService.getActiveAreas()
      setDeliveryAreas(areaRes.data.results || areaRes.data)
    } catch (error) {
      console.error('❌ Delivery area creation error details:')
      console.error('   Status:', error.response?.status)
      console.error('   Response Data:', error.response?.data)
      
      let errorMsg = 'Failed to add delivery area'
      if (error.response?.data) {
        const data = error.response.data
        if (data.detail) {
          errorMsg = data.detail
        } else if (data.non_field_errors) {
          errorMsg = data.non_field_errors.join(', ')
        } else if (typeof data === 'object') {
          const fieldErrors = Object.values(data).flat()
          errorMsg = fieldErrors.join(', ')
        }
      }
      
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    console.log('=== ADD ADDRESS DEBUG ===')
    console.log('Address form data:', addressForm)
    console.log('User authenticated:', !!user)
    console.log('User data:', user)
    
    setLoading(true)
    try {
      const response = await authService.createAddress(addressForm)
      console.log('Address creation response:', response)
      toast.success('Address added successfully!')
      setShowAddressForm(false)
      setAddressForm({ line1: '', line2: '', city: '', state: '', postal_code: '' })
      const newAddress = response.data
      setSelectedAddress(newAddress.id)
      await authService.getAddresses().then((res) => setAddresses(res.data.results || res.data))
    } catch (error) {
      console.error('❌ Address creation error details:')
      console.error('   Status:', error.response?.status)
      console.error('   Status Text:', error.response?.statusText)
      console.error('   Response Data:', error.response?.data)
      console.error('   Error Message:', error.message)
      
      let errorMsg = 'Failed to add address'
      if (error.response?.data) {
        const data = error.response.data
        if (data.detail) {
          errorMsg = data.detail
        } else if (data.non_field_errors) {
          errorMsg = data.non_field_errors.join(', ')
        } else if (typeof data === 'object') {
          const fieldErrors = Object.values(data).flat()
          errorMsg = fieldErrors.join(', ')
        }
      } else if (error.message) {
        errorMsg = error.message
      }
      
      console.error('❌ Final address error message:', errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        address: selectedAddress,
        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        notes,
      }

      console.log('=== CHECKOUT DEBUG ===')
      console.log('Cart items:', cart)
      console.log('Selected address ID:', selectedAddress)
      console.log('Order data being sent:', JSON.stringify(orderData, null, 2))
      console.log('======================')
      
      const response = await orderService.createOrder(orderData)
      console.log('✓ Order response status:', response.status)
      console.log('✓ Order created data:', response.data)
      
      toast.success('Order placed successfully!')
      clearCart()
      
      // Redirect to order detail
      setTimeout(() => {
        navigate(`/orders/${response.data.id}`)
      }, 1500)
    } catch (error) {
      console.error('❌ Checkout error details:')
      console.error('   Status:', error.response?.status)
      console.error('   Status Text:', error.response?.statusText)
      console.error('   Response Data:', error.response?.data)
      console.error('   Error Message:', error.message)
      console.error('   Full Error:', error)
      
      let errorMsg = 'Failed to place order'
      
      // Extract detailed error message
      if (error.response?.data) {
        const data = error.response.data
        if (typeof data === 'string') {
          errorMsg = data
        } else if (data.detail) {
          errorMsg = data.detail
        } else if (data.error) {
          errorMsg = data.error
        } else if (data.items) {
          errorMsg = `Order items error: ${JSON.stringify(data.items)}`
        } else if (data.address) {
          errorMsg = `Address error: ${JSON.stringify(data.address)}`
        } else if (data.non_field_errors) {
          errorMsg = `Order error: ${JSON.stringify(data.non_field_errors)}`
        } else {
          errorMsg = `Server error: ${JSON.stringify(data)}`
        }
      } else {
        errorMsg = error.message
      }
      
      console.error('❌ Final error message:', errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCheckout} className="space-y-8">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

              <div className="mb-4">
                <button
                  onClick={() => setShowAddressForm((v) => !v)}
                  type="button"
                  className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-secondary mr-2"
                >
                  {showAddressForm ? 'Hide Address Form' : 'Add New Address'}
                </button>
                
                {user?.is_staff && (
                  <>
                    <button
                      onClick={() => setShowDeliveryAreaForm((v) => !v)}
                      type="button"
                      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 mr-2"
                    >
                      {showDeliveryAreaForm ? 'Hide Delivery Area Form' : 'Add Delivery Area'}
                    </button>
                    
                    <a
                      href="/admin/delivery/deliveryarea/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Admin Panel
                    </a>
                  </>
                )}
              </div>

              {showAddressForm && (
                <div className="bg-white rounded-lg shadow-md p-5 mb-5 border">
                  <h3 className="text-lg font-semibold mb-3">New Delivery Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-3">
                    <input name="line1" value={addressForm.line1} onChange={handleAddressChange} required placeholder="Street Address" className="w-full px-3 py-2 border rounded" />
                    <input name="line2" value={addressForm.line2} onChange={handleAddressChange} placeholder="Apt / Suite (optional)" className="w-full px-3 py-2 border rounded" />
                    <div className="grid grid-cols-2 gap-2">
                      <input name="city" value={addressForm.city} onChange={handleAddressChange} required placeholder="City" className="w-full px-3 py-2 border rounded" />
                      <input name="state" value={addressForm.state} onChange={handleAddressChange} required placeholder="State" className="w-full px-3 py-2 border rounded" />
                    </div>
                    <input name="postal_code" value={addressForm.postal_code} onChange={handleAddressChange} required placeholder="Postal code" className="w-full px-3 py-2 border rounded" />
                    <button type="submit" disabled={loading} className="bg-secondary text-white w-full px-3 py-2 rounded">{loading ? 'Saving...' : 'Save Address'}</button>
                  </form>
                </div>
              )}

              {showDeliveryAreaForm && user?.is_staff && (
                <div className="bg-green-50 rounded-lg shadow-md p-5 mb-5 border border-green-200">
                  <h3 className="text-lg font-semibold mb-3 text-green-800">New Delivery Area (Admin Only)</h3>
                  <form onSubmit={handleAddDeliveryArea} className="space-y-3">
                    <input name="name" value={deliveryAreaForm.name} onChange={handleDeliveryAreaChange} required placeholder="Area Name (e.g., Khartoum Central)" className="w-full px-3 py-2 border rounded" />
                    <textarea name="description" value={deliveryAreaForm.description} onChange={handleDeliveryAreaChange} placeholder="Description (optional)" className="w-full px-3 py-2 border rounded" rows="2" />
                    <div className="grid grid-cols-2 gap-2">
                      <input name="delivery_fee" value={deliveryAreaForm.delivery_fee} onChange={handleDeliveryAreaChange} type="number" step="0.01" required placeholder="Delivery Fee (e.g., 5.00)" className="w-full px-3 py-2 border rounded" />
                      <input name="estimated_days" value={deliveryAreaForm.estimated_days} onChange={handleDeliveryAreaChange} type="number" min="1" required placeholder="Estimated Days" className="w-full px-3 py-2 border rounded" />
                    </div>
                    <label className="flex items-center">
                      <input name="is_active" checked={deliveryAreaForm.is_active} onChange={handleDeliveryAreaChange} type="checkbox" className="mr-2" />
                      Active (available for delivery)
                    </label>
                    <button type="submit" disabled={loading} className="bg-green-600 text-white w-full px-3 py-2 rounded hover:bg-green-700">{loading ? 'Saving...' : 'Save Delivery Area'}</button>
                  </form>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-gray-600 mb-4">No addresses found. Add one above or go to the addresses page.</p>
                  <Link
                    to="/addresses"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary font-semibold"
                  >
                    Manage Addresses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label key={address.id} className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                        className="mt-1 mr-4"
                      />
                      <div>
                        <p className="font-semibold">{address.line1}</p>
                        {address.line2 && <p className="text-gray-600">{address.line2}</p>}
                        <p className="text-gray-600">{address.city}, {address.state}</p>
                        <p className="text-gray-600 text-sm">{address.postal_code}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Order Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions..."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="4"
              />
            </div>

            {/* Delivery Areas Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Delivery Areas & Fees</h3>
              <div className="space-y-2">
                {deliveryAreas.map((area) => (
                  <div key={area.id} className="flex justify-between">
                    <span>{area.name}</span>
                    <span className="text-gray-600">
                      ${area.delivery_fee} ({area.estimated_days} days)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedAddress}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary disabled:bg-gray-400 font-semibold"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between pb-2 border-b">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${getTotalPrice()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
