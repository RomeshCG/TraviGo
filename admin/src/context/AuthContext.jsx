import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({ name: "Hotel Manager" })
  const navigate = useNavigate()

  const login = (email, password) => {
    if (email === 'test@example.com' && password === 'password') {
      setIsAuthenticated(true)
      navigate('/dashboard')
    } else {
      alert('Invalid credentials')
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)