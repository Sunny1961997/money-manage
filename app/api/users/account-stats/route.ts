import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  console.log("[API] /api/users/account-stats GET called")

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/account-stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        Accept: "application/json",
      },
      credentials: "include",
    })

    const data = await res.json()
    console.log("[API] Account stats response:", data)

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("[API] Account stats error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to fetch account stats" },
      { status: 500 }
    )
  }
}
