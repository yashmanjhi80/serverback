"use client"

import { Building2, Check, ChevronRight, X } from "lucide-react"

interface BankAccountSectionProps {
  onAddBankAccount?: () => void
  hasVerifiedAccount?: boolean
  accountNumber?: string
}

export function BankAccountSection({
  onAddBankAccount,
  hasVerifiedAccount = true,
  accountNumber = "4031****08",
}: BankAccountSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-white text-base font-medium mb-3" data-testid="text-bank-account-title">
        Bank account
      </h2>

      {/* Add New Bank Account Card */}
      <div
        className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl p-4 mb-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition-colors shadow-lg border border-white/20 relative overflow-hidden w-full"
        onClick={onAddBankAccount}
        data-testid="button-add-bank-account"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-3 right-6 w-12 h-0.5 bg-white/40 rotate-12"></div>
          <div className="absolute bottom-6 left-8 w-8 h-0.5 bg-white/40 -rotate-12"></div>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-md relative z-10">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-white font-bold text-sm" data-testid="text-add-bank-title">
              Add New Bank Account
            </p>
            <p className="text-white/80 text-xs" data-testid="text-add-bank-subtitle">
              Add a new bank account id withdraw to
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-white relative z-10" />
      </div>

      {/* Verified Bank Account Card */}
      {hasVerifiedAccount && (
        <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl p-4 flex items-center justify-between shadow-lg border border-white/20 relative overflow-hidden w-full">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-3 right-6 w-12 h-0.5 bg-white/40 rotate-12"></div>
            <div className="absolute bottom-6 left-8 w-8 h-0.5 bg-white/40 -rotate-12"></div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 border-2 border-golden rounded-lg flex items-center justify-center mr-3 shadow-md relative z-10">
              <Check className="w-5 h-5 text-white font-bold" />
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded mr-2 flex items-center justify-center shadow-sm relative z-10">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-white font-bold text-sm mr-2 relative z-10" data-testid="text-verified-status">
                    VERIFIED
                  </span>
                </div>
                <p className="text-white/80 text-xs font-medium relative z-10" data-testid="text-account-number">
                  {accountNumber}
                </p>
              </div>
            </div>
          </div>
          <button
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-golden hover:text-pure-black transition-all shadow-md relative z-10"
            data-testid="button-remove-account"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
