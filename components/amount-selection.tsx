"use client"

import { useState } from "react"

interface AmountSelectionProps {
  onAmountSelect?: (amount: number) => void
  selectedAmount?: number
}

const predefinedAmounts = [110, 220, 500, 1000, 2000, 5000, 10000, 20000]

export function AmountSelection({ onAmountSelect, selectedAmount = 110 }: AmountSelectionProps) {
  const [selected, setSelected] = useState(selectedAmount)

  const handleAmountClick = (amount: number) => {
    setSelected(amount)
    onAmountSelect?.(amount)
  }

  return (
    <div className="mb-6">
      <h2 className="text-white text-lg font-bold mb-5" data-testid="text-withdraw-amount-title">
        Withdraw Amount
      </h2>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAmountClick(amount)}
            className={`font-medium py-3 px-4 rounded-3xl text-xs transition-all duration-300 ${
              selected === amount
                ? "bg-yellow-300 text-pure-black shadow-lg shadow-yellow-400/30"
                : "bg-slate-700 text-yellow-300 hover:bg-slate-600 shadow-md"
            }`}
            data-testid={`button-amount-${amount}`}
          >
            ₹{amount}
          </button>
        ))}
      </div>
    </div>
  )
}
