"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useState } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Track sidebar collapsed state in parent to adjust margin
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={
          // Adjust margin-left based on sidebar width
          isCollapsed
            ? "ml-16 flex flex-col min-h-screen transition-all duration-300"
            : "ml-72 flex flex-col min-h-screen transition-all duration-300"
        }
      >
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">{children}</main>
      </div>
    </div>
  )
}
