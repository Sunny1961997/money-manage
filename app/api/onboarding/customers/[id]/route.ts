import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  console.log("[API] /api/onboarding/customers/:id GET called")

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const { id } = await params

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/onboarding/customers/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        Accept: "application/json",
      },
      credentials: "include",
    })

    const data = await res.json()
    console.log("[API] Customer details response:", data)

    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to fetch customer" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[API] Customer fetch error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to fetch customer" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  console.log("[API] /api/onboarding/customers/:id PUT called")

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const formData = await req.formData()

    console.log("[API] Updating customer ID:", id)
    console.log("[API] FormData entries:", Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name}` : value]))

    // Laravel requires POST method with _method=PUT for FormData
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/onboarding/customers/${id}`, {
      method: "POST", // Changed to POST for Laravel FormData handling
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        Accept: "application/json",
        // Don't set Content-Type - let the browser set it with boundary for multipart/form-data
      },
      credentials: "include",
      body: formData,
    })

    const data = await res.json()
    console.log("[API] Customer update response:", data)

    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to update customer" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[API] Customer update error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to update customer" },
      { status: 500 }
    )
  }
}

// POST handler for FormData updates (same as PUT)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return PUT(req, { params })
}
