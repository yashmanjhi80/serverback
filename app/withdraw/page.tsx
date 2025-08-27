"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {  ArrowLeft, ChevronLeft, FileText } from "lucide-react"
import { BalanceCards } from "@/components/balance-cards"
import { AmountSelection } from "@/components/amount-selection"
import { BankAccountSection } from "@/components/bank-account-section"
import { Button } from "@/components/ui/button"
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

export default function WithdrawalPage() {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState(110)
  const [cashBalance, setCashBalance] = useState(0)
  const [withdrawableAmount, setWithdrawableAmount] = useState(0)
  const [username, setUsername] = useState<string>("")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  useEffect(() => {
    const loadUserDataAndBalance = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials")
        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials)
          setUsername(credentials.username)
          await fetchBalance(credentials.username, credentials.password)
        } else {
          setCashBalance(0)
          setWithdrawableAmount(0)
          setIsLoadingBalance(false)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setCashBalance(0)
        setWithdrawableAmount(0)
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
        const balanceValue = Number.parseFloat(data.balance || data.rawResponse || "0")
        setCashBalance(balanceValue)
        setWithdrawableAmount(balanceValue) // Assuming withdrawable amount equals cash balance
      } else {
        setCashBalance(0)
        setWithdrawableAmount(0)
        console.error("Balance fetch failed:", data.message)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
      setCashBalance(0)
      setWithdrawableAmount(0)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleAddBankAccount = () => {
    router.push("/verify-account")
  }

  const handleWithdraw = () => {
    // TODO: Implement withdrawal logic
    console.log("Processing withdrawal for amount:", selectedAmount)
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-burgundy-800 to-burgundy-900 min-h-screen">
    <header className="relative bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
  {/* Back Button fixed left */}
  <Link
    href="/home"
    className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300 hover:text-yellow-200 transition-colors"
  >
    <ArrowLeft size={24} />
  </Link>

  {/* Centered Title */}
  <h1 className="text-center text-2xl font-bold text-yellow-400">
    Profile
  </h1>

  {/* Decorative line */}
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>
  <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
</header>
      <div className="p-4">
        {/* Header */}
 
        {/* Balance Cards */}
        <BalanceCards
          cashBalance={isLoadingBalance ? 0 : cashBalance}
          withdrawableAmount={isLoadingBalance ? 0 : withdrawableAmount}
        />

        {/* Golden Separator */}
        <div className="w-full h-0.5 bg-golden mb-6"></div>

        {/* Bank Account Section */}
        <BankAccountSection onAddBankAccount={handleAddBankAccount} />

        {/* Golden Separator */}
        <div className="w-full h-0.5 bg-golden mb-6"></div>

        {/* Amount Selection */}
        <AmountSelection onAmountSelect={setSelectedAmount} selectedAmount={selectedAmount} />

        {/* Withdraw Button */}
        <div className="flex justify-center relative">
          <Button
            onClick={handleWithdraw}
            className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black font-bold py-4 px-24 rounded-full text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-lg border border-yellow-400 relative overflow-hidden"
            size="lg"
            data-testid="button-withdraw"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
            <div className="absolute top-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
            <span className="relative z-10 tracking-wide">Withdraw</span>
          </Button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
