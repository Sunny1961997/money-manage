"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { verifyAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      try {
        const user = await verifyAuth()
        if (user) {
          setUser(user)
        } else {
          router.push("/login")
        }
      } catch {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    if (!isAuthenticated) {
      checkAuth()
    }
  }, [isAuthenticated, setUser, setLoading, router])

  if (!isAuthenticated) {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
