import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = 'http://localhost:5001/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token')
          setCurrentUser(null)
          setIsAuthenticated(false)
        } else {
          setCurrentUser(decoded)
          setIsAuthenticated(true)
          // Set auth header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      } catch (err) {
        localStorage.removeItem('token')
        setCurrentUser(null)
        setIsAuthenticated(false)
      }
    }
    setLoading(false)
  }, [])

  const register = async (userData) => {
    try {
      setError('')
      const response = await axios.post(`${API_URL}/register`, userData)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  const login = async (credentials) => {
    try {
      setError('')
      const response = await axios.post(`${API_URL}/login`, credentials)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setCurrentUser(user)
      setIsAuthenticated(true)
      return user
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (userData) => {
    try {
      setError('')
      const response = await axios.put(`${API_URL}/profile`, userData)
      setCurrentUser(prev => ({ ...prev, ...response.data.user }))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed')
      throw err
    }
  }

  const deleteProfile = async () => {
    try {
      await axios.delete(`${API_URL}/profile`)
      logout()
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete profile')
      throw err
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    deleteProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}