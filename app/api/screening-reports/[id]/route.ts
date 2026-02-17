import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/screening-reports/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${decodedToken}`,
          Accept: "application/json",
        },
      }
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return NextResponse.json(
        data || { status: false, message: "Report not found" },
        { status: res.status }
      )
    }

    // Check if the response is a PDF file (binary)
    const contentType = res.headers.get("content-type") || ""

    if (contentType.includes("application/pdf")) {
      const pdfBuffer = await res.arrayBuffer()
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": res.headers.get("content-disposition") || `attachment; filename="screening_report_${id}.pdf"`,
        },
      })
    }

    // If JSON response (e.g., with a file URL)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[API] Screening report fetch error:", err)
    return NextResponse.json(
      { status: false, message: err.message || "Failed to fetch report" },
      { status: 500 }
    )
  }
}
