import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null
  const { id } = await params

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}`
  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
    credentials: "include",
  })

  // Log the response status and body for debugging
  const text = await res.text()
  console.log("Ticket Details API Response Status:", res.status)
  console.log("Ticket Details API Response Body:", text)

  if (!res.ok) {
    return NextResponse.json({ status: false, error: text }, { status: res.status })
  }

  // Try to parse JSON, fallback to text
  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    data = text
  }
  return NextResponse.json(data)
}
