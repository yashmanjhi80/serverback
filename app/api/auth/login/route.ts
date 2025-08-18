import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://congenial-space-computing-machine-p67v65p5wj4crpxw-4000.app.github.dev"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json({ success: false, message: "Username and password are required." }, { status: 400 })
    }

    console.log("Proxying login request to backend for user:", body.username)

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    })

    const data = await response.json()
    console.log("Received response from backend:", data)

    // Return the response with the same status code from backend
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("Login API route error:", error.message)
    // Provide a more specific error message from the fetch error
    return NextResponse.json(
      { success: false, message: `Failed to connect to backend: ${error.message}` },
      { status: 500 },
    )
  }
}
