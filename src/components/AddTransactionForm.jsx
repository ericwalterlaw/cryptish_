import { api } from "../api"

const AddTransactionForm = ({ userId, onAdd }) => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const tx = {
      type: formData.get("type"),
      symbol: formData.get("symbol"),
      amount: parseFloat(formData.get("amount")),
      price: parseFloat(formData.get("price"))
    }

    try {
      const res = await api.post(`/api/admin/users/${userId}/transactions`, tx)
      e.target.reset()
      onAdd?.(res) // push into shared list
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  return (
    <div className="mb-6">
      <h4 className="text-lg text-white mb-3">Add Transaction</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <select name="type" className="p-2 bg-gray-700 text-white rounded">
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <input
          name="symbol"
          placeholder="Symbol (e.g. BTC)"
          className="p-2 bg-gray-700 text-white rounded"
        />
        <input
          name="amount"
          type="number"
          step="0.00000000001"
          placeholder="Amount"
          className="p-2 bg-gray-700 text-white rounded"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          className="p-2 bg-gray-700 text-white rounded"
        />
        <button
          type="submit"
          className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default AddTransactionForm
