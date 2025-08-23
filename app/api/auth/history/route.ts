// app/api/auth/history/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/config/app"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(getApiUrl("TRANSACTIONS"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // you might need auth headers if backend requires token
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("History API error:", error.message)
    return NextResponse.json(
      { success: false, message: `Failed to fetch history: ${error.message}` },
      { status: 500 },
    )
  }
}
