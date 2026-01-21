import { NextResponse } from "next/server";

function getTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/session_token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = getTokenFromCookie(cookie);
  const decodedToken = token ? decodeURIComponent(token) : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (decodedToken) {
    headers["Authorization"] = `Bearer ${decodedToken}`;
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/goaml-reports/meta`;
  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const text = await res.text();
  console.log("API Response Status:", res.status);
  console.log("API Response Body:", text);

  if (!res.ok) {
    return NextResponse.json({ status: false, error: text }, { status: res.status });
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  return NextResponse.json(data);
}
