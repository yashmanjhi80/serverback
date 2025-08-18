import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/config/app"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const password = searchParams.get("password")

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required." }, { status: 400 })
    }

    console.log("Fetching balance for user:", username)

    const balanceUrl = `${getApiUrl("BALANCE")}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`

    const response = await fetch(balanceUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    console.log("Balance API response:", data)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch balance" },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Balance API route error:", error.message)
    return NextResponse.json(
      { success: false, message: `Failed to connect to backend: ${error.message}` },
      { status: 500 },
    )
  }
}
