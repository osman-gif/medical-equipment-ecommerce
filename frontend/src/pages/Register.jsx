import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    phone: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await register(formData)
      toast.success('Registration successful!')
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.email?.[0] || error.response?.data?.error || 'Registration failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              type="text"
              placeholder="First name"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              value={formData.first_name}
              onChange={handleChange}
            />
            <input
              name="last_name"
              type="text"
              placeholder="Last name"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              required
              placeholder="Password (min 8 characters)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="password_confirm"
              type="password"
              required
              placeholder="Confirm password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary"
              value={formData.password_confirm}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary disabled:bg-gray-400 font-semibold"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-secondary font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
