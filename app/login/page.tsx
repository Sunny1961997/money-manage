"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store"
import { login } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const PAGE_CLASS =
  "relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/10 px-4 py-6 sm:px-6 lg:px-8"
const CARD_STYLE =
  "relative mx-auto w-full max-w-md rounded-3xl border border-border/60 bg-card/75 p-6 shadow-[0_22px_60px_-30px_oklch(0.28_0.06_260/0.45)] backdrop-blur-sm sm:p-7"
const FIELD_LABEL_CLASS = "text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-11 rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"

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
    <div className={PAGE_CLASS}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-4">
          <Button
            type="button"
            variant="ghost"
            className="h-9 gap-2 rounded-xl px-3 text-muted-foreground hover:bg-background/80 hover:text-foreground"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className={CARD_STYLE}>
          <CardContent className="space-y-5 p-0">
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center">
                <img src="/aml_meter_2.png" alt="AML Meter" className="h-16 w-auto object-contain" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign In</h1>
                <p className="text-sm text-muted-foreground">Access your compliance dashboard and screening workspace.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <RequiredLabel htmlFor="email" text="Email" className={FIELD_LABEL_CLASS} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor="password" text="Password" className={FIELD_LABEL_CLASS} />
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${FIELD_CLASS} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="h-11 w-full rounded-xl" disabled={isLoading}>
                {isLoading ? "Logging In..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              Protected access for authorized users only.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
