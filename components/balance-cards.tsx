import { Wallet, Banknote } from "lucide-react"

interface BalanceCardsProps {
  cashBalance?: number
  withdrawableAmount?: number
}

export function BalanceCards({ cashBalance = 0, withdrawableAmount = 0 }: BalanceCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl p-5 relative overflow-hidden shadow-lg border border-white/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-8 w-16 h-0.5 bg-white/40 rotate-12"></div>
          <div className="absolute bottom-8 left-12 w-12 h-0.5 bg-white/40 -rotate-12"></div>
          <div className="absolute top-8 left-4 w-8 h-0.5 bg-white/40 rotate-45"></div>
        </div>
        <div className="relative z-10">
          <p className="text-white text-sm font-medium mb-1" data-testid="text-cash-balance-label">
            Cash Balance
          </p>
          <p className="text-white text-3xl font-bold" data-testid="text-cash-balance-amount">
            {cashBalance}
          </p>
        </div>
        <div className="absolute -right-2 -bottom-2 opacity-20">
          <Wallet className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl p-5 relative overflow-hidden shadow-lg border border-white/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-6 right-6 w-14 h-0.5 bg-white/40 rotate-12"></div>
          <div className="absolute bottom-6 left-8 w-10 h-0.5 bg-white/40 -rotate-12"></div>
          <div className="absolute top-4 left-6 w-6 h-0.5 bg-white/40 rotate-45"></div>
        </div>
        <div className="relative z-10">
          <p className="text-white text-sm font-medium mb-1" data-testid="text-withdrawable-label">
            Withdrawable
          </p>
          <p className="text-white text-3xl font-bold" data-testid="text-withdrawable-amount">
            {withdrawableAmount}
          </p>
        </div>
        <div className="absolute -right-2 -bottom-2 opacity-20">
          <Banknote className="w-10 h-10 text-white" />
        </div>
      </div>
    </div>
  )
}
