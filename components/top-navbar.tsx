"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Building2,
  LayoutDashboard,
} from "lucide-react"
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
  { name: "Adverse Media Check", href: "/dashboard/adverse-search", icon: Newspaper },
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
      { name: "Automated Bot", disabled: true },
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
      { name: "Automated Bot", disabled: true },
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
  { name: "Adverse Media Check", icon: Newspaper, disabled: true },
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
      { name: "Automated Bot", disabled: true },
    ],
  },
]

const flaNavigation: NavItem[] = [
  {
    name: "Compliance Dashboard",
    icon: LayoutDashboard,
    children: [
      { name: "User Profile", href: "/dashboard/profile" },
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
      { name: "Automated Bot", disabled: true },
    ],
  },
]

function getNavigationByRole(user: any): NavItem[] {
  const normalizedRole = (user?.role || "").toLowerCase().trim()
  switch (normalizedRole) {
    case "admin":
      return adminNavigation
    case "company admin":
      return companyAdminNavigation
    case "author":
      return authorNavigation
    case "mlro":
      return mlroNavigation
    case "analyst":
      return flaNavigation
    default:
      return companyAdminNavigation
  }
}

export function TopNavbar() {
  const { user } = useAuthStore()
  const pathname = usePathname()
  const navigation = getNavigationByRole(user)

  return (
    <nav className="h-11 border-b border-border bg-background px-4 sm:px-6 flex items-center overflow-x-auto">
      <ul className="flex items-center gap-1">
        {navigation.map((item) => {
          if (item.children) {
            const isActive = item.children.some((child) => !!child.href && pathname === child.href)

            return (
              <li key={item.name}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap",
                        "hover:bg-primary/10 hover:text-primary",
                        isActive && "text-primary bg-primary/10 font-medium"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span>{item.name}</span>
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl p-2">
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
                            pathname === child.href && "bg-primary/10 text-primary"
                          )}
                        >
                          <Link href={child.href}>{child.name}</Link>
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            )
          }

          return (
            <li key={item.name}>
              {item.disabled || !item.href ? (
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg whitespace-nowrap",
                    "text-muted-foreground/80 cursor-not-allowed opacity-80"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground ml-1">
                    Soon
                  </span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap",
                    "hover:bg-primary/10 hover:text-primary",
                    pathname === item.href && "text-primary bg-primary/10 font-medium"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
