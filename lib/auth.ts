// auth.ts
// IMPORTANT: No backend URL here
const BASE_URL = "" // use Next.js API routes only

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  email_verified_at?: string
  created_at?: string
  updated_at?: string
}

export interface LoginResponse {
  status: boolean
  message: string
  data: {
    user: User
  }
}

export interface LogoutResponse {
  status: boolean
  message: string
  data: unknown[]
}

/**
 * LOGIN
 * Calls Next.js proxy → Laravel
 */
export async function login(email: string, password: string) {
  console.log("Attempting login with email:", email);
  // Call your Next.js proxy route
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // No 'credentials: include' needed here if calling same-origin /api/auth/login
    body: JSON.stringify({ email, password }),
  });
  console.log("Response status from /api/auth/login:", res);

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function verifyAuth() {
  const res = await fetch("/api/user", {
    credentials: "include",
  })

  if (!res.ok) return null
  return res.json()
}

// export async function login(email: string, password: string) {
//   await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
//     credentials: "include",
//   })

//   const res = await fetch("http://127.0.0.1:8000/api/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ email, password }),
//   })

//   if (!res.ok) throw new Error("Login failed")
// }


/**
 * LOGOUT
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  })

  const data: LogoutResponse = await response.json()

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Logout failed")
  }
}



