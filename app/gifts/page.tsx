"use client"

import { ArrowLeft, Gift, Star, Calendar, Coins } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import BottomNavigation from "@/components/bottom-navigation"

interface GiftItem {
  id: string
  title: string
  description: string
  reward: string
  type: "daily" | "weekly" | "special"
  claimed: boolean
  available: boolean
  daysLeft?: number
}

export default function GiftsPage() {
  const [gifts] = useState<GiftItem[]>([
    // Currently no gifts available - showing empty state
  ])

  const totalGifts = gifts.length
  const claimedGifts = gifts.filter((gift) => gift.claimed).length
  const availableGifts = gifts.filter((gift) => gift.available && !gift.claimed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/home" className="text-yellow-300 hover:text-yellow-200 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center space-x-2">
            <Gift size={24} className="text-yellow-400" />
            <h1 className="text-2xl font-bold text-yellow-400">Gifts</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center shadow-lg">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-yellow-500/30">
              <Gift size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400">{totalGifts}</h3>
            <p className="text-gray-300">Total Gifts</p>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center shadow-lg">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-yellow-500/30">
              <Star size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400">{availableGifts}</h3>
            <p className="text-gray-300">Available</p>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center shadow-lg">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-yellow-500/30">
              <Coins size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400">{claimedGifts}</h3>
            <p className="text-gray-300">Claimed</p>
          </div>
        </div>

        {/* Gifts Content */}
        {gifts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/30">
              <Gift size={48} className="text-yellow-400" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-yellow-400">No Gifts Available</h3>
            <p className="text-lg text-gray-300 mb-6">Check back later for exciting rewards and daily bonuses!</p>
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 max-w-md mx-auto shadow-lg">
              <h4 className="text-xl font-semibold mb-3 text-yellow-400">Coming Soon</h4>
              <ul className="text-left space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <Calendar size={16} className="text-yellow-400" />
                  <span>Daily Login Bonuses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-400" />
                  <span>Weekly Challenges</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Gift size={16} className="text-yellow-400" />
                  <span>Special Event Rewards</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coins size={16} className="text-yellow-400" />
                  <span>Achievement Prizes</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className={`bg-black/60 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 shadow-lg ${
                  gift.available && !gift.claimed
                    ? "border-yellow-400/50 bg-yellow-500/5"
                    : gift.claimed
                      ? "border-green-400/50 bg-green-500/5"
                      : "border-yellow-500/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                        gift.available && !gift.claimed
                          ? "bg-yellow-500/20 border-yellow-500/30"
                          : gift.claimed
                            ? "bg-green-500/20 border-green-500/30"
                            : "bg-gray-500/20 border-gray-500/30"
                      }`}
                    >
                      <Gift
                        size={24}
                        className={
                          gift.available && !gift.claimed
                            ? "text-yellow-400"
                            : gift.claimed
                              ? "text-green-400"
                              : "text-gray-400"
                        }
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-400">{gift.title}</h3>
                      <p className="text-gray-300">{gift.description}</p>
                      <p className="text-sm text-yellow-300 font-medium">{gift.reward}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {gift.claimed ? (
                      <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
                        Claimed
                      </span>
                    ) : gift.available ? (
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-2 rounded-full font-bold transition-colors border border-yellow-400/30">
                        Claim
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        {gift.daysLeft ? `${gift.daysLeft} days left` : "Not available"}
                      </span>
                    )}
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
