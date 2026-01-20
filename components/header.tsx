"use client"

import { Bell, MessageSquare, Settings, LogOut, LinkIcon, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { logout } from "@/lib/auth"

export function Header() {
  const router = useRouter()
  const { user, clearAuth, isLoading, setLoading, setError } = useAuthStore()

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    
    if (res.ok) {
      // Redirect to login page after cookie is cleared
      window.location.href = '/login';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-200">
          📊 NEWS ROOM •
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-border rounded flex items-center justify-center">
            <span className="text-xs">🏢</span>
          </div>
          <span className="font-semibold text-sm">ALHAZ ALSAATIE GOLD AND JEWELRY TRADING LLC</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <LinkIcon className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">{user?.name || "User"}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/change-password')}>
              <KeyRound className="w-4 h-4 mr-2" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
              <LogOut className="w-4 h-4 mr-2" />
              {isLoading ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
