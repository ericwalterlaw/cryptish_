import { useEffect, useState } from 'react'
import { api } from '../api'
import { Trash2 } from 'lucide-react'

const PortfolioManager = ({ userId, onChange }) => {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const data = await api.get(`/api/admin/users/${userId}/portfolio`)
      setPortfolio(data)
    } catch (err) {
      console.error('Error fetching portfolio:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPortfolio = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    await api.post(`/api/admin/users/${userId}/portfolio`, {
      symbol: formData.get('symbol'),
      name: formData.get('name'),
      amount: parseFloat(formData.get('amount')),
      averagePrice: parseFloat(formData.get('averagePrice')),
      totalInvested: parseFloat(formData.get('totalInvested'))
    })

    e.target.reset()
    fetchPortfolio()
    onChange()
  }

  const handleDelete = async (symbol) => {
    await api.delete(`/api/admin/users/${userId}/portfolio/${symbol}`)
    fetchPortfolio()
    onChange()
  }

  if (loading) return <p className="text-gray-400">Loading portfolio...</p>

  return (
    <div className="mt-6">
      <h4 className="text-lg text-white mb-4">Portfolio</h4>

      <table className="w-full mb-4">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left text-gray-300">Symbol</th>
            <th className="px-4 py-2 text-left text-gray-300">Amount</th>
            <th className="px-4 py-2 text-left text-gray-300">Avg Price</th>
            <th className="px-4 py-2 text-left text-gray-300">Total Invested</th>
            <th className="px-4 py-2 text-left text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {portfolio.map((p) => (
            <tr key={p._id}>
              <td className="px-4 py-2 text-white">{p.symbol}</td>
              <td className="px-4 py-2 text-white">{p.amount}</td>
              <td className="px-4 py-2 text-white">${p.averagePrice}</td>
              <td className="px-4 py-2 text-white">${p.totalInvested}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(p.symbol)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Portfolio Form */}
      <form onSubmit={handleAddPortfolio} className="space-y-2">
        <input name="symbol" placeholder="Symbol (BTC)" className="w-full p-2 bg-gray-700 text-white rounded" />
        <input name="name" placeholder="Name (Bitcoin)" className="w-full p-2 bg-gray-700 text-white rounded" />
        <input name="amount" type="number" step="0.01" placeholder="Amount" className="w-full p-2 bg-gray-700 text-white rounded" />
        <input name="averagePrice" type="number" step="0.01" placeholder="Average Price" className="w-full p-2 bg-gray-700 text-white rounded" />
        <input name="totalInvested" type="number" step="0.01" placeholder="Total Invested" className="w-full p-2 bg-gray-700 text-white rounded" />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Add/Update Portfolio
        </button>
      </form>
    </div>
  )
}

export default PortfolioManager
