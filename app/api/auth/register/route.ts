import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/config/app"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Username, email, and password are required." },
        { status: 400 },
      )
    }

    console.log("Proxying registration request to backend for user:", body.username)

    const response = await fetch(getApiUrl("REGISTER"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        password: body.password,
      }),
    })

    const data = await response.json()
    console.log("Received response from backend:", data)

    // Return the response with the same status code from backend
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("Registration API route error:", error.message)
    // Provide a more specific error message from the fetch error
    return NextResponse.json(
      { success: false, message: `Failed to connect to backend: ${error.message}` },
      { status: 500 },
    )
  }
}
