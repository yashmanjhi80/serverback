"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Wallet, Gift, MessageSquare } from "lucide-react"

const navigationItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/agent", icon: User, label: "Agent" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/gifts", icon: Gift, label: "Gifts" },
  { href: "/inbox", icon: MessageSquare, label: "Inbox" },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-yellow-500/20 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-yellow-400 bg-yellow-500/10"
                  : "text-gray-400 hover:text-yellow-300 hover:bg-yellow-500/5"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
