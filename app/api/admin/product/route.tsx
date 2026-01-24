import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  // --- FIX STARTS HERE ---
  // Get the search parameters from the incoming request URL
  const { searchParams } = new URL(req.url)
  const queryString = searchParams.toString() 
  
  // Append the query string to your backend URL
  const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/product${queryString ? `?${queryString}` : ''}`
  
  console.log("[API] Forwarding GET to:", backendUrl)
  // --- FIX ENDS HERE ---

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const res = await fetch(backendUrl, { // Use the backendUrl with params
      method: "GET",
      headers: {
        "Authorization": `Bearer ${decodedToken}`,
        "Accept": "application/json",
      },
    })

    const data = await res.json()
    console.log("[API] product response:", data)

    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to fetch products" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[API] Products fetch error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  console.log("[API] /api/admin/product POST called")

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    console.log("[API] Request body:", body)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/product`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${decodedToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log("[API] product create response:", data)

    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to create product" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[API] products create error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to create product" },
      { status: 500 }
    )
  }
}
