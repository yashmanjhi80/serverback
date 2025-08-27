"use client"

import { ArrowLeft, Shield, Award, Users, Zap } from "lucide-react"
import Link from "next/link"
import BottomNavigation from "@/components/bottom-navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960 to-black text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors">
            <ArrowLeft size={24} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-yellow-400">About Mystic Realm</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            About Mystic Realm
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Welcome to the ultimate color prediction gaming experience where excitement meets opportunity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <Shield size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400">Secure & Fair</h3>
            </div>
            <p className="text-gray-300">
              Our platform uses advanced encryption and fair play algorithms to ensure every game is secure and
              transparent.
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <Award size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400">Exciting Rewards</h3>
            </div>
            <p className="text-gray-300">
              Win big with our color prediction games and enjoy daily bonuses, special promotions, and exclusive
              rewards.
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <Users size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400">Community</h3>
            </div>
            <p className="text-gray-300">
              Join thousands of players in our vibrant gaming community and compete in exciting tournaments.
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <Zap size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400">Instant Play</h3>
            </div>
            <p className="text-gray-300">
              No downloads required! Play instantly in your browser with our optimized gaming platform.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">Our Story</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Mystic Realm was born from a passion for creating engaging and fair gaming experiences. We believe that
              everyone deserves a chance to win and have fun in a secure environment.
            </p>
            <p>
              Our team of experienced developers and gaming enthusiasts work tirelessly to bring you the most exciting
              color prediction games with cutting-edge technology and innovative features.
            </p>
            <p>
              Since our launch, we've served thousands of players worldwide, maintaining our commitment to fairness,
              security, and exceptional user experience.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl p-6 border border-yellow-400/30 shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-black">Our Mission</h3>
            <p className="text-black/80">
              To provide a safe, fair, and exciting gaming platform where players can enjoy color prediction games while
              having the opportunity to win real rewards.
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 border border-yellow-400/30 shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-black">Our Vision</h3>
            <p className="text-black/80">
              To become the world's most trusted and innovative color prediction gaming platform, setting new standards
              for fairness and user experience.
            </p>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
