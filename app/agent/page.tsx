"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Coins,
  Users,
  MessageCircle,
  Copy,
  User,
  HelpCircle,
  CheckCircle,
  Gavel,
  UserPlus,
  ArrowUp,
} from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"

export default function AgentPage() {
  const { toast } = useToast()
  const [totalCommission] = useState(0)
  const [totalInvites] = useState(0)
  const [dailyInvites] = useState("0/99")

  const handleShare = (platform: string) => {
    toast({
      title: `${platform} Share`,
      description: `Sharing to ${platform} - UI Only`,
      duration: 2000,
    })
  }

  const handleCopyLink = () => {
    const referralLink = "https://mysticgame.com/ref/user123"
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Referral link copied to clipboard",
          duration: 2000,
        })
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy link to clipboard",
          duration: 2000,
        })
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md shadow-2xl border-b border-yellow-500/20">
        <div className="max-w-md mx-auto px-3 py-4">
          <h1 className="text-xl font-bold text-yellow-400 text-center flex items-center justify-center">
            <User className="mr-2" size={20} />
            AGENT
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-0">
        {/* Stats Cards */}
        <section className="grid grid-cols-1">
          {/* Total Commission Card */}
          <Card className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md border-2 border-yellow-500/30 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-gray-300">Total Commission</h2>
                <Coins className="text-yellow-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">₹{totalCommission}</div>
              <div className="flex items-center text-green-400">
                <ArrowUp size={12} className="mr-1" />
                <span className="text-xs">Ready to withdraw</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Invites Card */}
          <Card className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md border-2 border-yellow-500/30 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-gray-300">Total Invites</h2>
                <Users className="text-yellow-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">{totalInvites}</div>
              <div className="flex items-center text-blue-400">
                <UserPlus size={12} className="mr-1" />
                <span className="text-xs">Active referrals</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Invite Rewards */}
        <section className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md border-2 border-yellow-500/30 p-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-2xl font-bold text-white mr-3">Invite a new customer get</h2>
              <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
                <HelpCircle size={16} className="text-black" />
              </div>
            </div>
            <div className="text-6xl font-bold text-yellow-400 mb-4">₹50</div>
            <p className="text-gray-300 text-lg">
              Invited friends get <span className="text-yellow-400 font-semibold">₹20</span>
            </p>
          </div>

          {/* Invite Now Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-4 mb-6 text-center">
              <span className="text-black font-bold text-xl">Invite friends to get money</span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex justify-center gap-3 mb-4">
              {/* Telegram Share */}
              <Button
                onClick={() => handleShare("Telegram")}
                className="bg-transparent hover:bg-yellow-400/10 p-3 transition-all duration-300 border border-yellow-500/30"
              >
                <div className="flex flex-col items-center space-y-1">
                  <MessageCircle className="w-8 h-8 text-blue-400" />
                  <span className="text-white text-xs">Telegram</span>
                </div>
              </Button>

              {/* WhatsApp Share */}
              <Button
                onClick={() => handleShare("WhatsApp")}
                className="bg-transparent hover:bg-yellow-400/10 p-3 transition-all duration-300 border border-yellow-500/30"
              >
                <div className="flex flex-col items-center space-y-1">
                  <MessageCircle className="w-8 h-8 text-green-400" />
                  <span className="text-white text-xs">WhatsApp</span>
                </div>
              </Button>

              {/* Copy Link */}
              <Button
                onClick={handleCopyLink}
                className="bg-transparent hover:bg-yellow-400/10 p-3 transition-all duration-300 border border-yellow-500/30"
              >
                <div className="flex flex-col items-center space-y-1">
                  <Copy className="w-8 h-8 text-yellow-400" />
                  <span className="text-white text-xs">Copy Link</span>
                </div>
              </Button>
            </div>
          </div>
        </section>

        {/* Agent Levels & Rules */}
        <section>
          {/* Agent Levels Diagram */}
          <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md border-2 border-yellow-500/30 p-4">
            <h3 className="text-lg font-bold text-center mb-4 text-yellow-400">Agent Level Structure</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-yellow-500/20">
                <span className="text-white">Level A (Direct)</span>
                <span className="text-yellow-400 font-bold">40% Commission</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-yellow-500/20">
                <span className="text-white">Level B (2nd Tier)</span>
                <span className="text-yellow-400 font-bold">20% Commission</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-yellow-500/20">
                <span className="text-white">Level C (3rd Tier)</span>
                <span className="text-yellow-400 font-bold">10% Commission</span>
              </div>
            </div>
          </div>

          {/* Commission Formula Section */}
          <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md border-2 border-yellow-500/30 p-4">
            <h3 className="text-base font-bold text-center mb-4 text-yellow-400 border-b border-yellow-500/30 pb-2">
              Commission Formula (3 Tiers)
            </h3>

            {/* Formula */}
            <div className="bg-black/50 rounded p-3 mb-4">
              <h4 className="text-yellow-400 font-semibold text-sm mb-2 text-center">Commission Calculation</h4>
              <div className="text-center text-white space-y-1">
                <p className="text-xs">Commission = (A_Total_Bets × Commission Rate × Conversion Rate)</p>
                <p className="text-xs">+ (B_Total_Bets × Commission Rate × Conversion Rate)</p>
                <p className="text-xs">+ (C_Total_Bets × Commission Rate × Conversion Rate)</p>
              </div>
            </div>

            {/* Example */}
            <div className="bg-black/50 rounded p-3 mb-4">
              <h4 className="text-yellow-400 font-semibold text-sm mb-2 text-center">Example</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <p>
                  <span className="text-yellow-400">A_bets:</span> 1,000,{" "}
                  <span className="text-yellow-400">A_dep:</span> 500
                </p>
                <p>
                  <span className="text-yellow-400">B_bets:</span> 1,500,{" "}
                  <span className="text-yellow-400">B_dep:</span> 1,000
                </p>
                <p>
                  <span className="text-yellow-400">C_bets:</span> 2,000,{" "}
                  <span className="text-yellow-400">C_dep:</span> 600
                </p>
                <p>
                  <span className="text-yellow-400">Team_Bets:</span> 4,500,{" "}
                  <span className="text-yellow-400">Team_Deposit:</span> 2,100
                </p>
                <p>
                  <span className="text-yellow-400">Commission_Rate:</span> 5%,{" "}
                  <span className="text-yellow-400">Conversion_Rate:</span> 30%
                </p>
                <p>
                  <span className="text-yellow-400">Total:</span> 67.50
                </p>
              </div>
            </div>

            {/* Commission Rate Table */}
            <div className="space-y-3">
              <div>
                <h4 className="text-yellow-400 font-semibold text-sm mb-2 text-center">Commission Rate</h4>
                <p className="text-xs text-gray-400 mb-3 text-center">(based on Total Team Bets: A + B + C)</p>
                <div className="space-y-1 text-xs text-gray-300 bg-black/50 rounded p-3">
                  <div className="flex justify-between">
                    <span>50 to 1,999</span>
                    <span className="text-yellow-400">3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2,000 to 14,999</span>
                    <span className="text-yellow-400">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>15,000 to 49,999</span>
                    <span className="text-yellow-400">7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50,000 to 199,999</span>
                    <span className="text-yellow-400">9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>200,000 to 499,999</span>
                    <span className="text-yellow-400">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>500,000 to 999,999</span>
                    <span className="text-yellow-400">11%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1,000,000 to 1,999,999</span>
                    <span className="text-yellow-400">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2,000,000 or more</span>
                    <span className="text-yellow-400">15%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-yellow-400 font-semibold text-sm mb-2 text-center">Conversion Rate</h4>
                <p className="text-xs text-gray-400 mb-3 text-center">(based on Total Team Deposits: A + B + C)</p>
                <div className="space-y-1 text-xs text-gray-300 bg-black/50 rounded p-3">
                  <div className="flex justify-between">
                    <span>100 to 4,999</span>
                    <span className="text-yellow-400">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5,000 to 14,999</span>
                    <span className="text-yellow-400">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>15,000 to 49,999</span>
                    <span className="text-yellow-400">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50,000 to 499,999</span>
                    <span className="text-yellow-400">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>500,000 or more</span>
                    <span className="text-yellow-400">120%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md border-2 border-yellow-500/30 p-4">
            <h3 className="text-base font-bold text-center mb-4 text-yellow-400 border-b border-yellow-500/30 pb-2">
              <Gavel className="inline mr-1" size={16} />
              Rules & Guidelines
            </h3>
            <div className="space-y-3 text-gray-300">
              {[
                "Commission is calculated based on the total betting and recharge amounts of your downline agents.",
                "Invited friends must complete registration and make a minimum deposit to qualify for rewards.",
                "Commission payments are processed daily and automatically credited to your account.",
                "Fraudulent activities or fake accounts will result in commission forfeiture and account suspension.",
              ].map((rule, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle size={14} className="text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-xs">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}
