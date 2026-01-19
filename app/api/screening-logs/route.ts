import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  console.log("[API] /api/screening-logs called")

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(req.url)
    const limit = searchParams.get("limit") || "15"
    const offset = searchParams.get("offset") || "1"

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/screening-logs?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${decodedToken}`,
          Accept: "application/json",
        },
        credentials: "include",
      }
    )

    const data = await res.json()
    console.log("[API] Screening logs response:", data)

    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to fetch screening logs" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[API] Screening logs fetch error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to fetch screening logs" },
      { status: 500 }
    )
  }
}
