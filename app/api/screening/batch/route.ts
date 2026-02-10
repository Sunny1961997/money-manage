import { NextRequest, NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const cookie = req.headers.get("cookie") || ""
    const token = getTokenFromCookie(cookie)
    const decodedToken = token ? decodeURIComponent(token) : null

    if (!decodedToken) {
      return NextResponse.json(
        { status: false, message: "Unauthorized - No session token" },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000" 

    const response = await fetch(`${apiUrl}/api/sanction-entities/bulk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
      },
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Batch processing failed" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}
