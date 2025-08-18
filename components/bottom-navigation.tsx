"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/home",
      icon: "https://i.ibb.co/sxj6SJG/icons8-home-60.png",
      label: "Home",
    },
    {
      href: "/gifts",
      icon: "https://i.ibb.co/7dk6Lpz/icons8-gift-48.png",
      label: "Promo",
    },
    {
      href: "/agent",
      icon: "https://i.ibb.co/fd8Lmw9N/icons8-person-48-1.png",
      label: "Agent",
    },
    {
      href: "/wallet",
      icon: "https://i.ibb.co/QFry8r92/icons8-wallet-50-1.png",
      label: "Wallet",
    },
    {
      href: "/profile",
      icon: "https://i.ibb.co/jvrh681s/icons8-account-50.png",
      label: "Account",
    },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-yellow-500/20 p-3 md:p-4 z-30">
      <div className="max-w-6xl mx-auto flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              pathname === item.href ? "text-yellow-400" : "text-yellow-300/70 hover:text-yellow-400"
            }`}
          >
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border ${
                pathname === item.href ? "bg-yellow-500/20 border-yellow-400/50" : "bg-black/60 border-yellow-500/30"
              }`}
            >
              <img src={item.icon || "/placeholder.svg"} alt={item.label} width="20" height="20" />
            </div>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </footer>
  )
}
