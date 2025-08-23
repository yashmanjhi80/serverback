"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  CreditCard,
  Shield,
  Headphones,
  Gift,
  Settings,
  Ticket,
  LogOut,
  Camera,
  ChevronRight,
  ArrowRight,
  User,
} from "lucide-react"
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

export default function ProfilePage() {
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null)
  const router = useRouter()
  const [balance, setBalance] = useState<string>("Loading...")
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [username, setUsername] = useState<string>("")

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

  const handleLogout = () => {
    localStorage.removeItem("userCredentials")
    localStorage.removeItem("userData")
    router.push("/")
  }

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

    useEffect(() => {
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      setUserCredentials(JSON.parse(storedCredentials))
    }
  }, [])

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

  const menuItems = [
    { icon: Bell, label: "Notifications", badge: 2, href: "/inbox" },
    { icon: CreditCard, label: "Wallet", href: "/wallet" },
    { icon: Shield, label: "Account & Security", href: "/about" },
    { icon: Headphones, label: "Help & Support", href: "/help" },
    { icon: Gift, label: "Rewards", href: "/gifts" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Ticket, label: "Tickets", href: "/tickets" },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">Profile</h1>

          {/* Profile Info */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Avatar with Camera */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-yellow-500 overflow-hidden shadow-lg">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src="https://img.freepik.com/premium-vector/gold-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4191.jpg"
                    alt="Profile Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-800 text-yellow-400 text-lg font-semibold">
                    {userCredentials?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1.5 shadow-md">
                <Camera className="w-4 h-4 text-black" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-semibold text-white">
                  {userCredentials?.username || "Guest"}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {userCredentials?.user?.email || "No email"}
              </div>
              <div className="text-lg font-bold text-yellow-400">                  
              {showBalance ? (
                    isLoadingBalance ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <span>₹{formatBalance(balance)}</span>
                    )
                  ) : (
                    <span>₹****</span>
                  )}</div>
            </div>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="rounded-2xl p-4 mb-6 bg-yellow-400/10 border border-yellow-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 text-black rounded-lg p-2 text-center">
                <div className="text-xs font-medium">V</div>
                <div className="text-lg font-bold">V0</div>
              </div>
              <div>
                <p className="text-sm text-gray-200">
                  You need <span className="font-bold">100</span> to upgrade to
                </p>
                <p className="text-yellow-400 font-bold">V1</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>V0</span>
              <span>V1</span>
            </div>
            <div className="bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full w-[0%]"></div>
            </div>
            <div className="text-center text-gray-300 text-sm mt-1">0/100</div>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item, i) => {
            const Icon = item.icon
            const isLogout = item.label === "Logout"

            const content = (
              <div
                className={`flex items-center justify-between rounded-xl p-4 cursor-pointer transition-all duration-200 mb-2
                  ${isLogout
                    ? "bg-red-900/20 border border-red-500/30 hover:bg-red-900/40"
                    : "bg-black/50 border border-yellow-500/30 hover:bg-black/80"
                  }`}
                onClick={item.onClick}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-6 h-6 ${isLogout ? "text-red-400" : "text-yellow-400"}`}
                  />
                  <span
                    className={`font-medium ${isLogout ? "text-red-400" : "text-white"}`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center border-0">
                      {item.badge}
                    </Badge>
                  )}
                  {!isLogout && <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            )

            return item.href && !isLogout ? (
              <Link href={item.href} key={i}>
                {content}
              </Link>
            ) : (
              <div key={i}>{content}</div>
            )
          })}
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
