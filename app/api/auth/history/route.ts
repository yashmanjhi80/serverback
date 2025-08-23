import { NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/config/app"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ success: false, message: "Username required" }, { status: 400 })
    }

    const res = await fetch(getApiUrl(`TRANSACTIONS/${username}`), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch history: ${error.message}` },
      { status: 500 },
    )
  }
}
