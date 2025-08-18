import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://congenial-space-computing-machine-p67v65p5wj4crpxw-4000.app.github.dev"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const password = searchParams.get("password")
    const type = searchParams.get("type")
    const gameid = searchParams.get("gameid") || "0"
    const lang = searchParams.get("lang") || "en-US"
    const html5 = searchParams.get("html5") || "1"
    const blimit = searchParams.get("blimit") || ""

    if (!username || !password || !type) {
      return NextResponse.json(
        { success: false, message: "Username, password, and type are required." },
        { status: 400 },
      )
    }

    console.log("Launching game for user:", username, "type:", type, "gameid:", gameid)

    // Build query parameters
    const params = new URLSearchParams({
      username,
      password,
      type,
      gameid,
      lang,
      html5,
    })

    if (blimit) {
      params.append("blimit", blimit)
    }

    const response = await fetch(`${API_BASE_URL}/launch-game?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    console.log("Launch game API response:", data)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to launch game" },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Launch game API route error:", error.message)
    return NextResponse.json(
      { success: false, message: `Failed to connect to backend: ${error.message}` },
      { status: 500 },
    )
  }
}
