"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, FileText, Plus, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import BottomNavigation from "@/components/bottom-navigation"

const presetAmounts = [
  { amount: 100, bonus: 15 },
  { amount: 200, bonus: 60 },
  { amount: 300, bonus: 90 },
  { amount: 500, bonus: 175 },
  { amount: 1000, bonus: 450 },
  { amount: 2000, bonus: 900 },
  { amount: 3000, bonus: 1200 },
  { amount: 5000, bonus: 1500 },
  { amount: 10000, bonus: 3000 },
  { amount: 20000, bonus: 4500 },
  { amount: 30000, bonus: 6000 },
  { amount: 50000, bonus: 7500 },
]

interface UserCredentials {
  username: string
  password: string
  user?: {
    username: string
    email: string
  }
  loginTime: string
}

export default function DepositPage() {
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [selectedPromotion, setSelectedPromotion] = useState("bonus")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("LGPAY")
  const [username, setUsername] = useState<string>("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState("")

  const MIN_DEPOSIT = 100
  const MAX_DEPOSIT = 50000

  useEffect(() => {
    // Load user credentials
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      const credentials: UserCredentials = JSON.parse(storedCredentials)
      setUsername(credentials.username)
    }
  }, [])

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setPaymentError("")
    setPaymentSuccess("")
  }

  const handlePromotionSelect = (promotion: string) => {
    setSelectedPromotion(promotion)
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `ORD${timestamp}${random}`
  }

  const handlePayment = async () => {
    // Validation
    if (!selectedAmount || selectedAmount < MIN_DEPOSIT) {
      setPaymentError(`Minimum deposit amount is ₹${MIN_DEPOSIT}`)
      return
    }

    if (selectedAmount > MAX_DEPOSIT) {
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
      const storedCredentials = localStorage.getItem("userCredentials")

      if (!storedCredentials) {
        setPaymentError("Please login to continue")
        return
      }

      const credentials: UserCredentials = JSON.parse(storedCredentials)

      const response = await fetch("/api/auth/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount: selectedAmount,
          username: credentials.username,
          password: credentials.password,
          ip: "0.0.0.0",
          remark: `Deposit for user ${credentials.username} via ${selectedPaymentMethod}`,
        }),
      })

      const paymentData = await response.json()

      if (paymentData.status === 1 && paymentData.data?.pay_url) {
        setPaymentSuccess("Redirecting to payment gateway...")

        // Open payment URL in new window
        window.open(paymentData.data.pay_url, "_blank", "noopener,noreferrer")

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setSelectedAmount(value)
    setPaymentError("")
    setPaymentSuccess("")
  }

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960 to-burgundy-900 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 shadow-lg">
        <Link
          href="/wallet"
          className="flex items-center justify-center w-10 h-10 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>

        <h1 className="text-white text-lg font-semibold text-center flex-1 px-2">Deposit</h1>

        <Link
          href="/history"
          variant="ghost"
          size="icon"
          className="text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200"
        >
          <FileText className="h-5 w-5" />
        </Link>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Payment Status Messages */}
        {paymentError && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm flex items-center space-x-3 mb-4">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-red-300">{paymentError}</p>
          </div>
        )}

        {paymentSuccess && (
          <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 backdrop-blur-sm flex items-center space-x-3 mb-4">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <p className="text-green-300">{paymentSuccess}</p>
          </div>
        )}

        {/* Deposit Amount Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-sm font-medium">Deposit Amount</span>
            <div className="text-gray-300 text-xs">
              <span>Min: ₹{MIN_DEPOSIT}</span>
              <span className="ml-3">Max: ₹{MAX_DEPOSIT.toLocaleString()}</span>
            </div>
          </div>

          {/* Amount Input Field */}
          <div className="mb-6">
            <Input
              type="number"
              value={selectedAmount}
              onChange={handleAmountChange}
              min={MIN_DEPOSIT}
              max={MAX_DEPOSIT}
              className="w-full text-yellow-400 text-2xl font-bold text-center py-4 h-auto bg-black/60 border-yellow-500/30 focus:border-yellow-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Preset Amount Cards */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {presetAmounts.map((preset) => (
              <div
                key={preset.amount}
                className={`relative cursor-pointer font-medium text-center py-3 px-4 rounded-3xl text-xs transition-all duration-300 ${
                  selectedAmount === preset.amount
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-400/30"
                    : "bg-black/60 border-yellow-500/30 text-white hover:bg-black/80 hover:border-yellow-400/50"
                }`}
                onClick={() => handleAmountSelect(preset.amount)}
              >
                <div
                  className={`absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full font-semibold leading-none ${
                    selectedAmount === preset.amount ? "bg-black text-yellow-400" : "bg-yellow-500 text-black"
                  }`}
                >
                  +{preset.bonus}
                </div>
                <div className="font-bold text-xs">₹{preset.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mb-6">
          <h3 className="text-white text-sm font-medium mb-3">Payment Methods</h3>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {["LGPAY", "FPAY", "STARGO"].map((method) => (
              <div
                key={method}
                className={`rounded-lg p-3 text-center cursor-pointer transition-all duration-200 border ${
                  selectedPaymentMethod === method
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-400 text-black"
                    : "bg-black/60 border-yellow-500/30 text-white hover:bg-black/80 hover:border-yellow-400/50"
                }`}
                onClick={() => handlePaymentMethodSelect(method)}
              >
                <div className="font-semibold text-sm">{method}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit Event Section */}
        <div className="mb-6">
          <h3 className="text-white text-sm font-medium mb-3">
            Deposit Event<span className="text-yellow-400 ml-1">*</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {/* Promotion Option */}
            <div
              className={`rounded-lg p-4 cursor-pointer relative border transition-all duration-200 ${
                selectedPromotion === "bonus"
                  ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-400 text-black"
                  : "bg-black/60 border-yellow-500/30 text-white hover:bg-black/80 hover:border-yellow-400/50"
              }`}
              onClick={() => handlePromotionSelect("bonus")}
            >
              <div className="text-center">
                <h4 className={`font-bold text-sm ${selectedPromotion === "bonus" ? "text-black" : "text-yellow-400"}`}>
                  Deposit Cash
                </h4>
                <h4 className={`font-bold text-sm ${selectedPromotion === "bonus" ? "text-black" : "text-yellow-400"}`}>
                  Bonus Multiplier
                </h4>
              </div>
            </div>

            {/* No Promotion Option */}
            <div
              className={`rounded-lg p-4 cursor-pointer border transition-all duration-200 ${
                selectedPromotion === "none"
                  ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-400 text-black"
                  : "bg-black/60 border-yellow-500/30 text-white hover:bg-black/80 hover:border-yellow-400/50"
              }`}
              onClick={() => handlePromotionSelect("none")}
            >
              <div className="text-center">
                <h4
                  className={`font-semibold text-sm ${selectedPromotion === "none" ? "text-black" : "text-gray-300"}`}
                >
                  No promotion
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="mb-6">
          <Button
            className="w-full bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black font-bold py-4 px-24 rounded-full text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
            size="lg"
            onClick={handlePayment}
            disabled={
              isProcessingPayment || !selectedAmount || selectedAmount < MIN_DEPOSIT || selectedAmount > MAX_DEPOSIT
            }
          >
            {isProcessingPayment ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Pay Now ₹{selectedAmount.toLocaleString()}</span>
              </>
            )}
          </Button>
        </div>

        {/* Promotional Text */}
        <div className="mb-6 space-y-4">
          <p className="text-yellow-400 text-sm leading-relaxed">
            To participate in this promotion, your withdrawal must meet the wagering requirements.
          </p>

          {/* Additional Information */}
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
            <div className="space-y-2 text-sm text-white">
              <div>
                <span className="text-yellow-400 font-semibold">1.</span> Congratulations on obtaining the "
                <span className="text-yellow-400">Deposit Cash Bonus Multiplier</span>" privilege.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">2.</span> The privilege is valid for 2 hours.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">3.</span> Maximum deposit time is 6 times during the
                privilege period.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">4.</span> With each deposit, the cash bonus doubles.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">5.</span> All deposit cash bonuses will be credited to
                your account at once.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">8.</span> Deposits to{" "}
                <span className="text-yellow-400 font-bold">AURA7</span> are typically credited within 1 to 5 minutes.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">9.</span> If your deposit has not been credited within
                30 minutes, please contact customer service or upload your UTR for self-service processing.
              </div>
            </div>
          </div>

          {/* Deposit Bonus Table */}
          <div className="bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden border border-yellow-500/30">
            <div className="grid grid-cols-2">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-center py-3 font-semibold text-sm">
                Deposit times
              </div>
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-center py-3 font-semibold text-sm">
                Cash Bonus
              </div>
            </div>
            <div className="divide-y divide-yellow-500/20">
              {[
                { deposit: "1st deposit ₹500", bonus: "₹500" },
                { deposit: "2nd deposit ₹500", bonus: "₹1000" },
                { deposit: "3rd deposit ₹500", bonus: "₹1500" },
                { deposit: "4th deposit ₹500", bonus: "₹2000" },
                { deposit: "5th deposit ₹500", bonus: "₹2500" },
                { deposit: "6th deposit ₹500", bonus: "₹3000" },
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-2">
                  <div className="text-white p-3 text-center text-sm">{row.deposit}</div>
                  <div className="text-yellow-400 p-3 text-center text-sm font-semibold">{row.bonus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
