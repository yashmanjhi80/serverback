"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Plus, Minus, CreditCard, TrendingUp, Eye, EyeOff, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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
    { icon: Bell, label: "Notifications", badge: 1, href: "/inbox" },
    { icon: CreditCard, label: "Balance records", href: "/history" },
    { icon: Shield, label: "Account & Security", href: "/about" },
    { icon: Headphones, label: "Live Support", href: "/help" },
    { icon: Gift, label: "Gifts", href: "/gifts" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Ticket, label: "Ticket", href: "/tickets" },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ]

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960">

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

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Header */}
         <div className="text-center mb-8">
  

          {/* Profile Info */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Profile Avatar with Badge */}
            <div className="relative">
              <div className="profile-avatar w-20 h-20 rounded-full p-1 card-shadow">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                    alt="Profile Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-burgundy-700 text-gold-400 text-lg font-semibold">
                    {username ? username.substring(0, 2).toUpperCase() : "P7"}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Camera Badge */}
              <div className="absolute -bottom-1 -right-1 bg-gold-500 rounded-full p-1.5">
                <Camera className="w-4 h-4 text-burgundy-900" />
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-semibold text-white">{username || "Player74835887"}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-400 mb-2">uid:{username || "74835887"}</div>
              <div className="text-lg font-bold text-gold-400">
                ₹{isLoadingBalance ? "Loading..." : formatBalance(balance)}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="upgrade-card rounded-2xl p-4 mb-6 card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* VIP Badge */}
              <div className="bg-white/20 rounded-lg p-2">
                <div className="text-center">
                  <img src="hhttps://i.ibb.co/7dZ3Z9wB/Adobe-Express-file-6.png" alt="Deposit" className="w-full h-6" />
                  <div className="text-lg font-bold text-burgundy-900">V0</div>
                </div>
              </div>

              {/* Upgrade Info */}
              <div>
                <p className="text-burgundy-900 font-medium text-sm">
                  You need <span className="font-bold">100</span> to upgrade to
                </p>
                <p className="text-burgundy-900 font-bold">V1</p>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-8 h-8 text-burgundy-900" />
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-burgundy-900 font-medium mb-1">
              <span>V0</span>
              <span>V1</span>
            </div>
            <div className="bg-burgundy-900/30 rounded-full h-2">
              <div className="bg-burgundy-900 h-2 rounded-full w-0"></div>
            </div>
            <div className="text-center text-burgundy-900 font-medium text-sm mt-1">0/100</div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon

            const handleClick = () => {
              if (item.onClick) {
                item.onClick()
              } else if (item.href) {
                router.push(item.href)
              }
            }

            return (
              <div
                key={index}
                onClick={handleClick}
                className="menu-item flex items-center justify-between bg-burgundy-800/50 rounded-xl p-4 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6 text-gold-400" />
                  <span className="text-white font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center border-0">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
