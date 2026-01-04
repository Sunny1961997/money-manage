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

  // Forward query params
  const url = new URL(req.url)
  const query = url.search ? url.search : ""
  const apiUrl = `http://127.0.0.1:8000/api/onboarding/customers${query}`
  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
    credentials: "include",
  })

  // Log the response status and body for debugging
  const text = await res.text()
  console.log("API Response Status:", res.status)
  console.log("API Response Body:", text)

  if (!res.ok) {
    return NextResponse.json({ status: false, error: text }, { status: res.status })
  }

  // Try to parse JSON, fallback to text
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  return NextResponse.json(data)
}
