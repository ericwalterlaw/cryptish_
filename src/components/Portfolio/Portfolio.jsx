import { api } from '../../api'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Plus, Minus, Wallet, PieChart } from 'lucide-react'

const Portfolio = ({ user }) => {
  const [holdings, setHoldings] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  const [totalPnL, setTotalPnL] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedHolding, setSelectedHolding] = useState(null)

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const response = await api.get('/api/portfolio')
      
      setHoldings(response.holdings)
      setTotalValue(response.totalValue)
      setTotalPnL(response.totalPnL)
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      // Mock data for demo
      setHoldings([
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 0.5,
          averagePrice: 42000,
          currentPrice: 45000,
          value: 22500,
          pnl: 1500,
          pnlPercent: 7.14
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          amount: 2.5,
          averagePrice: 3000,
          currentPrice: 3200,
          value: 8000,
          pnl: 500,
          pnlPercent: 6.67
        }
      ])
      setTotalValue(30500)
      setTotalPnL(2000)
    } finally {
      setLoading(false)
    }
  }

  const getPortfolioAllocation = () => {
    return holdings.map(holding => ({
      name: holding.symbol,
      value: holding.value,
      percentage: ((holding.value / totalValue) * 100).toFixed(1)
    }))
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
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Portfolio Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-primary-500" />
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total P&L</p>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                    </p>
                  </div>
                  {totalPnL >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Holdings</p>
                    <p className="text-2xl font-bold text-white">{holdings.length}</p>
                  </div>
                  <PieChart className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Allocation</h3>
          <div className="space-y-3">
            {getPortfolioAllocation().map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-white font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{item.percentage}%</p>
                  <p className="text-gray-400 text-sm">${item.value.toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Your Holdings</h3>
        </div>
        
        {holdings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Asset</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Avg Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Current Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Value</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">P&L</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {holdings.map((holding, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedHolding(selectedHolding === index ? null : index)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {holding.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{holding.name}</p>
                          <p className="text-gray-400 text-sm">{holding.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {holding.amount.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 text-white">
                      ${holding.averagePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-white">
                      ${holding.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ${holding.value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <p className="font-semibold">
                          {holding.pnl >= 0 ? '+' : ''}${holding.pnl.toFixed(2)}
                        </p>
                        <p className="text-sm">
                          {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Holdings Yet</h3>
            <p className="text-gray-400 mb-6">Start building your crypto portfolio</p>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Buy Your First Crypto
            </button>
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedHolding !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {holdings[selectedHolding].name} Details
              </h3>
              <button
                onClick={() => setSelectedHolding(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Holdings</p>
                <p className="text-white text-lg font-semibold">
                  {holdings[selectedHolding].amount.toFixed(6)} {holdings[selectedHolding].symbol}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Avg Buy Price</p>
                  <p className="text-white font-semibold">
                    ${holdings[selectedHolding].averagePrice.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Current Price</p>
                  <p className="text-white font-semibold">
                    ${holdings[selectedHolding].currentPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Unrealized P&L</p>
                <div className={`${holdings[selectedHolding].pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <p className="text-lg font-bold">
                    {holdings[selectedHolding].pnl >= 0 ? '+' : ''}${holdings[selectedHolding].pnl.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    {holdings[selectedHolding].pnl >= 0 ? '+' : ''}{holdings[selectedHolding].pnlPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio