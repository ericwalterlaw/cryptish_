import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard/Dashboard'
import MarketAnalysis from './components/Market/MarketAnalysis'
import Portfolio from './components/Portfolio/Portfolio'
import AdminDashboard from './components/Admin/AdminDashboard'
import Layout from './components/Layout/Layout'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token)
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        
        {user ? (
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard user={user} />} />
            <Route path="market" element={<MarketAnalysis />} />
            <Route path="portfolio" element={<Portfolio user={user} />} />
            {user.role === 'admin' && (
              <Route path="admin" element={<AdminDashboard />} />
            )}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  )
}

export default App