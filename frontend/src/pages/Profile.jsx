import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    setFormData({
      email: user.email || '',
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
    })
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.updateProfile(formData)
      updateProfile(response.data)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <nav className="space-y-2">
              <a href="#profile" className="block px-4 py-2 rounded bg-primary text-white">
                Profile
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name</label>
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name</label>
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary disabled:bg-gray-400 font-semibold"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
