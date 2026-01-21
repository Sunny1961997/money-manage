import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`
  }

  // Forward query params to Laravel
  const url = new URL(req.url)
  const query = url.search ? url.search : ""
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/goaml-reports${query}`

  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
    credentials: "include",
  })

  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json({ status: false, error: text }, { status: res.status })
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`
  }

  const body = await req.json()
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/goaml-reports`

  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(body),
  })

  const text = await res.text()
  console.log("GOAML Create Report API Status:", res.status)

  if (!res.ok) {
    return NextResponse.json({ status: false, error: text }, { status: res.status })
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return NextResponse.json(data)
}
