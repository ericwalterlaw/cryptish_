import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { api } from "../api"

const TransactionHistory = ({ transactions, onDelete }) => {
  return (
    <div className="mb-6">
      <h4 className="text-lg text-white mb-3">Recent Transactions</h4>
      <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-gray-300 text-left">Type</th>
              <th className="p-2 text-gray-300 text-left">Symbol</th>
              <th className="p-2 text-gray-300 text-left">Amount</th>
              <th className="p-2 text-gray-300 text-left">Price</th>
              <th className="p-2 text-gray-300 text-left">Value</th>
              <th className="p-2 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((tx) => (
              <tr key={tx._id} className="text-white">
                <td className="p-2 capitalize">{tx.type}</td>
                <td className="p-2">{tx.symbol}</td>
                <td className="p-2">{tx.amount}</td>
                <td className="p-2">${tx.price}</td>
                <td className="p-2">${tx.value}</td>
                <td className="p-2 text-center">
                 <button
                        onClick={() => onDelete?.(tx._id)}
                        className="p-1 bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                        <Trash2 className="w-4 h-4 text-white" />
                </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 p-3">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


export default TransactionHistory
