import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""

  const res = await fetch("http://127.0.0.1:8000/api/me", {
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
