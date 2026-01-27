"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
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
  Settings,
  Building2,
  Shield,
} from "lucide-react"
import { useState, Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"

type NavItem = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  children?: Array<{ name: string; href: string }>
}

const companyAdminNavigation: NavItem[] = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Account Info", href: "/dashboard/account-stats", icon: FileText },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Screening",
    icon: Search,
    children: [
      { name: "Quick Screening", href: "/dashboard/screening/quick" },
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

const adminNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard/admin", icon: Settings },
  { name: "Companies", href: "/dashboard/admin/companies", icon: Building2 },
  { name: "Company Users", href: "/dashboard/admin/company-users", icon: Building2 },
  { name: "System Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Products", href: "/dashboard/admin/product", icon: FileCheck },
]

const authorNavigation: NavItem[] = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Screening",
    icon: Search,
    children: [
      { name: "Quick Screening", href: "/dashboard/screening/quick" },
    ],
  },
  { name: "Screening Logs", href: "/dashboard/screening-logs", icon: FileCheck },
]

const mlroNavigation: NavItem[] = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Account Info", href: "/dashboard/account-stats", icon: FileText },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Screening",
    icon: Search,
    children: [
      { name: "Quick Screening", href: "/dashboard/screening/quick" },
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

const flaNavigation: NavItem[] = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Screening",
    icon: Search,
    children: [
      { name: "Quick Screening", href: "/dashboard/screening/quick" },
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
  { name: "Screening Logs", href: "/dashboard/screening-logs", icon: FileCheck },
  { name: "GOAML Reporting", href: "/dashboard/goaml-reporting", icon: FileCheck },
]

// Helper function to get navigation based on role
function getNavigationByRole(): NavItem[] {
  const { user } = useAuthStore()

  // Normalize role to lowercase for comparison
  const normalizedRole = user?.role.toLowerCase().trim()
  console.log("[Sidebar] Determining navigation for role:", normalizedRole)

  switch (normalizedRole) {
    case "admin":
      return adminNavigation
    case "company admin":
      return companyAdminNavigation
    case "author":
      return authorNavigation
    case "mlro":
      console.log("[Sidebar] MLRO role detected")
      return mlroNavigation
    case "analyst":
      return flaNavigation
    default:
      return companyAdminNavigation
  }
}

type SidebarProps = {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(["Screening", "Onboarding"])
  const [loading, setLoading] = useState(false)

  if (loading) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-52 border-r border-border bg-sidebar flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center"></div>
            <div>
              <div className="font-semibold text-sm">AML Meter</div>
              <div className="text-xs text-muted-foreground">Loading...</div>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-40 border-r border-border bg-sidebar flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-52"
      )}
      style={{ minHeight: '100vh' }}
    >
      {/* Top section with logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="w-10 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">AML</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Meter</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-2"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation - scrollable */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-muted-foreground mb-3 px-3 flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center"></div>
          </div>
        )}
        <ul className="space-y-1">
          {getNavigationByRole().map((item) => {
            if (item.children) {
              const isOpen = openMenus.includes(item.name)
              const isActive = item.children.some((child) => pathname === child.href)

              return (
                <li key={item.name}>
                  <button
                    onClick={() => setOpenMenus((prev) => (prev.includes(item.name) ? prev.filter((i) => i !== item.name) : [...prev, item.name]))}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-white",
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
                              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                              "hover:bg-accent hover:text-white",
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
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    "hover:bg-accent hover:text-white",
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
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>AML Meter</span>
              <span>© 2026</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
