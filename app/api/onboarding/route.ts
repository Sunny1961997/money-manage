import { NextResponse } from "next/server"

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/)
  return match ? match[1] : null
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = getTokenFromCookie(cookie)
  const decodedToken = token ? decodeURIComponent(token) : null

  // Debug: log incoming request
  console.log("[API] /api/onboarding called")
  console.log("Method:", req.method)
  console.log("Headers:", Object.fromEntries(req.headers.entries()))

  // Try to parse FormData
  let formData: FormData | null = null
  let jsonData: any = null
  let files: any[] = []
  try {
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      formData = await req.formData()
      for (const [key, value] of formData.entries()) {
        if (key === "data" && typeof value === "string") {
          jsonData = JSON.parse(value)
          console.log("Payload data:", jsonData)
        } else if (key === "documents[]" && value instanceof File) {
          files.push({ name: value.name, size: value.size, type: value.type })
        }
      }
      console.log("Uploaded files:", files)
    } else {
      const body = await req.text()
      jsonData = JSON.parse(body)
      console.log("Payload data:", jsonData)
    }
  } catch (err) {
    console.error("Error parsing request body:", err)
  }

  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  }
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`
  }

  let forwardBody: any = null
  let forwardHeaders = { ...headers }
  if (formData) {
    // Reconstruct FormData for forwarding
    forwardBody = new FormData()
    for (const [key, value] of formData.entries()) {
      forwardBody.append(key, value)
    }
    // Remove Content-Type so fetch sets correct boundary
    delete forwardHeaders["Content-Type"]
  } else if (jsonData) {
    forwardBody = JSON.stringify(jsonData)
  }

  // Forward request to Laravel
  const res = await fetch("http://127.0.0.1:8000/api/onboarding", {
    method: "POST",
    headers: forwardHeaders,
    credentials: "include",
    body: forwardBody,
  })

  if (!res.ok) {
    return NextResponse.json({ status: false, error: await res.text() }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
