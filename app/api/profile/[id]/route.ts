import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  let params: { id: string }
  if (typeof (context.params as any).then === "function") {
    params = await context.params as { id: string }
  } else {
    params = context.params as { id: string }
  }
  const { id } = params
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    console.log("[API] /api/companies/:id GET called: ", id)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        Accept: "application/json",
      },
      credentials: "include",
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to fetch company" },
        { status: res.status }
      )
    }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ status: false, message: err.message || "Proxy error" }, { status: 500 })
  }
}

export async function PUT(req: Request, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  let params: { id: string }
  if (typeof (context.params as any).then === "function") {
    params = await context.params as { id: string }
  } else {
    params = context.params as { id: string }
  }
  const { id } = params
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized - No session token" },
      { status: 401 }
    )
  }

  try {
    const body = await req.text()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body,
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to update company" },
        { status: res.status }
      )
    }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ status: false, message: err.message || "Proxy error" }, { status: 500 })
  }
}
