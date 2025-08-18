"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Minus, Wallet, TrendingUp, TrendingDown, RefreshCw, History, CreditCard } from "lucide-react"
import Link from "next/link"
import BottomNavigation from "@/components/bottom-navigation"

interface UserCredentials {
  username: string
  password: string
  user?: {
    username: string
    email: string
  }
  loginTime: string
}

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "game_win" | "game_loss"
  amount: number
  status: "completed" | "pending" | "failed"
  timestamp: string
  description: string
}

export default function WalletPage() {
  const [balance, setBalance] = useState<string>("Loading...")
  const [username, setUsername] = useState<string>("")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  // Mock transaction data - in real app, this would come from API
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      amount: 1000,
      status: "completed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      description: "Deposit via UPI",
    },
    {
      id: "2",
      type: "game_win",
      amount: 250,
      status: "completed",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      description: "Won in Color Prediction",
    },
    {
      id: "3",
      type: "withdrawal",
      amount: 500,
      status: "pending",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      description: "Withdrawal to Bank Account",
    },
  ])

  useEffect(() => {
    const loadUserDataAndBalance = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials")
        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials)
          setUsername(credentials.username)
          await fetchBalance(credentials.username, credentials.password)
        } else {
          setBalance("0")
          setIsLoadingBalance(false)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setBalance("Error")
        setIsLoadingBalance(false)
      }
    }

    loadUserDataAndBalance()
  }, [])

  const fetchBalance = async (username: string, password: string) => {
    try {
      setIsLoadingBalance(true)
      const response = await fetch(
        `/api/auth/balance?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      )
      const data = await response.json()

      if (data.success && data.data) {
        const balanceValue = data.data.balance || data.data.rawResponse || "0"
        setBalance(balanceValue.toString())
      } else {
        setBalance("Error")
        console.error("Balance fetch failed:", data.message)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
      setBalance("Error")
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const formatBalance = (balance: string) => {
    if (balance === "Loading..." || balance === "Error") return balance
    try {
      const num = Number.parseFloat(balance)
      if (isNaN(num)) return balance
      return num.toLocaleString()
    } catch {
      return balance
    }
  }

  const refreshBalance = async () => {
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      const credentials: UserCredentials = JSON.parse(storedCredentials)
      await fetchBalance(credentials.username, credentials.password)
    }
  }

  const formatTransactionTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus size={16} className="text-green-400" />
      case "withdrawal":
        return <Minus size={16} className="text-red-400" />
      case "game_win":
        return <TrendingUp size={16} className="text-green-400" />
      case "game_loss":
        return <TrendingDown size={16} className="text-red-400" />
      default:
        return <CreditCard size={16} className="text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors">
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <Wallet size={28} className="text-yellow-400" />
            <span className="text-yellow-400">My Wallet</span>
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-400">Welcome</p>
            <p className="font-semibold text-yellow-300">{username}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border border-yellow-400/30">
          <div className="text-center">
            <h2 className="text-lg font-medium text-black mb-2">Total Balance</h2>
            <div className="text-4xl font-bold mb-4 text-black">
              {isLoadingBalance ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <span>₹{formatBalance(balance)}</span>
              )}
            </div>
            <p className="text-black/80 mb-4">Available for withdrawal</p>
            <button
              onClick={refreshBalance}
              disabled={isLoadingBalance}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg text-sm transition-colors disabled:opacity-50 text-black font-medium"
            >
              <RefreshCw size={16} className={isLoadingBalance ? "animate-spin" : ""} />
              <span>{isLoadingBalance ? "Refreshing..." : "Refresh Balance"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons - Smaller Size */}
        <div className="grid grid-cols-2 gap-4">
          {/* Deposit Button */}
          <Link
            href="/deposit"
            className="group bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 shadow-lg text-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/30 transition-colors border border-yellow-500/30 group-hover:scale-110 duration-200">
                <Plus size={24} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-1">Deposit</h3>
                <p className="text-gray-300 text-sm">Add funds to wallet</p>
              </div>
            </div>
          </Link>

          {/* Withdraw Button */}
          <Link
            href="/withdraw"
            className="group bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 shadow-lg text-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/30 transition-colors border border-yellow-500/30 group-hover:scale-110 duration-200">
                <Minus size={24} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-1">Withdraw</h3>
                <p className="text-gray-300 text-sm">Transfer to account</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats - Smaller */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30 text-center shadow-lg">
            <TrendingUp size={20} className="text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-400">₹2,450</p>
            <p className="text-xs text-gray-400">Total Deposits</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30 text-center shadow-lg">
            <TrendingDown size={20} className="text-red-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-400">₹1,200</p>
            <p className="text-xs text-gray-400">Total Withdrawals</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30 text-center shadow-lg">
            <Plus size={20} className="text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-yellow-400">₹850</p>
            <p className="text-xs text-gray-400">Game Winnings</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30 text-center shadow-lg">
            <History size={20} className="text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-400">24</p>
            <p className="text-xs text-gray-400">Transactions</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-yellow-400 flex items-center space-x-2">
              <History size={24} />
              <span>Recent Transactions</span>
            </h3>
            <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">View All</button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                <History size={32} className="text-yellow-500/50" />
              </div>
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-yellow-500/20 hover:bg-black/60 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-black/60 rounded-full border border-yellow-500/20">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-400">{formatTransactionTime(transaction.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${transaction.type === "deposit" || transaction.type === "game_win" ? "text-green-400" : "text-red-400"}`}
                    >
                      {transaction.type === "deposit" || transaction.type === "game_win" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className={`text-sm capitalize ${getStatusColor(transaction.status)}`}>{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30 shadow-lg">
          <h4 className="text-lg font-semibold mb-2 text-blue-400">🔒 Security Notice</h4>
          <p className="text-blue-200 text-sm">
            Your wallet is protected with bank-level security. All transactions are encrypted and monitored 24/7. Never
            share your login credentials with anyone.
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
