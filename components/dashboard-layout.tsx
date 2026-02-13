"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TopNavbar } from "@/components/top-navbar"
import { useAuthStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { navPosition } = useAuthStore()

  const isSidebar = navPosition === "sidebar"

  return (
    <div className="min-h-screen bg-background">
      {isSidebar && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          isSidebar ? (isCollapsed ? "ml-16" : "ml-72") : "ml-0"
        )}
      >
        <Header />
        {!isSidebar && <TopNavbar />}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">{children}</main>
      </div>
    </div>
  )
}
