/* Documentation for frontend/src/context/AuthContext.jsx.*/

import { useState, useContext, createContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data

  if (typeof data === 'string') {
    return data || fallback
  }

  const messages = []
  for (const key of ['detail', 'error', 'non_field_errors']) {
    const value = data?.[key]
    if (Array.isArray(value)) messages.push(...value)
    else if (typeof value === 'string' && value.trim()) messages.push(value)
  }

  for (const key of ['email', 'username', 'password', 'first_name', 'last_name', 'phone']) {
    const value = data?.[key]
    if (Array.isArray(value)) messages.push(...value)
    else if (typeof value === 'string' && value.trim()) messages.push(value)
  }

  return messages[0] || fallback
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const register = async (data) => {
    try {
      setError(null)
      const response = await authService.register(data)
      const { user: userData, access, refresh } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch (err) {
      const message = getErrorMessage(err, 'Registration failed')
      setError(message)
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authService.login(email, password)
      const { user: userData, access, refresh } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch (err) {
      const message = getErrorMessage(err, 'Login failed')
      setError(message)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const getProfile = async () => {
    try {
      const response = await authService.getProfile()
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateProfile = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, getProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
