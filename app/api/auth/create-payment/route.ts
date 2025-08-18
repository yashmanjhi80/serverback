import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://congenial-space-computing-machine-p67v65p5wj4crpxw-4000.app.github.dev"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.orderId || !body.amount || !body.username) {
      return NextResponse.json(
        { success: false, message: "orderId, amount, and username are required." },
        { status: 400 },
      )
    }

    // Validate minimum amount
    const amount = Number.parseInt(body.amount, 10)
    if (isNaN(amount) || amount < 100) {
      return NextResponse.json({ success: false, message: "Minimum deposit amount is ₹100" }, { status: 400 })
    }

    console.log("Proxying payment creation request to backend for user:", body.username)

    const response = await fetch(`${API_BASE_URL}/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: body.orderId,
        amount: body.amount,
        username: body.username,
        ip: body.ip || "0.0.0.0",
        remark: body.remark || `Deposit for user ${body.username}`,
      }),
    })

    const data = await response.json()
    console.log("Received payment response from backend:", data)

    // Return the response with the same status code from backend
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("Create payment API route error:", error.message)
    // Provide a more specific error message from the fetch error
    return NextResponse.json(
      { success: false, message: `Failed to connect to backend: ${error.message}` },
      { status: 500 },
    )
  }
}
