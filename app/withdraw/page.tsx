"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Minus, Building, Smartphone, CheckCircle, AlertCircle, Clock } from "lucide-react"
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

interface WithdrawalMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  processingTime: string
  minAmount: number
  maxAmount: number
  charges: string
}

export default function WithdrawPage() {
  const [balance, setBalance] = useState<string>("Loading...")
  const [username, setUsername] = useState<string>("")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("bank")
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    upiId: "",
  })
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false)
  const [withdrawalError, setWithdrawalError] = useState("")
  const [withdrawalSuccess, setWithdrawalSuccess] = useState("")

  const withdrawalMethods: WithdrawalMethod[] = [
    {
      id: "bank",
      name: "Bank Transfer",
      icon: <Building size={20} />,
      description: "Direct bank account transfer",
      processingTime: "2-4 hours",
      minAmount: 100,
      maxAmount: 25000,
      charges: "Free",
    },
    {
      id: "upi",
      name: "UPI",
      icon: <Smartphone size={20} />,
      description: "Instant UPI transfer",
      processingTime: "5-10 minutes",
      minAmount: 50,
      maxAmount: 10000,
      charges: "Free",
    },
  ]

  const quickAmounts = [100, 500, 1000, 2500, 5000]

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

  const getCurrentMethod = () => {
    return withdrawalMethods.find((method) => method.id === selectedMethod) || withdrawalMethods[0]
  }

  const handleWithdraw = async () => {
    const amount = Number.parseInt(withdrawAmount, 10)
    const currentMethod = getCurrentMethod()
    const currentBalance = Number.parseFloat(balance)

    // Validation
    if (!amount || amount < currentMethod.minAmount) {
      setWithdrawalError(`Minimum withdrawal amount is ₹${currentMethod.minAmount}`)
      return
    }

    if (amount > currentMethod.maxAmount) {
      setWithdrawalError(`Maximum withdrawal amount is ₹${currentMethod.maxAmount.toLocaleString()}`)
      return
    }

    if (isNaN(currentBalance) || amount > currentBalance) {
      setWithdrawalError("Insufficient balance for this withdrawal")
      return
    }

    if (!username) {
      setWithdrawalError("Please login to make a withdrawal")
      return
    }

    // Validate account details
    if (selectedMethod === "bank") {
      if (!accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountHolderName) {
        setWithdrawalError("Please fill in all bank account details")
        return
      }
    } else if (selectedMethod === "upi") {
      if (!accountDetails.upiId) {
        setWithdrawalError("Please enter your UPI ID")
        return
      }
    }

    setIsProcessingWithdrawal(true)
    setWithdrawalError("")
    setWithdrawalSuccess("")

    try {
      // Simulate API call for withdrawal
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For now, we'll just show a success message
      // In a real implementation, you would call your withdrawal API here
      setWithdrawalSuccess(
        `Withdrawal request of ₹${amount.toLocaleString()} has been submitted successfully! Processing time: ${currentMethod.processingTime}`,
      )
      setWithdrawAmount("")
      setAccountDetails({
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        upiId: "",
      })

      // Refresh balance after successful withdrawal
      setTimeout(() => {
        fetchBalance(username, "")
      }, 1000)
    } catch (error) {
      console.error("Withdrawal error:", error)
      setWithdrawalError("Failed to process withdrawal. Please try again.")
    } finally {
      setIsProcessingWithdrawal(false)
    }
  }

  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWithdrawAmount(value)
    setWithdrawalError("")
    setWithdrawalSuccess("")
  }

  const refreshBalance = async () => {
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      const credentials: UserCredentials = JSON.parse(storedCredentials)
      await fetchBalance(credentials.username, credentials.password)
    }
  }

  const currentMethod = getCurrentMethod()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/wallet"
            className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Wallet</span>
          </Link>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <Minus size={28} className="text-yellow-400" />
            <span className="text-yellow-400">Withdraw Funds</span>
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-400">Available</p>
            <p className="font-bold text-yellow-300">
              {isLoadingBalance ? "Loading..." : `₹${formatBalance(balance)}`}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Available Balance Card */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border border-yellow-400/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-black mb-1">Available Balance</h2>
              <div className="text-3xl font-bold text-black">
                {isLoadingBalance ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <span>₹{formatBalance(balance)}</span>
                )}
              </div>
            </div>
            <button
              onClick={refreshBalance}
              disabled={isLoadingBalance}
              className="px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg text-sm transition-colors disabled:opacity-50 text-black font-medium"
            >
              {isLoadingBalance ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Withdrawal Status Messages */}
        {withdrawalError && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-red-300">{withdrawalError}</p>
          </div>
        )}

        {withdrawalSuccess && (
          <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 backdrop-blur-sm flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <p className="text-green-300">{withdrawalSuccess}</p>
          </div>
        )}

        {/* Withdrawal Form */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-yellow-400 flex items-center space-x-2">
            <Minus size={24} />
            <span>Withdraw Money</span>
          </h3>

          {/* Withdrawal Methods */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-yellow-300 mb-3">Select Withdrawal Method</label>
            <div className="grid md:grid-cols-2 gap-4">
              {withdrawalMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                    selectedMethod === method.id
                      ? "bg-yellow-500/20 border-yellow-400 text-yellow-300"
                      : "bg-black/40 border-yellow-500/30 text-gray-300 hover:bg-black/60 hover:border-yellow-400/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {method.icon}
                    <span className="font-semibold">{method.name}</span>
                  </div>
                  <p className="text-sm opacity-80 mb-1">{method.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{method.processingTime}</span>
                    </span>
                    <span>Min: ₹{method.minAmount}</span>
                    <span>Max: ₹{method.maxAmount.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-yellow-300 mb-2">Withdrawal Amount</label>
            <input
              type="number"
              placeholder={`Enter amount (₹${currentMethod.minAmount} - ₹${currentMethod.maxAmount.toLocaleString()})`}
              value={withdrawAmount}
              onChange={handleWithdrawAmountChange}
              min={currentMethod.minAmount}
              max={currentMethod.maxAmount}
              className="w-full px-4 py-4 bg-black/40 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
            />
            <p className="text-sm text-gray-400 mt-2">
              Minimum: ₹{currentMethod.minAmount} | Maximum: ₹{currentMethod.maxAmount.toLocaleString()} | Charges:{" "}
              {currentMethod.charges}
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-yellow-300 mb-3">Quick Select</label>
            <div className="grid grid-cols-5 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setWithdrawAmount(amount.toString())}
                  disabled={amount > currentMethod.maxAmount}
                  className="px-4 py-3 bg-black/40 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-sm transition-colors text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-yellow-300 mb-3">
              {selectedMethod === "bank" ? "Bank Account Details" : "UPI Details"}
            </label>

            {selectedMethod === "bank" ? (
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  value={accountDetails.accountHolderName}
                  onChange={(e) => setAccountDetails({ ...accountDetails, accountHolderName: e.target.value })}
                  className="px-4 py-3 bg-black/40 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  value={accountDetails.accountNumber}
                  onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                  className="px-4 py-3 bg-black/40 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={accountDetails.ifscCode}
                  onChange={(e) => setAccountDetails({ ...accountDetails, ifscCode: e.target.value.toUpperCase() })}
                  className="px-4 py-3 bg-black/40 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            ) : (
              <input
                type="text"
                placeholder="UPI ID (e.g., username@paytm)"
                value={accountDetails.upiId}
                onChange={(e) => setAccountDetails({ ...accountDetails, upiId: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            )}
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={
              !withdrawAmount ||
              Number.parseInt(withdrawAmount) < currentMethod.minAmount ||
              Number.parseInt(withdrawAmount) > currentMethod.maxAmount ||
              Number.parseInt(withdrawAmount) > Number.parseFloat(balance) ||
              isProcessingWithdrawal ||
              (selectedMethod === "bank" &&
                (!accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountHolderName)) ||
              (selectedMethod === "upi" && !accountDetails.upiId)
            }
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-lg"
          >
            {isProcessingWithdrawal ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Processing Withdrawal...</span>
              </>
            ) : (
              <>
                <Minus size={20} />
                <span>Withdraw ₹{withdrawAmount || "0"}</span>
              </>
            )}
          </button>
        </div>

        {/* Important Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <h4 className="text-lg font-semibold mb-3 text-yellow-400">⚠️ Important Notes</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Withdrawals are processed during business hours</li>
              <li>• Minimum withdrawal varies by method</li>
              <li>• Account details must match your registered name</li>
              <li>• Processing times may vary during peak hours</li>
            </ul>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <h4 className="text-lg font-semibold mb-3 text-yellow-400">🔒 Security</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• All withdrawals are verified</li>
              <li>• SMS/Email confirmation required</li>
              <li>• Secure encrypted transactions</li>
              <li>• 24/7 fraud monitoring</li>
            </ul>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
