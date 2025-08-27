"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface FormData {
  accountNumber: string
  retypeAccountNumber: string
  ifscCode: string
  name: string
  phone: string
  email: string
}

export default function VerifyAccountPage() {
  const [formData, setFormData] = useState<FormData>({
    accountNumber: "",
    retypeAccountNumber: "",
    ifscCode: "",
    name: "",
    phone: "",
    email: "",
  })

const router = useRouter()

const handleGoBack = () => {
  router.push("/")
}


  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form validation and submission
    console.log("Submitting verification:", formData)
  }

  return (
    <div className="max-w-sm mx-auto bg-linear-65 from-burgundy-800 to-burgundy-960 min-h-screen">
   
        {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <Link href="/home" className="text-yellow-300 hover:text-yellow-200 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-yellow-400">My Wallet</h1>
          <div></div>

                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
        </div>
      </header>

   <div className="p-4" >

        {/* Verification Form */}
        <form className="space-y-7" onSubmit={handleSubmit}>
          {/* Account Number */}
          <div>
            <Label className="block text-golden text-base font-medium mb-3" data-testid="label-account-number">
              Account Number
            </Label>
            <Input
              type="text"
              placeholder="Enter your Bank Account Number"
              className="w-full bg-gradient-to-r from-navy-700 to-navy-600 border border-golden/30 rounded-xl px-6 py-5 text-white placeholder-golden/50 focus:outline-none focus:border-golden focus:shadow-xl focus:shadow-golden/30 transition-all font-medium text-base shadow-lg"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
              data-testid="input-account-number"
            />
          </div>

          {/* Retype Account Number */}
          <div>
            <Label className="block text-golden text-base font-medium mb-3" data-testid="label-retype-account">
              Retype Account Number
            </Label>
            <Input
              type="text"
              placeholder="Enter your Bank Account Number"
              className="w-full bg-gradient-to-r from-navy-700 to-navy-600 border border-golden/30 rounded-xl px-6 py-5 text-white placeholder-golden/50 focus:outline-none focus:border-golden focus:shadow-xl focus:shadow-golden/30 transition-all font-medium text-base shadow-lg"
              value={formData.retypeAccountNumber}
              onChange={(e) => handleInputChange("retypeAccountNumber", e.target.value)}
              data-testid="input-retype-account"
            />
          </div>

          {/* IFSC Code */}
          <div>
            <Label className="block text-golden text-base font-medium mb-3" data-testid="label-ifsc-code">
              IFSC Code
            </Label>
            <Input
              type="text"
              placeholder="Enter 11-digit IFSC Code"
              className="w-full bg-gradient-to-r from-navy-700 to-navy-600 border border-golden/30 rounded-xl px-6 py-5 text-white placeholder-golden/50 focus:outline-none focus:border-golden focus:shadow-xl focus:shadow-golden/30 transition-all font-medium text-base shadow-lg"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange("ifscCode", e.target.value)}
              data-testid="input-ifsc-code"
            />
          </div>

          {/* Name */}
          <div>
            <Label className="block text-golden text-base font-medium mb-3" data-testid="label-name">
              Name
            </Label>
            <Input
              type="text"
              placeholder="Enter your Name"
              className="w-full bg-gradient-to-r from-navy-700 to-navy-600 border border-golden/30 rounded-xl px-6 py-5 text-white placeholder-golden/50 focus:outline-none focus:border-golden focus:shadow-xl focus:shadow-golden/30 transition-all font-medium text-base shadow-lg"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              data-testid="input-name"
            />
          </div>

          {/* Phone */}
          <div>
            <Label className="block text-golden text-base font-medium mb-3" data-testid="label-phone">
              Phone
            </Label>
            <Input
              type="tel"
              placeholder="Enter your Mobile Number"
              className="w-full bg-gradient-to-r from-navy-700 to-navy-600 border border-golden/30 rounded-xl px-6 py-5 text-white placeholder-golden/50 focus:outline-none focus:border-golden focus:shadow-xl focus:shadow-golden/30 transition-all font-medium text-base shadow-lg"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              data-testid="input-phone"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="block text-golden text-base font-medium mb-3" data-testid="label-email">
              Email
            </Label>
            <Input
              type="email"
              placeholder="Enter your Email"
              className="w-full bg-gradient-to-r from-navy-700 to-navy-600 border border-golden/30 rounded-xl px-6 py-5 text-white placeholder-golden/50 focus:outline-none focus:border-golden focus:shadow-xl focus:shadow-golden/30 transition-all font-medium text-base shadow-lg"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              data-testid="input-email"
            />
          </div>

          {/* Golden Separator */}
          <div className="w-full h-0.5 bg-golden my-8"></div>

          {/* Important Notice */}
          <div className="bg-gradient-to-br from-navy-700 via-navy-600 to-navy-700 rounded-xl p-6 border-2 border-golden/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-2 right-8 w-16 h-0.5 bg-golden/30 rotate-12"></div>
            <div className="absolute bottom-4 left-6 w-12 h-0.5 bg-golden/30 -rotate-12"></div>
            <h3
              className="text-golden text-center font-medium mb-3 text-lg relative z-10"
              data-testid="text-important-title"
            >
              IMPORTANT
            </h3>
            <p
              className="text-white text-base text-center font-light relative z-10"
              data-testid="text-important-message"
            >
              1.Make sure your bank information is correct.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <Button
              type="submit"
              className="bg-gradient-to-b from-yellow-300 via-golden to-yellow-600 text-black font-medium py-5 px-20 rounded-full text-base hover:from-yellow-400 hover:via-golden hover:to-yellow-700 transition-all duration-300 shadow-xl border border-yellow-400 relative overflow-hidden"
              size="lg"
              data-testid="button-submit-verification"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full"></div>
              <div className="absolute top-1 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
              <span className="relative z-10 tracking-wide">Submit Details</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
