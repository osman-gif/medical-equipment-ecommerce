import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function Addresses() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  })

  useEffect(() => {
    if (!user) return
    fetchAddresses()
  }, [user])

  const fetchAddresses = async () => {
    try {
      const response = await authService.getAddresses()
      setAddresses(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        await authService.updateAddress(editingId, formData)
        toast.success('Address updated successfully!')
      } else {
        await authService.createAddress(formData)
        toast.success('Address added successfully!')
      }
      setFormData({ line1: '', line2: '', city: '', state: '', postal_code: '' })
      setShowForm(false)
      setEditingId(null)
      fetchAddresses()
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (address) => {
    setFormData({
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
    })
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      await authService.deleteAddress(id)
      toast.success('Address deleted successfully!')
      fetchAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Failed to delete address')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ line1: '', line2: '', city: '', state: '', postal_code: '' })
  }

  if (loading && addresses.length === 0) {
    return <div className="text-center py-16">Loading addresses...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Addresses</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary"
          >
            <FiPlus className="mr-2" /> Add Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Street Address *</label>
              <input
                name="line1"
                value={formData.line1}
                onChange={handleChange}
                required
                placeholder="123 Main St"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Apartment/Suite (Optional)</label>
              <input
                name="line2"
                value={formData.line2}
                onChange={handleChange}
                placeholder="Apt 4B"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">City *</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Khartoum"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">State/Region *</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Khartoum State"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Postal Code *</label>
              <input
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
                placeholder="15001"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-secondary disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">No addresses yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{address.line1}</p>
                  {address.line2 && <p className="text-gray-600">{address.line2}</p>}
                  <p className="text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
