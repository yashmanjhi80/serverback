"use client"

import { Search, RefreshCw, Wallet, Plus, Grid3X3, Gamepad2, Spade, Fish, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { NgameCardsData, gameCardsData, bannerData } from "@/data/games"
import BottomNavigation from "@/components/bottom-navigation"
import WithdrawTicker from "@/components/withdraw-ticker"

interface UserCredentials {
  username: string
  password: string
  user?: {
    username: string
    email: string
  }
  loginTime: string
}

interface GameLoadingState {
  isLoading: boolean
  progress: number
  gameName: string
}

export default function HomePage() {
  const [balance, setBalance] = useState<string>("Loading...")
  const [username, setUsername] = useState<string>("")
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [gameLoading, setGameLoading] = useState<GameLoadingState>({
    isLoading: false,
    progress: 0,
    gameName: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [currentBanner, setCurrentBanner] = useState(0)
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false)
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false)
  const [isHorizontal, setIsHorizontal] = useState(false)

  // Check if device is in horizontal orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsHorizontal(window.innerWidth > window.innerHeight && window.innerWidth >= 568)
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  useEffect(() => {
    const loadUserDataAndBalance = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials")
        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials)
          setUsername(credentials.username)
          setUserCredentials(credentials)
          await fetchBalance(credentials.username, credentials.password)
        } else {
          setBalance("0")
          setIsLoadingBalance(false)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setBalance("Error")
        setIsLoadingBalance(false)
      }
    }

    loadUserDataAndBalance()
  }, [])

  // Banner auto-slide effect (only for vertical view)
  useEffect(() => {
    if (!isHorizontal) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerData.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [isHorizontal])

  // Show welcome notification on first load
  useEffect(() => {
    const hasShownWelcome = localStorage.getItem("hasShownWelcome")
    if (userCredentials && !hasShownWelcome) {
      setShowWelcomeNotification(true)
      localStorage.setItem("hasShownWelcome", "true")

      const timer = setTimeout(() => {
        setShowWelcomeNotification(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [userCredentials])

  const fetchBalance = async (username: string, password: string) => {
    try {
      setIsLoadingBalance(true)
      const response = await fetch(
        `/api/auth/balance?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      )
      const data = await response.json()

      if (data.success && data.data) {
        const balanceValue = data.data.balance || data.data.rawResponse || "0"
        setBalance(balanceValue.toString())
      } else {
        setBalance("Error")
        console.error("Balance fetch failed:", data.message)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
      setBalance("Error")
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const refreshBalance = async () => {
    if (userCredentials) {
      await fetchBalance(userCredentials.username, userCredentials.password)
    }
  }

  const checkBalance = () => {
    const numericBalance = Number.parseFloat(balance)
    return !isNaN(numericBalance) && numericBalance >= 10
  }

  const launchGame = async (gameCode: string, Pcode: string, gameType: string, gameName: string) => {
    if (!userCredentials) {
      alert("Please login to play games")
      return
    }

    if (!checkBalance()) {
      setShowInsufficientBalancePopup(true)
      return
    }

    setGameLoading({
      isLoading: true,
      progress: 0,
      gameName: gameName,
    })

    const progressInterval = setInterval(() => {
      setGameLoading((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 15, 90),
      }))
    }, 200)

    try {
      const params = new URLSearchParams({
        username: userCredentials.username,
        password: userCredentials.password,
        type: gameType,
        provider_code: Pcode,
        gameid: gameCode,
        lang: "en-US",
        html5: "1",
      })

      const response = await fetch(`/api/auth/launch-game?${params.toString()}`)
      const data = await response.json()

      clearInterval(progressInterval)
      setGameLoading((prev) => ({ ...prev, progress: 100 }))

      if (data.success && data.data) {
        if (data.data.gameUrl || data.data.url) {
          const gameUrl = data.data.gameUrl || data.data.url
          setTimeout(() => {
            window.location.href = gameUrl
          }, 500)
        } else if (data.data.rawResponse) {
          console.log("Game launch response:", data.data.rawResponse)
          setTimeout(() => {
            setGameLoading({ isLoading: false, progress: 0, gameName: "" })
            alert("Game launched! Check console for details.")
          }, 500)
        } else {
          console.log("Game launch successful:", data.data)
          setTimeout(() => {
            setGameLoading({ isLoading: false, progress: 0, gameName: "" })
            alert("Game launched successfully!")
          }, 500)
        }
      } else {
        console.error("Game launch failed:", data.message)
        setTimeout(() => {
          setGameLoading({ isLoading: false, progress: 0, gameName: "" })
          alert(`Failed to launch game: ${data.message}`)
        }, 500)
      }
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error launching game:", error)
      setTimeout(() => {
        setGameLoading({ isLoading: false, progress: 0, gameName: "" })
        alert("Failed to launch game. Please try again.")
      }, 500)
    }
  }

  const formatBalance = (balance: string) => {
    if (balance === "Loading..." || balance === "Error") return balance
    try {
      const num = Number.parseFloat(balance)
      if (isNaN(num)) return balance
      return num.toLocaleString()
    } catch {
      return balance
    }
  }

  const getGameTypeLabel = (type: string) => {
    switch (type) {
      case "SL":
        return "Slots"
      case "FH":
        return "Fishing"
      case "CB":
        return "Cards"
      case "OT":
        return "Others"
      default:
        return "Game"
    }
  }

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case "SL":
        return <Gamepad2 size={16} />
      case "FH":
        return <Fish size={16} />
      case "CB":
        return <Spade size={16} />
      case "OT":
        return <Zap size={16} />
      default:
        return <Grid3X3 size={16} />
    }
  }

  const filteredGames = gameCardsData.filter((game) => {
    const matchesSearch = game.gameName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "ALL" || game.p_type === selectedFilter
    return matchesSearch && matchesFilter
  })
  const NfilteredGames = NgameCardsData.filter((game) => {
    const matchesSearch = game.gameName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "ALL" || game.p_type === selectedFilter
    return matchesSearch && matchesFilter
  })

  console.log("[v0] gameCardsData length:", gameCardsData?.length)
  console.log("[v0] NgameCardsData length:", NgameCardsData?.length)
  console.log("[v0] filteredGames length:", filteredGames?.length)
  console.log("[v0] NfilteredGames length:", NfilteredGames?.length)
  console.log("[v0] searchTerm:", searchTerm)
  console.log("[v0] selectedFilter:", selectedFilter)
  console.log("[v0] Sample game data:", gameCardsData?.[0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Insufficient Balance Popup */}
      {showInsufficientBalancePopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-yellow-500/30 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                <Wallet size={32} className="text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">Insufficient Balance</h2>
              <p className="text-yellow-200 mb-4">You need at least ₹10 to play games</p>

              <div className="bg-black/50 rounded-lg p-4 mb-6 border border-yellow-500/20">
                <p className="text-gray-300 text-sm mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-yellow-400">₹{formatBalance(balance)}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInsufficientBalancePopup(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors border border-gray-600"
                >
                  Cancel
                </button>
                <Link
                  href="/deposit"
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-all text-center border border-yellow-400/30"
                  onClick={() => setShowInsufficientBalancePopup(false)}
                >
                  Add Cash
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Window Loading Overlay */}
      {gameLoading.isLoading && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-8">
              <div className="w-24 h-24 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">Launching {gameLoading.gameName}</h2>
              <p className="text-gray-300">Please wait while we prepare your game...</p>
            </div>

            <div className="w-full bg-black/50 rounded-full h-3 mb-4 border border-yellow-500/20">
              <div
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${gameLoading.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{Math.round(gameLoading.progress)}% Complete</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-yellow-500/20 ${
          isHorizontal ? "p-2" : "p-3 md:p-4"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <img
                src="https://i.ibb.co/B5bsQbr9/Picsart-25-08-19-19-18-32-062.png"
                alt="Logo"
                className="w-full h-8"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/deposit"
              className={`flex items-center space-x-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 rounded-full transition-all duration-200 hover:scale-105 shadow-lg border border-yellow-400/30 ${
                isHorizontal ? "px-3 py-1.5 text-sm" : "px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg"
              }`}
            >
              <Wallet size={isHorizontal ? 12 : 16} />
              <span className="font-bold text-black">
                {isLoadingBalance ? <span className="animate-pulse">Loading...</span> : `₹${formatBalance(balance)}`}
              </span>
              <Plus size={isHorizontal ? 10 : 14} className="ml-1" />
            </Link>
            <button
              onClick={refreshBalance}
              disabled={isLoadingBalance}
              className={`bg-black/60 hover:bg-black/80 border border-yellow-500/30 rounded-full transition-colors disabled:opacity-50 ${
                isHorizontal ? "p-1.5" : "p-2"
              }`}
              title="Refresh Balance"
            >
              <RefreshCw
                size={isHorizontal ? 12 : 16}
                className={`text-yellow-400 ${isLoadingBalance ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-black/80 border-b border-yellow-500/30 px-4 py-3 flex items-center justify-between">
          {/* Left Side - Avatar & Username */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500/50">
              <Link href="/profile">
                <Image
                  src="/profile-girl.jpeg"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </Link>
            </div>
            <div className="flex flex-col">
              <span className="text-yellow-300 font-semibold text-sm">{username || "Player12345"}</span>
              <span className="text-xs text-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 font-bold shadow-lg hover:scale-105 transition-transform">
                VIP 0
              </span>
            </div>
          </div>

          {/* Right Side - Deposit & Withdraw */}
          <div className="flex items-center space-x-2">
            <Link
              href="/deposit"
              className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold text-xs shadow-lg hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <img src="https://i.ibb.co/RGBYTTwB/Deposit-D0r-Ek-R4a.png" alt="Deposit" className="w-full h-6" />
              Deposit
            </Link>
            <Link
              href="/withdraw"
              className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold text-xs shadow-lg hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <img src="https://i.ibb.co/vv1Thd4c/Withdraw-DHhv-Ss-MY.png" alt="Withdraw" className="w-full h-6" />
              Withdraw
            </Link>
          </div>
        </div>
      </header>

      {/* Withdraw Ticker */}
      <WithdrawTicker />

      {/* Floating Welcome Notification */}
      {showWelcomeNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-yellow-400/30">
            <p className="text-sm md:text-base font-bold">Welcome back, {username}! 🎮</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isHorizontal ? (
        /* Horizontal Layout */
        <div className="flex h-[calc(100vh-60px)]">
          {/* Vertical Banner */}

          {/* Left Sidebar */}
          <div className="w-16 bg-black/80 backdrop-blur-sm border-r border-yellow-500/20 flex flex-col items-center py-2 space-y-2">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
                selectedFilter === "ALL"
                  ? "bg-yellow-600 text-black border-yellow-400"
                  : "bg-black/60 text-yellow-400 hover:bg-black/80 border-yellow-500/30"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            {["SL", "FH", "CB", "OT"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
                  selectedFilter === filter
                    ? "bg-yellow-600 text-black border-yellow-400"
                    : "bg-black/60 text-yellow-400 hover:bg-black/80 border-yellow-500/30"
                }`}
              >
                {getGameTypeIcon(filter)}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden p-2">
            {/* Games Section - 2 Rows */}
            <div className="h-full overflow-x-auto scrollbar-hide">
              <div className="grid grid-rows-2 grid-flow-col gap-2 h-full" style={{ width: "max-content" }}>
                {filteredGames.slice(0, 20).map((game) => (
                  <div
                    key={game.g_code}
                    className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                    onClick={() => launchGame(game.g_code, game.p_type, game.gameName)}
                  >
                    <div className="relative w-28 h-36 bg-gradient-to-br from-black via-gray-900 to-black rounded-lg overflow-hidden shadow-lg border border-yellow-500/30">
                      <Image
                        src={game.imgFileName || "/placeholder.svg"}
                        alt={game.gameName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Hot/New Badge */}
                      <div className="absolute top-1 left-1">
                        <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                          Hot
                        </span>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                          <div className="w-0 h-0 border-l-[6px] border-l-black border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1" />
                        </div>
                      </div>

                      {/* Game Title */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                        <h4 className="text-yellow-300 font-bold text-xs truncate">{game.gameName}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vertical Layout (Original) */
        <div className="max-w-6xl mx-auto p-3 md:p-6 space-y-6 md:space-y-8 pb-20">
          {/* Banner Slider */}
          <div className="relative w-full h-40 md:h-60 lg:h-72 mb-6 md:mb-8 overflow-hidden rounded-xl md:rounded-2xl border border-yellow-500/30">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {bannerData.map((banner, index) => (
                <div
                  key={banner.id}
                  className="w-full h-full flex-shrink-0 relative cursor-pointer group bg-gradient-to-r from-black via-gray-900 to-black"
                  onClick={() => launchGame(banner.id, banner.type, banner.name)}
                >
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.name}
                    fill
                    className="object-cover bg-gradient-to-r from-black to-gray-900 group-hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 border border-yellow-500/30">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                        <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors border ${
                    index === currentBanner ? "bg-yellow-400 border-yellow-300" : "bg-black/50 border-yellow-500/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 bg-black/60 border border-yellow-500/30 rounded-full text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 text-sm md:text-base backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["ALL", "SL", "FH", "CB", "OT"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 md:px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm border ${
                    selectedFilter === filter
                      ? "bg-yellow-600 text-black border-yellow-400"
                      : "bg-black/60 text-yellow-300 hover:bg-black/80 border-yellow-500/30"
                  }`}
                >
                  {filter === "ALL" ? "All Games" : getGameTypeLabel(filter)}
                </button>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          <div className="space-y-6">
            {/* Popular Games Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center gap-2">
                  🔥 Popular Games
                </h2>
                <button className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {filteredGames.slice(0, 20).map((game) => (
                  <div
                    key={`popular-${game.g_code}`}
                    className="relative cursor-pointer hover:scale-105 transition-all duration-300 group flex-shrink-0"
                    onClick={() => launchGame(game.g_code, game.p_type, game.gameName)}
                  >
                    <div className="relative w-24 md:w-32 aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative w-full h-full p-2 flex items-center justify-center">
                        <Image
                          src={game.imgFileName || "/placeholder.svg"}
                          alt={game.gameName}
                          width={80}
                          height={100}
                          className="object-contain drop-shadow-lg max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 border border-yellow-500/30">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                              <div className="w-0 h-0 border-l-[4px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-1 right-1">
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent" />

                      <div className="absolute bottom-1 left-1 right-1 text-center">
                        <h3 className="text-yellow-300 font-bold text-xs truncate">{game.gameName}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slots Games Section */}
            {filteredGames.filter((game) => game.p_type === "SL").length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center gap-2">
                    🎰 Slot Games
                  </h2>
                  <button
                    onClick={() => setSelectedFilter("SL")}
                    className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide bg-black mx-0 py-2.5 px-2.5 border-0 rounded-2xl">
                  {filteredGames
                    .filter((game) => game.p_type === "SL")
                    .slice(0, 20)
                    .map((game) => (
                      <div
                        key={`slots-${game.g_code}`}
                        className="relative cursor-pointer hover:scale-105 transition-all duration-300 group flex-shrink-0"
                        onClick={() => launchGame(game.g_code, game.p_type, game.gameName)}
                      >
                        <div className="relative w-24 md:w-32 aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                          <div className="relative w-full h-full p-2 flex items-center justify-center">
                            <Image
                              src={game.imgFileName || "/placeholder.svg"}
                              alt={game.gameName}
                              width={80}
                              height={100}
                              className="object-contain drop-shadow-lg max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 border border-yellow-500/30">
                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                                  <div className="w-0 h-0 border-l-[4px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute top-1 right-1">
                            <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                              SLOT
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent" />

                          <div className="absolute bottom-1 left-1 right-1 text-center">
                            <h3 className="text-yellow-300 font-bold text-xs truncate">{game.gameName}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Fishing Games Section */}
            {filteredGames.filter((game) => game.p_type === "FH").length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center gap-2">
                    🐟 Fishing Games
                  </h2>
                  <button
                    onClick={() => setSelectedFilter("FH")}
                    className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {filteredGames
                    .filter((game) => game.p_type === "FH")
                    .slice(0, 20)
                    .map((game) => (
                      <div
                        key={`fishing-${game.g_code}`}
                        className="relative cursor-pointer hover:scale-105 transition-all duration-300 group flex-shrink-0"
                        onClick={() => launchGame(game.g_code, game.p_type, game.gameName)}
                      >
                        <div className="relative w-24 md:w-32 aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                          <div className="relative w-full h-full p-2 flex items-center justify-center">
                            <Image
                              src={game.imgFileName || "/placeholder.svg"}
                              alt={game.gameName}
                              width={80}
                              height={100}
                              className="object-contain drop-shadow-lg max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 border border-yellow-500/30">
                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                                  <div className="w-0 h-0 border-l-[4px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute top-1 right-1">
                            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                              FISH
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent" />

                          <div className="absolute bottom-1 left-1 right-1 text-center">
                            <h3 className="text-yellow-300 font-bold text-xs truncate">{game.gameName}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Card Games Section */}
            {filteredGames.filter((game) => game.p_type === "CB").length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center gap-2">
                    🃏 Card Games
                  </h2>
                  <button
                    onClick={() => setSelectedFilter("CB")}
                    className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {filteredGames
                    .filter((game) => game.p_type === "CB")
                    .slice(0, 20)
                    .map((game) => (
                      <div
                        key={`cards-${game.g_code}`}
                        className="relative cursor-pointer hover:scale-105 transition-all duration-300 group flex-shrink-0"
                        onClick={() => launchGame(game.g_code, game.p_type, game.gameName)}
                      >
                        <div className="relative w-24 md:w-32 aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                          <div className="relative w-full h-full p-2 flex items-center justify-center">
                            <Image
                              src={game.imgFileName || "/placeholder.svg"}
                              alt={game.gameName}
                              width={80}
                              height={100}
                              className="object-contain drop-shadow-lg max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 border border-yellow-500/30">
                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                                  <div className="w-0 h-0 border-l-[4px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute top-1 right-1">
                            <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                              CARD
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent" />

                          <div className="absolute bottom-1 left-1 right-1 text-center">
                            <h3 className="text-yellow-300 font-bold text-xs truncate">{game.gameName}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Other Games Section */}
            {filteredGames.filter((game) => game.p_type === "OT").length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center gap-2">
                    ⚡ Other Games
                  </h2>
                  <button
                    onClick={() => setSelectedFilter("OT")}
                    className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {filteredGames
                    .filter((game) => game.p_type === "OT")
                    .slice(0, 20)
                    .map((game) => (
                      <div
                        key={`others-${game.g_code}`}
                        className="relative cursor-pointer hover:scale-105 transition-all duration-300 group flex-shrink-0"
                        onClick={() => launchGame(game.g_code, game.p_type, game.gameName)}
                      >
                        <div className="relative w-24 md:w-32 aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-yellow-500/30">
                          <div className="relative w-full h-full p-2 flex items-center justify-center">
                            <Image
                              src={game.imgFileName || "/placeholder.svg"}
                              alt={game.gameName}
                              width={80}
                              height={100}
                              className="object-contain drop-shadow-lg max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 border border-yellow-500/30">
                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                                  <div className="w-0 h-0 border-l-[4px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute top-1 right-1">
                            <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                              NEW
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent" />

                          <div className="absolute bottom-1 left-1 right-1 text-center">
                            <h3 className="text-yellow-300 font-bold text-xs truncate">{game.gameName}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* NfilteredGames Section */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-6">
              {NfilteredGames.map((game) => (
                <div
                  key={game.g_code}
                  className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                  onClick={() => launchGame(game.g_code, game.p_type, game.gameName, game.Pcode)}
                >
                  <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl border border-yellow-500/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative w-full h-full p-2 md:p-4 flex items-center justify-center">
                      <Image
                        src={game.imgFileName || "/placeholder.svg"}
                        alt={game.gameName}
                        width={120}
                        height={160}
                        className="object-contain drop-shadow-lg md:drop-shadow-2xl max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                      />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 md:p-3 border border-yellow-500/30">
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                            <div className="w-0 h-0 border-l-[6px] md:border-l-[8px] border-l-black border-t-[4px] md:border-t-[6px] border-t-transparent border-b-[4px] md:border-b-[6px] border-b-transparent ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-1 md:top-2 right-1 md:right-2">
                      <span className="bg-black/70 backdrop-blur-sm text-yellow-300 text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border border-yellow-500/30">
                        {getGameTypeLabel(game.p_type)}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-t from-black/80 to-transparent" />

                    <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 right-1 md:right-2 text-center">
                      <h3 className="text-yellow-300 font-bold text-xs md:text-sm drop-shadow-lg truncate">
                        {game.gameName}
                      </h3>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>
                </div>
              ))}
            </div>

            {/* All Games Section (fallback when search is active) */}
            {searchTerm && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-yellow-400 flex items-center gap-2">
                    🔍 Search Results
                  </h2>
                  <span className="text-yellow-300 text-sm">{filteredGames.length} games found</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-6">
                  {filteredGames.map((game) => (
                    <div
                      key={game.g_code}
                      className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                      onClick={() => launchGame(game.g_code, game.p_type, game.gameName, game.Pcode)}
                    >
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl border border-yellow-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative w-full h-full p-2 md:p-4 flex items-center justify-center">
                          <Image
                            src={game.imgFileName || "/placeholder.svg"}
                            alt={game.gameName}
                            width={120}
                            height={160}
                            className="object-contain drop-shadow-lg md:drop-shadow-2xl max-w-full max-h-full group-hover:scale-110 transition-transform duration-300"
                          />

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 md:p-3 border border-yellow-500/30">
                              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                                <div className="w-0 h-0 border-l-[6px] md:border-l-[8px] border-l-black border-t-[4px] md:border-t-[6px] border-t-transparent border-b-[4px] md:border-b-[6px] border-b-transparent ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-1 md:top-2 right-1 md:right-2">
                          <span className="bg-black/70 backdrop-blur-sm text-yellow-300 text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border border-yellow-500/30">
                            {getGameTypeLabel(game.p_type)}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-t from-black/80 to-transparent" />

                        <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 right-1 md:right-2 text-center">
                          <h3 className="text-yellow-300 font-bold text-xs md:text-sm drop-shadow-lg truncate">
                            {game.gameName}
                          </h3>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">No games found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
