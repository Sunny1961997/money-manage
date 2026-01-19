import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null
  console.log("Onboarding meta response data:", decodedToken)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/onboarding/meta`, {
    headers,
    credentials: "include",
  })

  if (!res.ok) {
    return NextResponse.json({ status: false }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
