"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { verifyAuth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TopNavbar } from "@/components/top-navbar"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, setUser, setLoading, navPosition } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useIsMobile()
  const isSidebar = navPosition === "sidebar"

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

  // Collapse sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    }
  }, [isMobile])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {isSidebar && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}

      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        isSidebar ? (!isMobile ? (isCollapsed ? "ml-16" : "ml-72") : "ml-0") : "ml-0"
      )}>
        <Header setIsCollapsed={setIsCollapsed} />
        {!isSidebar && <TopNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
