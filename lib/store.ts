import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  email_verified_at?: string
  created_at?: string
  updated_at?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  navPosition: "sidebar" | "topbar"
  setUser: (user: User) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setNavPosition: (pos: "sidebar" | "topbar") => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      navPosition: "sidebar",
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setNavPosition: (pos) => set({ navPosition: pos }),
    }),
    {
      name: "auth-storage",
    }
  )
)
