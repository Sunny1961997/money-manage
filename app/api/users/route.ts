import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  console.log("[API] /api/users POST called")

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    console.log("[API] Request body:", body)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log("[API] User create response:", data)

    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to create user" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[API] User create error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to create user" },
      { status: 500 }
    )
  }
}
