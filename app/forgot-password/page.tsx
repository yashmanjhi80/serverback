"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic email validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For now, just show success message
      setIsEmailSent(true)
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background-image.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-yellow-900/20 to-black/90" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text drop-shadow-lg mb-2 font-serif">
              AURA7
            </h1>
            <p className="text-yellow-200 text-lg drop-shadow-md font-medium">Password Recovery</p>
          </div>

          {/* Back Button */}
          <Link href="/" className="text-yellow-300 hover:text-yellow-200 transition-colors">
            <ArrowLeft size={24} />
          </Link>

          {!isEmailSent ? (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400 drop-shadow-lg mb-2">Forgot Password?</h2>
                <p className="text-gray-300 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="relative w-full h-16 flex items-center px-8 bg-black/40 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                  <Mail size={20} className="text-yellow-400 mr-3" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-yellow-300/70 text-lg font-medium outline-none"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-center text-sm font-semibold">{error}</p>}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="relative w-full h-16 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 rounded-lg shadow-lg border border-yellow-400/30"
                  disabled={isLoading}
                >
                  <span className="text-black text-xl font-bold drop-shadow-lg">
                    {isLoading ? "SENDING..." : "SEND RESET LINK"}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <CheckCircle size={40} className="text-green-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-yellow-400 drop-shadow-lg mb-2">Email Sent!</h2>
                <p className="text-gray-300 text-sm mb-4">
                  We've sent a password reset link to <span className="text-yellow-300 font-semibold">{email}</span>
                </p>
                <p className="text-gray-400 text-xs">
                  Didn't receive the email? Check your spam folder or try again in a few minutes.
                </p>
              </div>

              <Link
                href="/"
                className="inline-block w-full h-16 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 rounded-lg shadow-lg border border-yellow-400/30"
              >
                <span className="text-black text-xl font-bold drop-shadow-lg">BACK TO LOGIN</span>
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-yellow-300/70 text-sm">© 2024 AURA7. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
