import { useState, useEffect } from "react";
import { api } from "../api";
import { usePrices } from "./hooks/usePrices";
import { useLocation } from "react-router-dom";

const Transactions = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get("tab");

  const [activeTab, setActiveTab] = useState(tabFromUrl || "fund");
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState({});
  const [form, setForm] = useState({
    amount: "",
    symbol: "USDT",
    email: "",
    toAddress: "",
    fromSymbol: "USDT",
    toSymbol: "ETH",
    network: "",
  });
  const [txCost, setTxCost] = useState(null);

  // ✅ Prices hook
  const { prices, symbolMap } = usePrices();

  // ✅ Load wallets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await api.get("/api/dashboard/me");
        setWallets(userData || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ✅ Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
  };

  // ✅ Reset withdraw form when token changes
  const handleSymbolChange = (e) => {
    const newSymbol = e.target.value;
    if (activeTab === "withdraw") {
      setForm({
        amount: "",
        symbol: newSymbol,
        toAddress: "",
        network: "",
        email: "",
        fromSymbol: "USDT",
        toSymbol: "ETH",
      });
      setTxCost(null);
    } else {
      setForm({ ...form, symbol: newSymbol });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "network") {
      const coinId = symbolMap[form.symbol];
      const usdPrice = prices[coinId]?.usd || 0;
      const usdValue = Number(form.amount) * usdPrice;
      setTxCost(usdValue);
    }
  };

  const handleSubmit = async (action) => {
    setLoading(true);
    try {
      let res;
      switch (action) {
        case "fund": {
            const coinId = symbolMap[form.symbol];
            const usdPrice = prices[coinId]?.usd || 0;
            const usdValue = Number(form.amount) * usdPrice;

            res = await api.post("/api/transactions/fund", {
              amount: Number(form.amount),
              symbol: form.symbol,
              price: usdPrice,   // ✅ send price too
              value: usdValue,
              network: form.network,
            });
            break;
          }


        case "withdraw": {
          const coinId = symbolMap[form.symbol];
          const usdPrice = prices[coinId]?.usd || 0;
          const usdValue = Number(form.amount) * usdPrice;

          res = await api.post("/api/transactions/withdraw", {
            amount: Number(form.amount),
            symbol: form.symbol,
            network: form.network,
            toAddress: form.toAddress,
            price: usdPrice,
            value: usdValue,
          });
          break;
        }

        case "send":
          res = await api.post("/api/transactions/send", {
            amount: Number(form.amount),
            symbol: form.symbol,
            email: form.email,
          });
          break;

        case "swap":
          res = await api.post("/api/transactions/swap", {
            fromSymbol: form.fromSymbol,
            toSymbol: form.toSymbol,
            amount: Number(form.amount),
          });
          break;

        default:
          break;
      }

      if (res) {
        setTimeout(() => {
          alert("Balance pending blockchain confirmation...");
        }, 3000);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buttonClass =
    "w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6">
      {/* Wallet Addresses */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-3">Your Wallet Addresses</h2>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {["ETH", "BTC", "USDT"].map((coin) => (
            <div key={coin} className="bg-gray-900 p-3 rounded relative">
              <p className="text-gray-400">{coin}</p>
              <p className="break-all text-white">{wallets[coin] || "—"}</p>
              {wallets[coin] && (
                <button
                  onClick={() => copyToClipboard(wallets[coin])}
                  className="absolute top-2 right-2 text-xs text-blue-400 hover:text-blue-200"
                >
                  Copy
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-700">
        {["fund", "withdraw"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-primary-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Fund */}
      {activeTab === "fund" && (
        <div className="space-y-4 max-w-md">
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
          <select
            name="symbol"
            value={form.symbol}
            onChange={handleSymbolChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option>USDT</option>
            <option>ETH</option>
            <option>BTC</option>
          </select>
          <select
            name="network"
            value={form.network}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option value="">Select Network</option>
            {form.symbol === "BTC" && (
              <>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Lightning">Lightning</option>
              </>
            )}
            {form.symbol === "ETH" && (
              <>
                <option value="ERC20">ERC20</option>
                <option value="Arbitrum">Arbitrum</option>
              </>
            )}
            {form.symbol === "USDT" && (
              <>
                <option value="ERC20">ERC20</option>
                <option value="TRC20">TRC20</option>
                <option value="BEP20">BEP20</option>
              </>
            )}
          </select>

          {/* ✅ Show transaction cost when network is chosen */}
          {form.network && txCost && (
            <p className="text-sm text-gray-300">
              Estimated Value:{" "}
              <span className="font-semibold text-white">
                ${txCost.toFixed(2)}
              </span>
            </p>
          )}

          <button
            onClick={() => handleSubmit("fund")}
            disabled={loading || !form.amount || !form.network}
            className={`${buttonClass} bg-green-600 hover:bg-green-700`}
          >
            {loading ? "Processing..." : "Fund"}
          </button>
        </div>
      )}

      {/* Withdraw */}
      {activeTab === "withdraw" && (
        <div className="space-y-4 max-w-md">
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
          <select
            name="symbol"
            value={form.symbol}
            onChange={handleSymbolChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="USDT">USDT</option>
          </select>
          <select
            name="network"
            value={form.network}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option value="">Select Network</option>
            {form.symbol === "BTC" && (
              <>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Lightning">Lightning</option>
              </>
            )}
            {form.symbol === "ETH" && (
              <>
                <option value="ERC20">ERC20</option>
                <option value="Arbitrum">Arbitrum</option>
              </>
            )}
            {form.symbol === "USDT" && (
              <>
                <option value="ERC20">ERC20</option>
                <option value="TRC20">TRC20</option>
                <option value="BEP20">BEP20</option>
              </>
            )}
          </select>

          {/* ✅ Show transaction cost when network is chosen */}
          {form.network && txCost && (
            <p className="text-sm text-gray-300">
              Estimated Value:{" "}
              <span className="font-semibold text-white">
                ${txCost.toFixed(2)}
              </span>
            </p>
          )}

          <input
            name="toAddress"
            type="text"
            placeholder="Destination Address"
            value={form.toAddress}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
          <button
            onClick={() => handleSubmit("withdraw")}
            disabled={loading || !form.amount || !form.toAddress || !form.symbol}
            className={`${buttonClass} bg-red-600 hover:bg-red-700`}
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
