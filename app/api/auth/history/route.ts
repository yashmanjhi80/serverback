import { type NextRequest, NextResponse } from "next/server"
import { APP_CONFIG } from "@/config/app"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ success: false, message: "Username required" }, { status: 400 })
    }

    const apiUrl = `${APP_CONFIG.API.BASE_URL}${APP_CONFIG.API.ENDPOINTS.TRANSACTIONS}/${username}`

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API Error ${res.status}:`, errorText)
      return NextResponse.json(
        { success: false, message: `API returned ${res.status}: ${errorText}` },
        { status: res.status },
      )
    }

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text()
      console.error("Non-JSON response:", text)
      return NextResponse.json({ success: false, message: "Invalid response format from API" }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("History API Error:", error)
    return NextResponse.json({ success: false, message: `Failed to fetch history: ${error.message}` }, { status: 500 })
  }
}
