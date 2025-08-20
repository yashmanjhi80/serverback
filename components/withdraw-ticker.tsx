"use client"

import { useEffect, useState } from "react"
import { Volume2 } from "lucide-react"

export default function WithdrawTicker() {
  const [messages, setMessages] = useState<string[]>([])

  const withdrawalAmounts = [500, 1000, 2000, 250, 750, 1500, 3000]
  const winAmounts = [20, 50, 100, 200, 500, 1000]
  const games = ["Royal Fishing", "Slots", "Crash", "Table Game", "Bingo"]

  // Generate one random fixed message
  const generateMessage = () => {
    const randomDigits = Math.floor(10 + Math.random() * 90) // 2 random digits
    const type = Math.random() > 0.5 ? "withdraw" : "win"

    if (type === "withdraw") {
      const randomAmount =
        withdrawalAmounts[Math.floor(Math.random() * withdrawalAmounts.length)]
      return `Player*****${randomDigits} successfully withdrew ₹${randomAmount}`
    } else {
      const randomAmount =
        winAmounts[Math.floor(Math.random() * winAmounts.length)]
      const randomGame = games[Math.floor(Math.random() * games.length)]
      return `Player*****${randomDigits} won ₹${randomAmount} in ${randomGame}`
    }
  }

  useEffect(() => {
    // Initial fill
    const initialMessages = Array.from({ length: 12 }, generateMessage)
    setMessages(initialMessages)

    // Keep adding new messages
    const interval = setInterval(() => {
      setMessages((prev) => [...prev, generateMessage()])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-black/80 border-y border-yellow-500/30 overflow-hidden flex items-center">
      <Volume2 className="text-yellow-400 ml-3 mr-2 flex-shrink-0" size={18} />
      <div className="relative w-full overflow-hidden">
        {/* marquee container */}
        <div className="flex animate-marquee whitespace-nowrap">
          {messages.map((msg, index) => {
            const randomGap = Math.floor(Math.random() * 120) + 60 // 60–180px spacing
            return (
              <span
                key={index}
                style={{ marginRight: `${randomGap}px` }}
                className="text-yellow-300 text-sm font-medium"
              >
                {msg}
              </span>
            )
          })}
          {/* duplicate for smooth infinite loop */}
          {messages.map((msg, index) => {
            const randomGap = Math.floor(Math.random() * 120) + 60
            return (
              <span
                key={`dup-${index}`}
                style={{ marginRight: `${randomGap}px` }}
                className="text-yellow-300 text-sm font-medium"
              >
                {msg}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
