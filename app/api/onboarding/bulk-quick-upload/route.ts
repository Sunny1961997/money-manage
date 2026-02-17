import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  const formData = await req.formData()
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/onboarding/bulk-quick-upload`

  const headers: Record<string, string> = {}
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers, // Do NOT set Content-Type for FormData
    credentials: "include",
    body: formData,
  })

  const text = await res.text()
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