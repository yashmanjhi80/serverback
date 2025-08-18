"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Wallet, Info, HelpCircle, LogOut, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

  useEffect(() => {
    const storedCredentials = localStorage.getItem("userCredentials")
    if (storedCredentials) {
      setUserCredentials(JSON.parse(storedCredentials))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userCredentials")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
            <User size={28} className="text-yellow-400" />
            <span className="text-yellow-400">Profile</span>
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Info Card */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center border border-yellow-400/30 shadow-lg">
              <User size={40} className="text-black" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-400">{userCredentials?.username || "Guest"}</h2>
            <p className="text-gray-300">{userCredentials?.user?.email || "No email provided"}</p>
          </div>

          {userCredentials?.loginTime && (
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <Calendar size={16} className="text-yellow-400" />
              <span>Member since {formatDate(userCredentials.loginTime)}</span>
            </div>
          )}
        </div>

        {/* Menu Options */}
        <div className="space-y-4">
          <Link
            href="/wallet"
            className="flex items-center space-x-4 bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 group shadow-lg"
          >
            <div className="p-3 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/30 transition-colors border border-yellow-500/30">
              <Wallet size={24} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-400">Wallet</h3>
              <p className="text-gray-300">Manage your balance and transactions</p>
            </div>
            <ArrowLeft
              size={20}
              className="rotate-180 text-yellow-400/70 group-hover:text-yellow-400 transition-colors"
            />
          </Link>

          <Link
            href="/about"
            className="w-full flex items-center space-x-4 bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 group shadow-lg"
          >
            <div className="p-3 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/30 transition-colors border border-yellow-500/30">
              <Info size={24} className="text-yellow-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-yellow-400">About</h3>
              <p className="text-gray-300">Learn more about Mystic Realm</p>
            </div>
            <ArrowLeft
              size={20}
              className="rotate-180 text-yellow-400/70 group-hover:text-yellow-400 transition-colors"
            />
          </Link>

          <Link
            href="/help"
            className="w-full flex items-center space-x-4 bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 group shadow-lg"
          >
            <div className="p-3 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/30 transition-colors border border-yellow-500/30">
              <HelpCircle size={24} className="text-yellow-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-yellow-400">Help & Support</h3>
              <p className="text-gray-300">Get help and contact support</p>
            </div>
            <ArrowLeft
              size={20}
              className="rotate-180 text-yellow-400/70 group-hover:text-yellow-400 transition-colors"
            />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 hover:bg-red-900/40 hover:border-red-400/50 transition-all duration-200 group shadow-lg"
          >
            <div className="p-3 bg-red-500/20 rounded-full group-hover:bg-red-500/30 transition-colors border border-red-500/30">
              <LogOut size={24} className="text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-red-400">Logout</h3>
              <p className="text-gray-300">Sign out of your account</p>
            </div>
            <ArrowLeft size={20} className="rotate-180 text-red-400/70 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
