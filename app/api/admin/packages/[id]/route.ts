import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`
  }

  const { id } = params
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/packages/${id}`

  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
    credentials: "include",
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
    const { id } = params
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/packages/${id}`
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
        data || { status: false, message: "Failed to update package" },
        { status: res.status }
      )
    }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err.message || "Failed to update package" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  if (!decodedToken) {
    return NextResponse.json(
      { status: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { id } = params
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/packages/${id}`
    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${decodedToken}`,
        Accept: "application/json",
      },
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(
        data || { status: false, message: "Failed to delete package" },
        { status: res.status }
      )
    }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err.message || "Delete error" },
      { status: 500 }
    )
  }
}
