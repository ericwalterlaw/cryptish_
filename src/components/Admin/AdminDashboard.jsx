import { useState, useEffect } from 'react'
import { Users, DollarSign, Activity, Settings, Edit, Trash2 } from 'lucide-react'
import { api } from '../../api'
import TransactionHistory from '../TransactionHistory'
import AddTransactionForm from '../AddTransactionForm'
import PortfolioManager from '../PortfolioManager'



const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolume: 0,
    totalTransactions: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [transactions, setTransactions] = useState([])


  useEffect(() => {
    fetchAdminData()
  }, [])

  useEffect(() => {
  if (selectedUser) {
    fetchTransactions(selectedUser._id)
  }
}, [selectedUser])

const fetchTransactions = async (userId) => {
  try {
    const res = await api.get(`/api/admin/users/${userId}/transactions`)
    setTransactions(res)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    setTransactions([])
  }
}

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/api/admin/dashboard')
      
      setUsers(response.users)
      setStats(response.stats)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      // Mock data for demo
      setUsers([
        {
          _id: '1',
          email: 'user1@example.com',
          balance: 5000,
          portfolioValue: 15000,
          totalPnL: 2500,
          createdAt: new Date(),
          lastActive: new Date(),
          role: 'user'
        },
        {
          _id: '2',
          email: 'user2@example.com',
          balance: 3000,
          portfolioValue: 8000,
          totalPnL: -500,
          createdAt: new Date(),
          lastActive: new Date(),
          role: 'user'
        }
      ])
      setStats({
        totalUsers: 250,
        totalVolume: 2500000,
        totalTransactions: 1450,
        activeUsers: 180
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserEdit = async (userId, updates) => {
    try {
      await api.put(`/api/admin/users/${userId}`, updates)
      
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, ...updates } : user
      ))
      setEditMode(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      await api.delete(`/api/admin/users/${userId}`)
      
      setUsers(prev => prev.filter(user => user._id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleTransactionDelete = async (userId, txId) => {
  try {
    await api.delete(`/api/admin/users/${userId}/transactions/${txId}`)
    
    // Remove locally
    setTransactions(prev => prev.filter(tx => tx._id !== txId))

    // Update stats/users table if needed
    fetchAdminData()
  } catch (error) {
    console.error("Error deleting transaction:", error)
  }
}



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">Manage users and monitor platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-white">${stats.totalVolume.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-white">{stats.totalTransactions.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

{/* Users Management */}
<div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-700">
    <h3 className="text-xl font-semibold text-white">User Management</h3>
  </div>
  
  {/* Scrollable Table */}
 <div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-700">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Balance</th>
        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Portfolio</th>
        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">P&L</th>
        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-700">
      {users.map((user) => (
        <tr key={user._id} className="hover:bg-gray-700 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{user.email}</p>
                  <p className="text-gray-400 text-sm">
                    Last active: {new Date(user.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-white font-medium">
              ${user.balance?.toFixed(2) || '0.00'}
            </td>
            <td className="px-6 py-4 text-white">
              ${user.portfolioValue?.toFixed(2) || '0.00'}
            </td>
            <td className="px-6 py-4">
              <span
                className={`font-medium ${
                  (user.totalPnL || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {(user.totalPnL || 0) >= 0 ? '+' : ''}${(user.totalPnL || 0).toFixed(2)}
              </span>
            </td>
            <td className="px-6 py-4 text-gray-400">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedUser(user)
                    setEditMode(true)
                  }}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleUserDelete(user._id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      {/* Edit User Modal */}
{editMode && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl w-full">
      <h3 className="text-xl font-semibold text-white mb-6">
        Edit User – {selectedUser.email}
      </h3>

{/* Transaction History */}
<TransactionHistory 
  transactions={transactions} 
  onDelete={(txId) => handleTransactionDelete(selectedUser._id, txId)}
/>


{/* Add Transaction Form */}
<AddTransactionForm 
  userId={selectedUser._id} 
  onAdd={(newTx) => {
    setTransactions(prev => [newTx, ...prev])
    // Update balance in users table
    setUsers(prev => prev.map(u =>
      u._id === selectedUser._id
        ? { ...u, balance: u.balance + newTx.value }
        : u
    ))
    fetchAdminData()
  }} 
/>

      {/* Portfolio Manager */}
<PortfolioManager userId={selectedUser._id} onChange={fetchAdminData} />

      {/* User Update Section */}
      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          handleUserEdit(selectedUser._id, {
            balance: parseFloat(formData.get('balance')),
            role: formData.get('role')
          })
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Balance ($)
            </label>
            <input
              type="number"
              name="balance"
              step="0.01"
              defaultValue={selectedUser.balance || 0}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Role
            </label>
            <select
              name="role"
              defaultValue={selectedUser.role}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => {
              setEditMode(false)
              setSelectedUser(null)
            }}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  )
}

export default AdminDashboard