import { NextResponse } from "next/server"

// Helper to extract session token from cookies
function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function POST(req: Request) {


  try {
    const body = await req.json()
    console.log("[API] Contact Request body:", body)

    // Use the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'; 

    // Prepare headers
    const headers: HeadersInit = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }

    // Add Authorization header if a token exists (optional for public forms, mandatory for protected)
    const cookie = req.headers.get("cookie") || ""
    const token = getTokenFromCookie(cookie)
    const decodedToken = token ? decodeURIComponent(token) : null
    
    if (decodedToken) {
      headers["Authorization"] = `Bearer ${decodedToken}`
    }

    const res = await fetch(`${backendUrl}/api/contacts`, {
      method: "POST",
      headers: headers,
      credentials: "include", // Important for passing cookies if needed
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log("[API] Contact submit response:", data)

    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to submit contact form caused by server" },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("[API] Contact submit error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}