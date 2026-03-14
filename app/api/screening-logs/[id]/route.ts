import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const body = await req.json()
    const { id } = await params
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/screening-logs/${id}`
    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to update screening log" },
        { status: res.status }
      )
    }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err.message || "Failed to update screening log" },
      { status: 500 }
    )
  }
}
