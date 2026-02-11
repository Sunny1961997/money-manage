"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store"
import { login } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleBack = () => {
    const referrer = document.referrer
    const sameOrigin = referrer.startsWith(window.location.origin)
    if (sameOrigin && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await login(email, password)
      
      if (data && data.user) {
        setUser(data.user)
        toast({
          title: "Success",
          description: "Login successful!",
        })
        
        // Redirect based on user role
        const userRole = data.user.role?.toLowerCase().trim()
        if (userRole === "admin") {
          router.push("/dashboard/admin")
        } else if (userRole === "company admin") {
          router.push("/dashboard/profile")
        } else {
          // Default redirect for other roles
          router.push("/dashboard/profile")
        }
        router.refresh()
      } else {
        const errorMsg = data?.message || "Login failed: No user data returned"
        setError(errorMsg)
        toast({
          title: "Login Failed",
          description: errorMsg,
          // variant: "destructive",
        })
      }
    } catch (error: any) {
      const errorMsg = error?.message || "An error occurred during login"
      setError(errorMsg)
      toast({
        title: "Login Failed",
        description: errorMsg,
        // variant: "destructive",
      })
      console.error("An error occurred during login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-3">
          <Button
            type="button"
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="/aml_meter_2.png" 
              alt="AML Meter" 
              className="h-20 w-auto object-contain rounded" 
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
