"use client"

import { ArrowLeft, MessageCircle, Mail, Phone, Clock, HelpCircle, Book, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import BottomNavigation from "@/components/bottom-navigation"

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq")

  const faqData = [
    {
      question: "How do I play color prediction games?",
      answer:
        "Simply choose a color (red, green, or violet) and place your bet. If the result matches your prediction, you win! The payout depends on the odds of your chosen color.",
    },
    {
      question: "How do I deposit money into my account?",
      answer:
        "Go to your wallet page and click on 'Deposit'. You can add funds using various payment methods including UPI, bank transfer, and digital wallets.",
    },
    {
      question: "How long does it take to withdraw money?",
      answer:
        "Withdrawals are typically processed within 24 hours. The exact time may vary depending on your chosen payment method and bank processing times.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we use advanced encryption technology to protect all user data and financial transactions. Your privacy and security are our top priorities.",
    },
    {
      question: "What are the minimum and maximum bet amounts?",
      answer:
        "The minimum bet is ₹10 and the maximum bet varies by game. You can see the betting limits on each game before placing your bet.",
    },
    {
      question: "How do I claim my daily bonus?",
      answer:
        "Daily bonuses are automatically credited to your account when you log in. Make sure to check in daily to claim your rewards!",
    },
  ]

  return (
    <div className="min-h-screen bg-linear-65 from-burgundy-800 to-burgundy-960 to-black text-white pb-20">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/home" className="text-yellow-300 hover:text-yellow-200 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-yellow-400">Help & Support</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-300">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors border ${
              activeTab === "faq"
                ? "bg-yellow-600 text-black border-yellow-400"
                : "bg-black/60 text-yellow-300 hover:bg-black/80 border-yellow-500/30"
            }`}
          >
            <HelpCircle size={20} className="inline mr-2" />
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors border ${
              activeTab === "contact"
                ? "bg-yellow-600 text-black border-yellow-400"
                : "bg-black/60 text-yellow-300 hover:bg-black/80 border-yellow-500/30"
            }`}
          >
            <MessageCircle size={20} className="inline mr-2" />
            Contact Us
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-6 py-3 rounded-full font-semibold transition-colors border ${
              activeTab === "guide"
                ? "bg-yellow-600 text-black border-yellow-400"
                : "bg-black/60 text-yellow-300 hover:bg-black/80 border-yellow-500/30"
            }`}
          >
            <Book size={20} className="inline mr-2" />
            Game Guide
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Frequently Asked Questions</h2>
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Get In Touch</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center shadow-lg">
                <div className="p-3 bg-yellow-500/20 rounded-full w-fit mx-auto mb-4 border border-yellow-500/30">
                  <Mail size={24} className="text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Email Support</h3>
                <p className="text-gray-300 mb-3">Get help via email</p>
                <a href="mailto:support@mysticsrealm.com" className="text-yellow-400 hover:text-yellow-300">
                  support@mysticsrealm.com
                </a>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center shadow-lg">
                <div className="p-3 bg-yellow-500/20 rounded-full w-fit mx-auto mb-4 border border-yellow-500/30">
                  <MessageCircle size={24} className="text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Live Chat</h3>
                <p className="text-gray-300 mb-3">Chat with our team</p>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-full font-bold border border-yellow-400/30">
                  Start Chat
                </button>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center shadow-lg">
                <div className="p-3 bg-yellow-500/20 rounded-full w-fit mx-auto mb-4 border border-yellow-500/30">
                  <Phone size={24} className="text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Phone Support</h3>
                <p className="text-gray-300 mb-3">Call us directly</p>
                <a href="tel:+911234567890" className="text-yellow-400 hover:text-yellow-300">
                  +91 12345 67890
                </a>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Clock size={24} className="text-yellow-400" />
                <h3 className="text-xl font-semibold text-yellow-400">Support Hours</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p>
                    <strong className="text-yellow-300">Monday - Friday:</strong> 9:00 AM - 10:00 PM
                  </p>
                  <p>
                    <strong className="text-yellow-300">Saturday:</strong> 10:00 AM - 8:00 PM
                  </p>
                </div>
                <div>
                  <p>
                    <strong className="text-yellow-300">Sunday:</strong> 10:00 AM - 6:00 PM
                  </p>
                  <p>
                    <strong className="text-yellow-300">Response Time:</strong> Within 2 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Guide Tab */}
        {activeTab === "guide" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Game Guide</h2>

            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Color Prediction</h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <strong className="text-yellow-300">How to Play:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Choose your bet amount</li>
                  <li>Select a color: Red, Green, or Violet</li>
                  <li>Wait for the result</li>
                  <li>Win if your color matches!</li>
                </ol>
                <p>
                  <strong className="text-yellow-300">Payouts:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Red/Green: 2x your bet</li>
                  <li>Violet: 4.5x your bet</li>
                </ul>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Mines</h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <strong className="text-yellow-300">How to Play:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Set your bet amount</li>
                  <li>Choose number of mines (1-24)</li>
                  <li>Click tiles to reveal gems</li>
                  <li>Cash out before hitting a mine!</li>
                </ol>
                <p>
                  <strong className="text-yellow-300">Strategy Tips:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Fewer mines = safer but lower multiplier</li>
                  <li>More mines = riskier but higher rewards</li>
                  <li>Cash out early to secure profits</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl p-6 border border-red-500/30 shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Shield size={24} className="text-red-400" />
                <h3 className="text-xl font-semibold text-red-400">Responsible Gaming</h3>
              </div>
              <p className="text-red-200">
                Please play responsibly. Set limits for yourself and never bet more than you can afford to lose. If you
                need help with gambling addiction, please contact our support team.
              </p>
            </div>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}
