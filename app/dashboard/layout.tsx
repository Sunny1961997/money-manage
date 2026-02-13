"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { verifyAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TopNavbar } from "@/components/top-navbar"
import { cn } from "@/lib/utils"

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, setUser, setLoading, navPosition } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

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

  const isSidebar = navPosition === "sidebar"

  return (
    <div className="min-h-screen bg-background">
      {isSidebar && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}

      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        isSidebar ? (isCollapsed ? "ml-16" : "ml-52") : "ml-0"
      )}>
        <Header />
        {!isSidebar && <TopNavbar />}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
