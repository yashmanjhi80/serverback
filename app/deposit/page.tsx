"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, CreditCard, Smartphone, Building, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
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

interface PaymentResponse {
  status: number
  msg: string
  data: {
    type: string
    pay_url: string
  }
}

export default function DepositPage() {
  const [balance, setBalance] = useState<string>("Loading...")
  const [username, setUsername] = useState<string>("")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [depositAmount, setDepositAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("upi")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState("")

  const MIN_DEPOSIT = 100
  const MAX_DEPOSIT = 50000

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: <Smartphone size={20} />, description: "PhonePe, GPay, Paytm" },
    { id: "netbanking", name: "Net Banking", icon: <Building size={20} />, description: "All major banks" },
    { id: "card", name: "Debit/Credit Card", icon: <CreditCard size={20} />, description: "Visa, Mastercard" },
  ]

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000]

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

  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `ORD${timestamp}${random}`
  }

  const handleDeposit = async () => {
    const amount = Number.parseInt(depositAmount, 10)

    // Validation
    if (!amount || amount < MIN_DEPOSIT) {
      setPaymentError(`Minimum deposit amount is ₹${MIN_DEPOSIT}`)
      return
    }

    if (amount > MAX_DEPOSIT) {
      setPaymentError(`Maximum deposit amount is ₹${MAX_DEPOSIT}`)
      return
    }

    if (!username) {
      setPaymentError("Please login to make a deposit")
      return
    }

    setIsProcessingPayment(true)
    setPaymentError("")
    setPaymentSuccess("")

    try {
      const orderId = generateOrderId()

      const response = await fetch("/api/auth/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          username,
          ip: "0.0.0.0",
          remark: `Deposit for user ${username} via ${selectedMethod}`,
        }),
      })

      const paymentData: PaymentResponse = await response.json()

      if (paymentData.status === 1 && paymentData.data?.pay_url) {
        setPaymentSuccess("Redirecting to payment gateway...")

        window.open(paymentData.data.pay_url, "_blank", "noopener,noreferrer")

        setDepositAmount("")

        setTimeout(() => {
          setPaymentSuccess("Payment initiated successfully! Complete the payment in the new window.")
        }, 1000)
      } else {
        setPaymentError(paymentData.msg || "Failed to create payment")
      }
    } catch (error) {
      console.error("Payment creation error:", error)
      setPaymentError("Failed to create payment. Please try again.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDepositAmount(value)
    setPaymentError("")
    setPaymentSuccess("")
  }

  const refreshBalance = async () => {
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      const credentials: UserCredentials = JSON.parse(storedCredentials)
      await fetchBalance(credentials.username, credentials.password)
    }
  }

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
            <Plus size={28} className="text-yellow-400" />
            <span className="text-yellow-400">Deposit Funds</span>
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="font-bold text-yellow-300">
              {isLoadingBalance ? "Loading..." : `₹${formatBalance(balance)}`}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Current Balance Card */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border border-yellow-400/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-black mb-1">Current Balance</h2>
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

        {/* Payment Status Messages */}
        {paymentError && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-red-300">{paymentError}</p>
          </div>
        )}

        {paymentSuccess && (
          <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 backdrop-blur-sm flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <p className="text-green-300 flex items-center gap-2">
              {paymentSuccess}
              {paymentSuccess.includes("new window") && <ExternalLink size={16} />}
            </p>
          </div>
        )}

        {/* Deposit Form */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-yellow-400 flex items-center space-x-2">
            <Plus size={24} />
            <span>Add Money to Wallet</span>
          </h3>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-yellow-300 mb-2">Enter Amount</label>
            <input
              type="number"
              placeholder={`Enter amount (₹${MIN_DEPOSIT} - ₹${MAX_DEPOSIT.toLocaleString()})`}
              value={depositAmount}
              onChange={handleDepositAmountChange}
              min={MIN_DEPOSIT}
              max={MAX_DEPOSIT}
              className="w-full px-4 py-4 bg-black/40 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
            />
            <p className="text-sm text-gray-400 mt-2">
              Minimum: ₹{MIN_DEPOSIT} | Maximum: ₹{MAX_DEPOSIT.toLocaleString()}
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-yellow-300 mb-3">Quick Select</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDepositAmount(amount.toString())}
                  className="px-4 py-3 bg-black/40 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-sm transition-colors text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/50 font-medium"
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-yellow-300 mb-3">Select Payment Method</label>
            <div className="grid md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
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
                  <p className="text-sm opacity-80">{method.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            disabled={
              !depositAmount ||
              Number.parseInt(depositAmount) < MIN_DEPOSIT ||
              Number.parseInt(depositAmount) > MAX_DEPOSIT ||
              isProcessingPayment
            }
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-lg"
          >
            {isProcessingPayment ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Deposit ₹{depositAmount || "0"}</span>
              </>
            )}
          </button>
        </div>

        {/* Security & Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <h4 className="text-lg font-semibold mb-3 text-yellow-400">🔒 Secure Payments</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• 256-bit SSL encryption</li>
              <li>• PCI DSS compliant</li>
              <li>• Instant processing</li>
              <li>• 24/7 fraud monitoring</li>
            </ul>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <h4 className="text-lg font-semibold mb-3 text-yellow-400">⚡ Quick Facts</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Instant balance update</li>
              <li>• No hidden charges</li>
              <li>• Multiple payment options</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">How to Deposit</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 font-bold">1.</span>
                <span>Enter the amount you want to deposit</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 font-bold">2.</span>
                <span>Select your preferred payment method</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 font-bold">3.</span>
                <span>Click "Deposit" to proceed to payment gateway</span>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 font-bold">4.</span>
                <span>Complete payment using your chosen method</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 font-bold">5.</span>
                <span>Your balance will be updated instantly</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 font-bold">6.</span>
                <span>Start playing your favorite games!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
