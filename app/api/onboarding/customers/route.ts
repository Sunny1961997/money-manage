import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  if (!decodedToken) {
    return NextResponse.json({ status: false, message: "Unauthorized - No session token" }, { status: 401 })
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${decodedToken}`,
  }

  // Some Laravel middleware requires session cookies as well
  if (cookie) headers["Cookie"] = cookie

  const url = new URL(req.url)
  const query = url.search ? url.search : ""
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/onboarding/customers${query}`

  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
  })

  const text = await res.text()
  if (!res.ok) {
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status })
    } catch {
      return NextResponse.json({ status: false, error: text }, { status: res.status })
    }
  }

  try {
    return NextResponse.json(JSON.parse(text))
  } catch {
    return NextResponse.json({ status: true, data: text })
  }
}
