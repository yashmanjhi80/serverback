"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Shield, Users, TrendingUp, DollarSign, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import BottomNavigation from "@/components/bottom-navigation"

export default function AgentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if already authenticated
  useEffect(() => {
    const agentAuth = sessionStorage.getItem("agentAuthenticated")
    if (agentAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading
    setTimeout(() => {
      if (password === "agent1") {
        setIsAuthenticated(true)
        sessionStorage.setItem("agentAuthenticated", "true")
        setPassword("")
      } else {
        setError("Invalid password. Access denied.")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("agentAuthenticated")
    setPassword("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/home"
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-yellow-400">Agent Access</h1>
            <div className="w-24"></div>
          </div>
        </header>

        {/* Login Form */}
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-6">
          <div className="w-full max-w-md">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                  <Shield size={32} className="text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Restricted Access</h2>
                <p className="text-gray-300">Enter agent password to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <div className="relative w-full h-16 flex items-center px-8 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Agent Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 text-yellow-300 hover:text-yellow-200 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-400 text-center text-sm font-semibold">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={20} />
                      <span>Access Agent Panel</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    )
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
          <h1 className="text-2xl font-bold text-yellow-400">Agent Dashboard</h1>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border border-yellow-400/30">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Welcome, Agent</h2>
            <p className="text-black/80">Manage users and monitor system performance</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 text-center shadow-lg">
            <Users size={24} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-400">1,247</p>
            <p className="text-sm text-gray-400">Total Users</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 text-center shadow-lg">
            <TrendingUp size={24} className="text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-400">₹45,230</p>
            <p className="text-sm text-gray-400">Today's Revenue</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 text-center shadow-lg">
            <DollarSign size={24} className="text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-400">₹2,34,567</p>
            <p className="text-sm text-gray-400">Total Deposits</p>
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 text-center shadow-lg">
            <Shield size={24} className="text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-400">98.5%</p>
            <p className="text-sm text-gray-400">System Uptime</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Recent User Activity</h3>
          <div className="space-y-3">
            {[
              { user: "user123", action: "Deposited ₹500", time: "2 min ago", status: "success" },
              { user: "player456", action: "Won ₹1,200 in Color Prediction", time: "5 min ago", status: "win" },
              { user: "gamer789", action: "Withdrew ₹800", time: "12 min ago", status: "pending" },
              { user: "lucky101", action: "Registered new account", time: "18 min ago", status: "new" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                <div>
                  <p className="text-white font-medium">{activity.user}</p>
                  <p className="text-gray-400 text-sm">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500/20 text-green-400"
                        : activity.status === "win"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : activity.status === "pending"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 shadow-lg text-center">
            <Users size={32} className="text-yellow-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">User Management</h4>
            <p className="text-gray-300 text-sm">View and manage user accounts</p>
          </button>

          <button className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 shadow-lg text-center">
            <TrendingUp size={32} className="text-yellow-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">Analytics</h4>
            <p className="text-gray-300 text-sm">View detailed reports and analytics</p>
          </button>

          <button className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:bg-black/80 hover:border-yellow-400/50 transition-all duration-200 shadow-lg text-center">
            <Shield size={32} className="text-yellow-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">System Settings</h4>
            <p className="text-gray-300 text-sm">Configure system parameters</p>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
