// Authentication utility with hardcoded login
export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Hardcoded credentials for demo
const DEMO_USER: User = {
  id: "1",
  name: "ALHAZFLA",
  email: "alhazfla@moneyms.com",
  role: "Admin",
}

export async function login(email: string, password: string): Promise<User> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Hardcoded validation
  if (email === "alhazfla@moneyms.com" && password === "password") {
    return DEMO_USER
  }

  throw new Error("Invalid credentials")
}

export async function logout(): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
}
