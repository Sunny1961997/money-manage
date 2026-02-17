"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import {
  User,
  Users,
  ScanSearch,
  UserCheck,
  Newspaper,
  FileSpreadsheet,
  History,
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Building2,
  LayoutDashboard,
} from "lucide-react"
import { useState, Dispatch, SetStateAction, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavItem = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  disabled?: boolean
  children?: Array<{ name: string; href?: string; disabled?: boolean }>
}

const companyAdminNavigation: NavItem[] = [
  {
    name: "Compliance Dashboard",
    icon: LayoutDashboard,
    children: [
      { name: "User Profile", href: "/dashboard/profile" },
      { name: "Account Insights", href: "/dashboard/account-stats" },
      { name: "Client Records Management", href: "/dashboard/customers" },
    ],
  },
  {
    name: "Customer Due Diligence",
    icon: UserCheck,
    children: [
      { name: "Digital Onboarding", href: "/dashboard/onboarding/customer" },
      { name: "Quick Onboarding", href: "/dashboard/onboarding/quick" },
    ],
  },
  {
    name: "Watchlist Screening",
    icon: ScanSearch,
    children: [
      { name: "Name and PEP Screening", href: "/dashboard/screening/quick" },
      { name: "Batch Screening", href: "/dashboard/screening/batch" },
    ],
  },
  { name: "Adverse Media Check", icon: Newspaper, href: "/dashboard/adverse-search" },
  {
    name: "Regulatory Reporting",
    icon: FileSpreadsheet,
    children: [{ name: "GoAML Reporting", href: "/dashboard/goaml-reporting" }],
  },
  { name: "Audit Trail", href: "/dashboard/screening-logs", icon: History },
  {
    name: "Support Center",
    icon: LifeBuoy,
    children: [
      { name: "Raise a Ticket", href: "/dashboard/tickets" },
      { name: "Automated Bot", href: "/dashboard/support/bot" },
    ],
  },
]

const adminNavigation: NavItem[] = [
  { name: "Compliance Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Companies", href: "/dashboard/admin/companies", icon: Building2 },
  { name: "Company Users", href: "/dashboard/admin/company-users", icon: Building2 },
  { name: "System Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Products", href: "/dashboard/admin/product", icon: FileSpreadsheet },
  { name: "Support Center", href: "/dashboard/tickets", icon: LifeBuoy },
]

const authorNavigation: NavItem[] = [
  { name: "User Profile", href: "/dashboard/profile", icon: User },
  { name: "Client Records Management", href: "/dashboard/customers", icon: Users },
  {
    name: "Watchlist Screening",
    icon: ScanSearch,
    children: [
      { name: "Name and PEP Screening", href: "/dashboard/screening/quick" },
      { name: "Batch Screening", href: "/dashboard/screening/batch" },
    ],
  },
  { name: "Audit Trail", href: "/dashboard/screening-logs", icon: History },
  {
    name: "Support Center",
    icon: LifeBuoy,
    children: [
      { name: "Raise a Ticket", href: "/dashboard/tickets" },
      { name: "Automated Bot", href: "/dashboard/support/bot" },
    ],
  },
]

const mlroNavigation: NavItem[] = [
  {
    name: "Compliance Dashboard",
    icon: LayoutDashboard,
    children: [
      { name: "User Profile", href: "/dashboard/profile" },
      { name: "Account Insights", href: "/dashboard/account-stats" },
      { name: "Client Records Management", href: "/dashboard/customers" },
    ],
  },
  // { name: "Profile", href: "/dashboard/profile", icon: User },
  // { name: "Account Info", href: "/dashboard/account-stats", icon: FileText },
  // { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Customer Due Diligence",
    icon: UserCheck,
    children: [
      { name: "Digital Onboarding", href: "/dashboard/onboarding/customer" },
      { name: "Quick Onboarding", href: "/dashboard/onboarding/quick" },
    ],
  },
  {
    name: "Watchlist Screening",
    icon: ScanSearch,
    children: [
      { name: "Name and PEP Screening", href: "/dashboard/screening/quick" },
      { name: "Batch Screening", href: "/dashboard/screening/batch" },
    ],
  },
  { name: "Adverse Media Check", icon: Newspaper, href: "/dashboard/adverse-search" },
  {
    name: "Regulatory Reporting",
    icon: FileSpreadsheet,
    children: [{ name: "GoAML Reporting", href: "/dashboard/goaml-reporting" }],
  },
  { name: "Audit Trail", href: "/dashboard/screening-logs", icon: History },
  {
    name: "Support Center",
    icon: LifeBuoy,
    children: [
      { name: "Raise a Ticket", href: "/dashboard/tickets" },
      { name: "Automated Bot", href: "/dashboard/support/bot" },
    ],
  },
]

const flaNavigation: NavItem[] = [
  {
    name: "Compliance Dashboard",
    icon: LayoutDashboard,
    children: [
      { name: "User Profile", href: "/dashboard/profile" },
      // { name: "Account Info", href: "/dashboard/account-stats" },
      { name: "Client Records Management", href: "/dashboard/customers" },
    ],
  },
  // { name: "Profile", href: "/dashboard/profile", icon: User },
  // { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Customer Due Diligence",
    icon: UserCheck,
    children: [
      { name: "Digital Onboarding", href: "/dashboard/onboarding/customer" },
      { name: "Quick Onboarding", href: "/dashboard/onboarding/quick" },
    ],
  },
  {
    name: "Watchlist Screening",
    icon: ScanSearch,
    children: [
      { name: "Name and PEP Screening", href: "/dashboard/screening/quick" },
      { name: "Batch Screening", href: "/dashboard/screening/batch" },
    ],
  },
  {
    name: "Regulatory Reporting",
    icon: FileSpreadsheet,
    children: [{ name: "GoAML Reporting", href: "/dashboard/goaml-reporting" }],
  },
  { name: "Audit Trail", href: "/dashboard/screening-logs", icon: History },
  {
    name: "Support Center",
    icon: LifeBuoy,
    children: [
      { name: "Raise a Ticket", href: "/dashboard/tickets" },
      { name: "Automated Bot", href: "/dashboard/support/bot" },
    ],
  },
]

// Helper function to get navigation based on role
function getNavigationByRole(user: any): NavItem[] {
  // Normalize role to lowercase for comparison
  console.log("[Sidebar] Current user role:", user)
  const normalizedRole = (user?.role || "").toLowerCase().trim()
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
  const router = useRouter()
  const { user } = useAuthStore()
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(["Watchlist Screening", "Customer Due Diligence"])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (loading) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-52 border-r border-border bg-sidebar flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="/aml_meter.png"
              alt="AML Meter"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen z-40 border-r border-border bg-sidebar flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
      style={{ minHeight: '100vh' }}
    >
      {/* Top section with logo and collapse button */}
      <div
        className={cn(
          "border-b border-border h-[88px] shrink-0",
          isCollapsed ? "flex flex-col items-center gap-2 px-2 py-3" : "flex items-center justify-between p-4"
        )}
      >
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard/profile">
              <img
                src="/aml_meter_2.png"
                alt="AML Meter"
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center">
              <img
                src="/aml_meter_2.png"
                alt="AM"
                className="w-full h-full object-contain"
              />
            </Link>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("shrink-0 rounded-lg", isCollapsed ? "h-8 w-8" : "ml-2")}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation - scrollable */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {!isCollapsed && (
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80 mb-3 px-3">
            Navigation
          </div>
        )}
        <ul className="space-y-1.5">
          {getNavigationByRole(user).map((item) => {
            if (item.children) {
              const isOpen = openMenus.includes(item.name)
              const isActive = item.children.some((child) => !!child.href && pathname === child.href)

              if (isCollapsed) {
                return (
                  <li key={item.name}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          aria-label={item.name}
                          title={item.name}
                          className={cn(
                            "group w-full min-h-10 flex items-center justify-center px-2.5 py-2 text-sm rounded-xl transition-colors",
                            "hover:bg-primary/10 hover:text-primary",
                            isActive && "text-primary bg-primary/10 ring-1 ring-primary/20",
                          )}
                        >
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                            <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" />
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" sideOffset={10} className="w-64 rounded-xl p-2">
                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                          {item.name}
                        </div>
                        <DropdownMenuSeparator />
                        {item.children.map((child) =>
                          child.disabled || !child.href ? (
                            <DropdownMenuItem
                              key={child.name}
                              disabled
                              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-muted-foreground"
                            >
                              <span className="truncate">{child.name}</span>
                              <span className="text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Soon
                              </span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              key={child.name}
                              asChild
                              className={cn(
                                "rounded-lg px-2.5 py-2 text-sm data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground",
                                pathname === child.href && "bg-primary/10 text-primary",
                              )}
                            >
                              <Link href={child.href}>{child.name}</Link>
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                )
              }

              return (
                <li key={item.name}>
                  <button
                    title={item.name}
                    onClick={() => setOpenMenus((prev) => (prev.includes(item.name) ? prev.filter((i) => i !== item.name) : [...prev, item.name]))}
                    className={cn(
                      "group w-full min-h-10 flex items-center justify-between px-2.5 py-2 text-sm rounded-xl transition-colors",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive && "text-primary bg-primary/10 ring-1 ring-primary/20",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <div className={cn("flex min-w-0 items-center gap-2.5", isCollapsed && "gap-0")}>
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" />
                      </span>
                      {!isCollapsed && (
                        <span title={item.name} className="text-left leading-5">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {!isCollapsed &&
                      (isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                  </button>
                  {isOpen && !isCollapsed && (
                    <ul className="ml-2 mt-1 space-y-1 border-l border-border/60 pl-3">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          {child.disabled || !child.href ? (
                            <span
                              title={child.name}
                              className={cn(
                                "flex min-h-9 items-center justify-between gap-2 px-2.5 py-1.5 text-sm rounded-lg",
                                "text-muted-foreground/80 cursor-not-allowed opacity-80",
                              )}
                            >
                              <span title={child.name} className="leading-5">
                                {child.name}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Soon
                              </span>
                            </span>
                          ) : (
                            <Link
                              href={child.href}
                              title={child.name}
                              className={cn(
                                "group flex min-h-9 items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg transition-all",
                                "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                                pathname === child.href &&
                                "text-primary bg-primary/20 font-medium shadow-[inset_2px_0_0_hsl(var(--primary))]",
                              )}
                            >
                              <span title={child.name} className="leading-5">
                                {child.name}
                              </span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            }

            return (
              <li key={item.name}>
                {item.disabled || !item.href ? (
                  <span
                    title={item.name}
                    className={cn(
                      "flex min-h-10 items-center justify-between gap-2 px-2.5 py-2 text-sm rounded-xl",
                      "text-muted-foreground/80 cursor-not-allowed opacity-80",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <span className={cn("flex min-w-0 items-center gap-2.5", isCollapsed && "gap-0")}>
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                        <item.icon className="h-4 w-4 transition-transform duration-200" />
                      </span>
                      {!isCollapsed && (
                        <span title={item.name} className="text-left leading-5">
                          {item.name}
                        </span>
                      )}
                    </span>
                    {!isCollapsed && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    title={item.name}
                    className={cn(
                      "group flex min-h-10 items-center gap-2.5 px-2.5 py-2 text-sm rounded-xl transition-colors",
                      "hover:bg-primary/10 hover:text-primary",
                      pathname === item.href && "text-primary bg-primary/10 ring-1 ring-primary/20",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                      <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" />
                    </span>
                    {!isCollapsed && (
                      <span title={item.name} className="text-left leading-5">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}
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
