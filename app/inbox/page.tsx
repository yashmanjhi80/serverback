"use client"

import type React from "react"
import BottomNavigation from "@/components/bottom-navigation"
import { ArrowLeft, Mail, Clock, Gift } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Message {
  id: string
  title: string
  content: string
  timestamp: string
  isRead: boolean
  type: "welcome" | "system" | "promotion"
  icon?: React.ReactNode
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      title: "Welcome to Mystic Realm! 🎮",
      content:
        "Welcome to the ultimate gaming experience! Explore our exciting games, claim daily bonuses, and start your winning journey. Good luck and have fun!",
      timestamp: new Date().toISOString(),
      isRead: false,
      type: "welcome",
      icon: <Gift size={20} className="text-yellow-400" />,
    },
  ])

  const markAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  const unreadCount = messages.filter((msg) => !msg.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors">
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Mail size={24} className="text-yellow-400" />
            <h1 className="text-2xl font-bold text-yellow-400">Inbox</h1>
            {unreadCount > 0 && (
              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold border border-yellow-400">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <Mail size={64} className="text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-yellow-400">No messages yet</h3>
            <p className="text-gray-400">Your messages and notifications will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-black/60 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 cursor-pointer hover:bg-black/80 shadow-lg ${
                  message.isRead ? "border-yellow-500/20" : "border-yellow-400/50 bg-yellow-500/5"
                }`}
                onClick={() => markAsRead(message.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{message.icon || <Mail size={20} className="text-yellow-400" />}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${message.isRead ? "text-white" : "text-yellow-300"}`}>
                        {message.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-400">{formatTime(message.timestamp)}</span>
                        {!message.isRead && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
                      </div>
                    </div>
                    <p className={`text-sm ${message.isRead ? "text-gray-300" : "text-gray-200"}`}>{message.content}</p>
                    <div className="mt-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs border ${
                          message.type === "welcome"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : message.type === "system"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                        }`}
                      >
                        {message.type === "welcome" ? "Welcome" : message.type === "system" ? "System" : "Promotion"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}
