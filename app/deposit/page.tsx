"use client"

import { useState } from "react"
import { ChevronLeft, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
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

const paymentMethods = [
  { id: "lgpay", name: "LGPAY" },
  { id: "fpay", name: "FPAY" },
  { id: "stargo", name: "STARGO" },
]

export default function DepositPage() {
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [selectedPromotion, setSelectedPromotion] = useState("bonus")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("lgpay")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
  }

  const handlePromotionSelect = (promotion: string) => {
    setSelectedPromotion(promotion)
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handlePayment = async () => {
    if (selectedAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹100",
        variant: "destructive",
      })
      return
    }

    if (selectedAmount > 50000) {
      toast({
        title: "Invalid Amount",
        description: "Maximum deposit amount is ₹50,000",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payment Initiated",
        description: `Payment of ₹${selectedAmount} has been initiated successfully`,
      })

      // Redirect to payment gateway (simulated)
      setTimeout(() => {
        router.push("/wallet")
      }, 1000)
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPreset = presetAmounts.find((preset) => preset.amount === selectedAmount)
  const bonusAmount = selectedPreset ? selectedPreset.bonus : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-md shadow-2xl border-b border-yellow-500/20">
        <Button
          variant="ghost"
          size="icon"
          className="text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <h1 className="text-white text-base font-semibold text-center flex-1 px-2">Deposit</h1>

        <Button
          variant="ghost"
          size="icon"
          className="text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200"
        >
          <FileText className="h-5 w-5" />
        </Button>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Deposit Amount Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-xs font-medium">Deposit Amount</span>
            <div className="text-gray-300 text-xs">
              <span>Min: ₹100</span>
              <span className="ml-3">Max: ₹50000</span>
            </div>
          </div>

          {/* Amount Input Field */}
          <div className="mb-6">
            <Input
              type="number"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="w-full text-yellow-400 text-2xl font-bold text-center py-3 h-auto bg-black/50 border-yellow-500/30 focus:border-yellow-400"
              placeholder="Enter amount"
              min={100}
              max={50000}
            />
          </div>

          {/* Preset Amount Cards */}
          <div className="grid grid-cols-4 gap-1.5 mb-6">
            {presetAmounts.map((preset) => (
              <div
                key={preset.amount}
                className={`relative cursor-pointer rounded-lg p-2 text-center border transition-all duration-200 ${
                  selectedAmount === preset.amount
                    ? "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                    : "bg-black/50 border-yellow-500/30 text-white hover:bg-yellow-500/10"
                }`}
                onClick={() => handleAmountSelect(preset.amount)}
              >
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full font-semibold leading-none">
                  +{preset.bonus}
                </div>
                <div className="font-bold text-xs">₹{preset.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mb-6">
          <h3 className="text-white text-xs font-medium mb-3">Payment Methods</h3>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`rounded-lg p-2.5 text-center cursor-pointer border transition-all duration-200 ${
                  selectedPaymentMethod === method.id
                    ? "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                    : "bg-black/50 border-yellow-500/30 text-white hover:bg-yellow-500/10"
                }`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div className="font-semibold text-xs">{method.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit Event Section */}
        <div className="mb-6">
          <h3 className="text-white text-xs font-medium mb-3">
            Deposit Event<span className="text-yellow-400 ml-1">*</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {/* Promotion Option */}
            <div
              className={`rounded-lg p-3 cursor-pointer border transition-all duration-200 ${
                selectedPromotion === "bonus"
                  ? "bg-yellow-400/20 border-yellow-400"
                  : "bg-black/50 border-yellow-500/30 hover:bg-yellow-500/10"
              }`}
              onClick={() => handlePromotionSelect("bonus")}
            >
              <div className="text-center">
                <h4 className="text-yellow-400 font-bold text-xs">Deposit Cash</h4>
                <h4 className="text-yellow-400 font-bold text-xs">Bonus Multiplier</h4>
                {selectedPromotion === "bonus" && <Check className="w-4 h-4 text-yellow-400 mx-auto mt-1" />}
              </div>
            </div>

            {/* No Promotion Option */}
            <div
              className={`rounded-lg p-3 cursor-pointer border transition-all duration-200 ${
                selectedPromotion === "none"
                  ? "bg-yellow-400/20 border-yellow-400"
                  : "bg-black/50 border-yellow-500/30 hover:bg-yellow-500/10"
              }`}
              onClick={() => handlePromotionSelect("none")}
            >
              <div className="text-center">
                <h4 className="text-gray-300 font-semibold text-xs">No promotion</h4>
                {selectedPromotion === "none" && <Check className="w-4 h-4 text-yellow-400 mx-auto mt-1" />}
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="mb-6">
          <Button
            className="w-full py-3 h-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-base disabled:opacity-50"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : `Pay Now ₹${selectedAmount}`}
          </Button>
        </div>

        {/* Promotional Text */}
        <div className="mb-6 space-y-3">
          <p className="text-yellow-400 text-xs leading-relaxed">
            To participate in this promotion, your withdrawal must meet the wagering requirements.
          </p>

          {/* Additional Information */}
          <div className="bg-black/50 rounded-lg p-3 border border-yellow-500/30">
            <div className="space-y-2 text-xs text-white">
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
                <span className="text-yellow-400 font-bold">MYSTIC REALM</span> are typically credited within 1 to 5
                minutes.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">9.</span> If your deposit has not been credited within
                30 minutes, please contact customer service or upload your UTR for self-service processing.
              </div>
            </div>
          </div>

          {/* Deposit Bonus Table */}
          <div className="bg-black/50 rounded-lg overflow-hidden border border-yellow-500/30">
            <div className="grid grid-cols-2">
              <div className="bg-yellow-400/20 text-yellow-400 text-center py-2 font-semibold text-xs border-r border-yellow-500/30">
                Deposit times
              </div>
              <div className="bg-yellow-400/20 text-yellow-400 text-center py-2 font-semibold text-xs">Cash Bonus</div>
            </div>
            <div className="divide-y divide-yellow-500/20">
              <div className="grid grid-cols-2">
                <div className="text-white p-2 text-center text-xs border-r border-yellow-500/20">1st deposit ₹500</div>
                <div className="text-white p-2 text-center text-xs">₹500</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-white p-2 text-center text-xs border-r border-yellow-500/20">2nd deposit ₹500</div>
                <div className="text-white p-2 text-center text-xs">₹1000</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-white p-2 text-center text-xs border-r border-yellow-500/20">3rd deposit ₹500</div>
                <div className="text-white p-2 text-center text-xs">₹1500</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-white p-2 text-center text-xs border-r border-yellow-500/20">4th deposit ₹500</div>
                <div className="text-white p-2 text-center text-xs">₹2000</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-white p-2 text-center text-xs border-r border-yellow-500/20">5th deposit ₹500</div>
                <div className="text-white p-2 text-center text-xs">₹2500</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-white p-2 text-center text-xs border-r border-yellow-500/20">6th deposit ₹500</div>
                <div className="text-white p-2 text-center text-xs">₹3000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
