"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  User,
  FileText,
  Users,
  Search,
  UserPlus,
  AlertCircle,
  FileCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Account Stats", href: "/dashboard/account-stats", icon: FileText },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Screening",
    icon: Search,
    children: [
      { name: "Quick Screening", href: "/dashboard/screening/quick" },
      { name: "Batch Screening", href: "/dashboard/screening/batch" },
    ],
  },
  {
    name: "Onboarding",
    icon: UserPlus,
    children: [
      { name: "Customer Onboarding", href: "/dashboard/onboarding/customer" },
      { name: "Quick Onboarding", href: "/dashboard/onboarding/quick" },
    ],
  },
  { name: "Adverse Search", href: "/dashboard/adverse-search", icon: AlertCircle },
  { name: "Screening Logs", href: "/dashboard/screening-logs", icon: FileCheck },
  { name: "GOAML Reporting", href: "/dashboard/goaml-reporting", icon: FileCheck },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(["Screening", "Onboarding"])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <aside
      className={cn(
        "border-r border-border bg-sidebar min-h-screen flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-52",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Winnow Management Solutions</div>
              <div className="text-xs text-muted-foreground">WMS Dashboard v2.0</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-muted-foreground mb-3 px-3 flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">≡</div>
            NAVIGATION
          </div>
        )}
        <ul className="space-y-1">
          {navigation.map((item) => {
            if (item.children) {
              const isOpen = openMenus.includes(item.name)
              const isActive = item.children.some((child) => pathname === child.href)

              return (
                <li key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                      isActive && "text-red-500 border-l-2 border-red-500 bg-red-50",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <div className={cn("flex items-center gap-2", isCollapsed && "gap-0")}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed &&
                      (isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                  </button>
                  {isOpen && !isCollapsed && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                              pathname === child.href && "text-red-500 border-l-2 border-red-500 bg-red-50",
                            )}
                          >
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                    pathname === item.href && "text-red-500 border-l-2 border-red-500 bg-red-50",
                    isCollapsed && "justify-center",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mb-2 justify-center"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Winnow MS v2.0</span>
              <span>© 2025</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
