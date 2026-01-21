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
  let res: Response
  try {
    console.log("[API] Forwarding to Laravel...")
    console.log(`[API] Target URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/onboarding`)
    console.log("[API] Headers being sent:", forwardHeaders)
    console.log("[API] Body type:", forwardBody instanceof FormData ? "FormData" : typeof forwardBody)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log("[API] Request timeout after 30 seconds")
      controller.abort()
    }, 30000) // 30 second timeout

    const startTime = Date.now()
    res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/onboarding`, {
      method: "POST",
      headers: forwardHeaders,
      credentials: "include",
      body: forwardBody,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const elapsed = Date.now() - startTime
    console.log(`[API] Laravel responded with status ${res.status} in ${elapsed}ms`)
  } catch (fetchErr: any) {
    console.error("[API] Failed to reach Laravel backend:", fetchErr)
    console.error("[API] Error name:", fetchErr.name)
    console.error("[API] Error message:", fetchErr.message)
    return NextResponse.json(
      {
        status: false,
        message: fetchErr.name === "AbortError" 
          ? "Request timeout - Laravel server not responding" 
          : `Cannot connect to Laravel backend: ${fetchErr.message}`,
        error: "Backend connection failed",
      },
      { status: 503 }
    )
  }

  const contentType = res.headers.get("content-type") || ""
  const responseText = await res.text()
  console.log("[API] Laravel onboarding response status:", res.status)
  console.log("[API] Laravel onboarding response body:", responseText)

  if (!res.ok) {
    // Try to return JSON error if possible, otherwise include raw text
    if (contentType.includes("application/json")) {
      try {
        const jsonErr = JSON.parse(responseText)
        console.log("[API] Returning parsed error JSON:", jsonErr)
        return NextResponse.json(jsonErr, { status: res.status })
      } catch (parseErr) {
        console.error("[API] Failed to parse error JSON:", parseErr)
        // fallthrough to text
      }
    }
    console.log("[API] Returning error as plain text")
    return NextResponse.json(
      {
        status: false,
        message: responseText || "Unknown error",
        error: responseText || "Unknown error",
      },
      { status: res.status }
    )
  }

  // Success: parse JSON if possible, otherwise return text as a JSON message
  if (contentType.includes("application/json")) {
    try {
      const data = JSON.parse(responseText)
      console.log("[API] Returning success JSON:", data)
      return NextResponse.json(data)
    } catch {
      // fall through to send as message
    }
  }
  return NextResponse.json({ status: true, message: responseText }, { status: res.status })
}
