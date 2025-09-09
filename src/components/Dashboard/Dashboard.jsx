import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";


const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    balance: 0,
    portfolioValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topCryptos, setTopCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


  useEffect(() => {
    fetchDashboardData();
    fetchTopCryptos();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/dashboard");
      setStats(response.stats);
      setRecentTransactions(response.recentTransactions);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchTopCryptos = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTopCryptos(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setTopCryptos([
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          current_price: 45000,
          price_change_percentage_24h: 2.5,
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          current_price: 3200,
          price_change_percentage_24h: -1.8,
        },
        {
          id: "binancecoin",
          name: "BNB",
          symbol: "BNB",
          current_price: 320,
          price_change_percentage_24h: 0.9,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back!
        </h1>
        <p className="text-primary-100 text-sm sm:text-base">
          Here's what's happening with your crypto portfolio
        </p>
      </div>

      
  

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Portfolio Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                ${(stats.balance + stats.portfolioValue).toFixed(2)}
              </p>
            </div>
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cash Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                ${stats.balance.toFixed(2)}
              </p>
            </div>
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Crypto Holdings</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                ${stats.portfolioValue.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total P&L</p>
              <p
                className={`text-xl sm:text-2xl font-bold ${
                  stats.totalPnL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ${stats.totalPnL.toFixed(2)}
              </p>
              <p
                className={`text-sm ${
                  stats.totalPnLPercent >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {stats.totalPnLPercent >= 0 ? "+" : ""}
                {stats.totalPnLPercent.toFixed(2)}%
              </p>
            </div>
            {stats.totalPnL >= 0 ? (
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            ) : (
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Transactions */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                   <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        tx.type === "buy" || tx.type === "deposit"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {tx.type === "buy" || tx.type === "deposit" ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">
                        {tx.type.toUpperCase()} {tx.symbol}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-sm sm:text-base">
                      {tx.amount} {tx.symbol}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      ${tx.value.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No transactions yet</p>
                <p className="text-gray-500 text-sm">
                  Your transactions will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Cryptocurrencies */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Top Cryptocurrencies
          </h2>
          <div className="space-y-4">
            {topCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    {crypto.symbol?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {crypto.name}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {crypto.symbol?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium text-sm sm:text-base">
                    ${crypto.current_price?.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs sm:text-sm ${
                      crypto.price_change_percentage_24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                    {crypto.price_change_percentage_24h?.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
