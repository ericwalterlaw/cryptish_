import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, Wallet, Settings, LogOut, Shield } from 'lucide-react'

const Layout = ({ user, onLogout }) => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/market', icon: TrendingUp, label: 'Market' },
    { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
  ]

  if (user.role === 'admin') {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' })
  }

  return (
<div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <aside className="w-64 bg-gray-800 shadow-lg flex flex-col">
    <div className="p-6 border-b border-gray-700">
      <h1 className="text-2xl font-bold text-primary-500">Horizon Crypto</h1>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto mt-6">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
              isActive ? 'bg-gray-700 text-white border-r-2 border-primary-500' : ''
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        )
      })}
    </nav>

    {/* User Info + Logout */}
    <div className="p-6 border-t border-gray-700">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user.email[0].toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="text-white text-sm font-medium">{user.email}</p>
          <p className="text-gray-400 text-xs">Balance: ${user.balance?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </div>
  </aside>

  {/* Main Content */}
  <div className="flex-1 overflow-y-auto bg-gray-900">
    <main className="p-6 min-h-full">
      <Outlet />
    </main>
  </div>
</div>

  )
}

export default Layout