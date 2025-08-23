"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, Calendar } from "lucide-react"

interface Transaction {
  _id: string
  orderId: string
  username: string
  amount: number
  walletProvider?: string
  status: "pending" | "paid"
  createdAt: string
}

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // fetch from API
const fetchTransactions = async (username) => {
  try {
    const response = await fetch(`/api/transactions/${username}`);
    const data = await response.json();
    if (data.success) {
      setTransactions(data.transactions);
    }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }


  useEffect(() => {
    const loadUserDataAndBalance = async () => {
      try {
        const storedCredentials = localStorage.getItem("userCredentials")
        if (storedCredentials) {
          const credentials: UserCredentials = JSON.parse(storedCredentials)
          setUsername(credentials.username)
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


useEffect(() => {
  if (credentials?.username) {
    fetchTransactions(credentials.username);
  }
}, [user]);


  // filter by selectedDate
  const filtered = transactions.filter((t) => t.createdAt.startsWith(selectedDate))

  // calculate total
  const total = filtered.reduce((sum, t) => sum + (t.amount || 0), 0)

  const formatCurrency = (amount: number) => `₹${amount}`

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black relative border-b border-yellow-500/20">
        <div className="px-4 py-3 flex items-center justify-center relative">
          <button
            className="absolute left-4 active:scale-95 transition-transform"
            onClick={handleBack}
          >
            <ChevronLeft className="w-5 h-5 text-yellow-400" />
          </button>
          <h1 className="text-lg font-bold text-yellow-400">History</h1>
        </div>
        {/* golden glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
      </div>

      {/* Date filter + total */}
      <div className="px-4 py-3 bg-black/70 border-b border-yellow-500/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-black text-yellow-400 border border-yellow-500/40 rounded px-2 py-1 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <span className="text-yellow-400 font-medium text-sm">
            Total: {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Transactions */}
      <div>
        {loading ? (
          <div className="px-4 py-12 text-center text-yellow-400/70">Loading...</div>
        ) : filtered.length > 0 ? (
          filtered.map((t, i) => {
            const date = new Date(t.createdAt)
            const formattedDate = date.toISOString().split("T")[0]
            const formattedTime = date.toTimeString().split(" ")[0]

            return (
              <div key={t._id}>
                <div className="px-4 py-3 hover:bg-black/50 transition-all">
                  <div className="flex items-center justify-between">
                    {/* left */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                        <span>{formattedDate}</span>
                        <span>{formattedTime}</span>
                      </div>
                      <div className="text-xs text-yellow-500/80 font-mono mb-1">
                        {t.orderId}
                      </div>
                      <div className="text-xs text-gray-400">{t.walletProvider}</div>
                    </div>

                    {/* right */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400 mb-1">
                        +{formatCurrency(t.amount)}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          t.status === "pending" ? "text-orange-400" : "text-green-400"
                        }`}
                      >
                        {t.status === "pending" ? "Pending" : "Success"}
                      </div>
                    </div>
                  </div>
                </div>
                {i < filtered.length - 1 && <div className="border-b border-yellow-500/30"></div>}
              </div>
            )
          })
        ) : (
          <div className="px-4 py-12 text-center text-yellow-400/60">
            No transactions found
          </div>
        )}
      </div>
    </div>
  )
}
