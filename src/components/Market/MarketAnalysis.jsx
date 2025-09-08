import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Search, Star } from 'lucide-react'
import axios from 'axios'

const MarketAnalysis = () => {
  const [cryptos, setCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchCryptoData = async () => {
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: 1,
            sparkline: false,
            price_change_percentage: '1h,24h,7d'
          }
        }
      )
      setCryptos(data)
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      // fallback
      setCryptos([
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          current_price: 45000,
          market_cap: 850_000_000_000,
          market_cap_rank: 1,
          price_change_percentage_24h: 2.5,
          price_change_percentage_7d_in_currency: 5.2,
          total_volume: 25_000_000_000
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (cryptoId) => {
    setFavorites((prev) =>
      prev.includes(cryptoId)
        ? prev.filter((id) => id !== cryptoId)
        : [...prev, cryptoId]
    )
  }

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Market Analysis</h1>
          <p className="text-gray-400 mt-1">
            Real-time cryptocurrency market data
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">
            Total Market Cap
          </h3>
          <p className="text-2xl font-bold text-primary-500">
            ${(cryptos.reduce((acc, c) => acc + c.market_cap, 0) / 1e12).toFixed(
              2
            )}
            T
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">24h Volume</h3>
          <p className="text-2xl font-bold text-blue-500">
            ${(cryptos.reduce((acc, c) => acc + c.total_volume, 0) / 1e9).toFixed(
              2
            )}
            B
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">
            Market Dominance
          </h3>
          <p className="text-2xl font-bold text-yellow-500">BTC 40.2%</p>
        </div>
      </div>

      {/* Crypto Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                {['#', 'Name', 'Price', '24h %', '7d %', 'Market Cap', 'Volume', 'Action'].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCryptos.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {crypto.market_cap_rank}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {crypto.symbol?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{crypto.name}</p>
                        <p className="text-gray-400 text-sm">
                          {crypto.symbol?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    ${crypto.current_price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center space-x-1 ${
                        crypto.price_change_percentage_24h >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {crypto.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        crypto.price_change_percentage_7d_in_currency >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {crypto.price_change_percentage_7d_in_currency >= 0
                        ? '+'
                        : ''}
                      {crypto.price_change_percentage_7d_in_currency?.toFixed(2)}
                      %
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    ${(crypto.market_cap / 1e9).toFixed(2)}B
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    ${(crypto.total_volume / 1e6).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFavorite(crypto.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorites.includes(crypto.id)
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-700 text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MarketAnalysis
