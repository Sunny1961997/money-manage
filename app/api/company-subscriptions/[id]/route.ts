import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
    const match = cookie.match(/session_token=([^;]+)/)
    return match ? match[1] : null
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookie = req.headers.get("cookie") || ""
    const token = getTokenFromCookie(cookie)
    const decodedToken = token ? decodeURIComponent(token) : null

    const url = new URL(req.url)
    const offset = url.searchParams.get("offset") || "0"
    const limit = url.searchParams.get("limit") || "10"

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }
    if (decodedToken) {
        headers["Authorization"] = `Bearer ${decodedToken}`
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company-subscriptions/${id}?offset=${offset}&limit=${limit}`

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
