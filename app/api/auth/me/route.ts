import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me`, {
    headers: {
      cookie,
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!res.ok) {
    return NextResponse.json({ status: false }, { status: 401 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
