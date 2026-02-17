"use client"

import { Bell, KeyRound, LayoutDashboard, LogOut, PanelLeft, Settings, PanelTop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { logout } from "@/lib/auth"

// function toTitleCase(value: string) {
//   return value
//     .split("-")
//     .filter(Boolean)
//     .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
//     .join(" ")
// }

function getHeaderMeta(pathname: string) {
  // 1. Clean segments and find the dashboard entry point
  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.indexOf("dashboard");
  
  // Extract segments after "/dashboard"
  let pathSegments = segments.slice(dashboardIndex + 1);
  
  // 2. Handle Dynamic IDs (e.g., /profile/1 or /customers/123)
  // We check if the last segment is a number or a UUID-like string
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isId = lastSegment && (!isNaN(Number(lastSegment)) || lastSegment.length > 20);
  
  if (isId && pathSegments.length > 1) {
    pathSegments = pathSegments.slice(0, -1); // Remove the ID from the title logic
  }

  const pageSegment = pathSegments.join("/") || "overview";

  // 3. Map paths to their Display Titles
  const routeTitleMap: Record<string, string> = {
    // Basic Routes
    "profile": "User Profile",
    "account-stats": "Account Insights",
    "customers": "Client Records Management",
    "adverse-search": "Adverse Media Check",
    "screening-logs": "Audit Trail",
    "tickets": "Ticket",
    "change-password": "Change Password",
    
    // Onboarding Sub-routes
    "onboarding/customer": "Digital Onboarding",
    "onboarding/quick": "Quick Onboarding",
    
    // Screening Sub-routes
    "screening/quick": "Name and PEP Screening",
    
    // Support Sub-routes
    "support/bot": "Automated Bot",
    
    // Admin Routes
    "admin": "Compliance Dashboard",
    "admin/companies": "Companies",
    "admin/company-users": "Company Users",
    "admin/users": "System Users",
    "admin/product": "Products",
    
    // Regulatory
    "goaml-reporting": "GoAML Reporting",
  };

  // 4. Map the first segment to a Section Category
  const firstSegment = pathSegments[0];
  const sectionMap: Record<string, string> = {
    "onboarding": "Customer Due Diligence",
    "screening": "Watchlist Screening",
    "support": "Support Center",
    "admin": "Administration",
    "goaml-reporting": "Regulatory Reporting"
  };

  // 5. Generate Final Title
  // If it's an ID route (like /profile/1), we can prefix it with "Details" or "Edit"
  const rawTitle = routeTitleMap[pageSegment] ?? toTitleCase(pageSegment.split('/').pop() || "Overview");
  const finalTitle = isId ? `${rawTitle} Details` : rawTitle;

  return {
    section: sectionMap[firstSegment] ?? "Dashboard",
    title: finalTitle,
  };
}

/** * Helper to capitalize fallback titles 
 * (e.g., "my-page" -> "My Page")
 */
function toTitleCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth, isLoading, setLoading, setError, navPosition, setNavPosition } = useAuthStore()
  const { section, title } = getHeaderMeta(pathname ?? "/dashboard")

  const currentDate = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date())

  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")

  const handleLogout = async () => {
    setLoading(true)
    setError(null)
    try {
      await logout()
      clearAuth()
      // Force a hard redirect to clear all client state
      window.location.href = "/"
    } catch (error: any) {
      setError(error?.message || "Logout failed")
      // Even if logout API fails, clear local state and redirect
      clearAuth()
      window.location.href = "/"
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="h-[88px] border-b border-border bg-background px-4 sm:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          {/* <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-200">
            📊 NEWS ROOM •
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-border rounded flex items-center justify-center">
              <span className="text-xs">🏢</span>
            </div>
            <span className="font-semibold text-sm">ALHAZ ALSAATIE GOLD AND JEWELRY TRADING LLC</span>
          </div> */}
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{section}</p>
            <h1 className="truncate text-lg font-semibold leading-tight text-foreground">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <LinkIcon className="w-5 h-5" />
          </Button> */}
          <div className="hidden md:inline-flex px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {currentDate}
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="group h-10 w-10 rounded-xl border border-border bg-background hover:bg-primary/5"
                aria-label="Open profile menu"
              >
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5">
                  {initials}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-xl p-2.5">
              <div className="flex items-center gap-3 rounded-lg px-2.5 py-2.5">
                <div className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{user?.name || "User"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email || "No email available"}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="group rounded-lg px-3 py-2 data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                onClick={() => router.push('/dashboard/settings')}
              >
                <Settings className="w-4 h-4 mr-2 text-inherit transition-transform duration-200 group-data-[highlighted]:translate-x-0.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="group rounded-lg px-3 py-2 data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                onClick={() => router.push('/dashboard/change-password')}
              >
                <KeyRound className="w-4 h-4 mr-2 text-inherit transition-transform duration-200 group-data-[highlighted]:translate-x-0.5" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem
                className="group rounded-lg px-3 py-2 data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                onClick={() => setNavPosition(navPosition === "sidebar" ? "topbar" : "sidebar")}
              >
                {navPosition === "sidebar" ? (
                  <PanelTop className="w-4 h-4 mr-2 text-inherit transition-transform duration-200 group-data-[highlighted]:translate-x-0.5" />
                ) : (
                  <PanelLeft className="w-4 h-4 mr-2 text-inherit transition-transform duration-200 group-data-[highlighted]:translate-x-0.5" />
                )}
                {navPosition === "sidebar" ? "Switch to Top Navbar" : "Switch to Sidebar"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="group rounded-lg px-3 py-2 data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="w-4 h-4 mr-2 text-inherit transition-transform duration-200 group-data-[highlighted]:translate-x-0.5" />
                {isLoading ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
