"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Minus, CreditCard, TrendingUp, Eye, EyeOff, RefreshCw } from "lucide-react"
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

export default function WalletPage() {
  const [balance, setBalance] = useState<string>("Loading...")
  const [username, setUsername] = useState<string>("")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [showBalance, setShowBalance] = useState(true)

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

      if (data.success) {
        const balanceValue = data.balance || data.rawResponse || "0"
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

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960 text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <Link href="/home" className="text-yellow-300 hover:text-yellow-200 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-yellow-400">My Wallet</h1>
          <button
            onClick={refreshBalance}
            disabled={isLoadingBalance}
            className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={isLoadingBalance ? "animate-spin" : ""} />
          </button>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border border-yellow-400/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-black mb-1">Total Balance</h2>
              <div className="flex items-center space-x-3">
                <div className="text-3xl font-bold text-black">
                  {showBalance ? (
                    isLoadingBalance ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <span>₹{formatBalance(balance)}</span>
                    )
                  ) : (
                    <span>₹****</span>
                  )}
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors"
                >
                  {showBalance ? <EyeOff size={20} className="text-black" /> : <Eye size={20} className="text-black" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-black/70">User</p>
              <p className="font-semibold text-black">{username || "Guest"}</p>
            </div>
          </div>

          {/* Withdraw Button */}
          <Link
            href="/withdraw"
            className="w-full bg-black/20 hover:bg-black/30 text-black font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Minus size={20} />
            <span>Withdraw</span>
          </Link>
        </div>

        {/* Quick Actions - Smaller Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/deposit"
            className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 shadow-lg text-center group"
          >
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-500/30 transition-colors border border-yellow-400/30">
              <Plus size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-1">Deposit</h3>
            <p className="text-gray-300 text-sm">Add money to wallet</p>
          </Link>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 shadow-lg text-center group cursor-pointer">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-500/30 transition-colors border border-yellow-400/30">
              <TrendingUp size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-1">History</h3>
            <p className="text-gray-300 text-sm">Transaction history</p>
          </div>
        </div>

        {/* Stats Grid - Smaller */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 text-center shadow-lg">
            <CreditCard size={20} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-yellow-400">₹0</p>
            <p className="text-xs text-gray-400">Today's Deposit</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 text-center shadow-lg">
            <Minus size={20} className="text-red-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-red-400">₹0</p>
            <p className="text-xs text-gray-400">Today's Withdraw</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 text-center shadow-lg">
            <TrendingUp size={20} className="text-green-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-400">₹0</p>
            <p className="text-xs text-gray-400">Today's Profit</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 text-center shadow-lg">
            <Plus size={20} className="text-blue-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-blue-400">₹0</p>
            <p className="text-xs text-gray-400">Total Bonus</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/30">
                <CreditCard size={32} className="text-yellow-400" />
              </div>
              <p className="text-gray-400">No transactions yet</p>
              <p className="text-sm text-gray-500 mt-2">Your transaction history will appear here</p>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">🔒 Security & Support</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-yellow-400">Security Features</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• 256-bit SSL encryption</li>
                <li>• Two-factor authentication</li>
                <li>• Real-time fraud monitoring</li>
                <li>• Secure payment processing</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2 text-yellow-400">Support</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• 24/7 customer support</li>
                <li>• Instant transaction processing</li>
                <li>• Multiple payment methods</li>
                <li>• Quick dispute resolution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
