import { type NextRequest, NextResponse } from "next/server"
import { APP_CONFIG, getApiUrl } from "@/config/app"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const password = searchParams.get("password")
    const type = searchParams.get("type")
    const provider_code = searchParams.get("provider_code")
    const gameid = searchParams.get("gameid") || "0"
    const lang = searchParams.get("lang") || APP_CONFIG.GAME.DEFAULT_LANGUAGE
    const html5 = searchParams.get("html5") || APP_CONFIG.GAME.HTML5_ENABLED
    const blimit = searchParams.get("blimit") || ""

    if (!username || !password || !type) {
      return NextResponse.json(
        { success: false, message: "Username, password, and type are required." },
        { status: 400 },
      )
    }

    console.log("Launching game for user:", username, "type:", type, "gameid:", gameid , "providercode:", provider_code)

    // Build query parameters
    const params = new URLSearchParams({
      username,
      password,
      type,
      provider_code,
      gameid,
      lang,
      html5,
    })

    if (blimit) {
      params.append("blimit", blimit)
    }

    const launchGameUrl = `${getApiUrl("LAUNCH_GAME")}?${params.toString()}`

    const response = await fetch(launchGameUrl, {
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
