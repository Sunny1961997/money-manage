import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  const headers: Record<string, string> = {}
  if (decodedToken) headers.Authorization = `Bearer ${decodedToken}`

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/countries`, {
    method: "GET",
    headers,
    cache: "no-store",
  })

  const text = await res.text()
  try {
    const data = JSON.parse(text)
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { status: false, message: text || "Invalid response from backend" },
      { status: res.status || 500 }
    )
  }
}