import { NextResponse } from "next/server"

export const runtime = "nodejs"

function buildUpstreamUrl(rawPath: string) {
  const apiBaseUrl = String(process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/$/, "")
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured")
  }

  const apiBase = new URL(apiBaseUrl)
  const input = String(rawPath || "").trim()
  if (!input) {
    return ""
  }

  if (/^https?:\/\//i.test(input)) {
    const upstream = new URL(input)
    const allowedHosts = new Set([apiBase.host, "127.0.0.1:8000", "localhost:8000"])

    if (!allowedHosts.has(upstream.host)) {
      throw new Error("Unsupported report host")
    }

    return upstream.toString()
  }

  const normalizedPath = input
    .replace(/^\/+/, "")
    .replace(/^storage\//, "")

  return `${apiBaseUrl}/storage/${normalizedPath}`
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filePath = (searchParams.get("path") || "").trim().replace(/^\/+/, "")
    const fileName = (searchParams.get("fileName") || "").trim()

    if (!filePath) {
      return NextResponse.json(
        { status: false, message: "File path is required" },
        { status: 400 }
      )
    }

    const upstreamUrl = buildUpstreamUrl(filePath)
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Accept: "application/octet-stream,application/pdf,*/*",
      },
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { status: false, message: "This report is not available for download." },
        { status: upstream.status }
      )
    }

    const data = await upstream.arrayBuffer()
    const contentType = upstream.headers.get("content-type") || "application/octet-stream"
    const upstreamDisposition = upstream.headers.get("content-disposition")
    const safeFileName = fileName || filePath.split("/").pop() || "screening-report"

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": upstreamDisposition || `attachment; filename="${safeFileName}"`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to download report"

    return NextResponse.json(
      { status: false, message },
      { status: 500 }
    )
  }
}