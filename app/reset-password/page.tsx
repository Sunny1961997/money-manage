"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function ResetPasswordPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get("token") || ""
  const email = searchParams?.get("email") || ""

  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const hasResetContext = Boolean(token && email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!hasResetContext) {
      const message = "This reset link is incomplete or expired. Please request a new password reset email."
      setError(message)
      toast({
        title: "Invalid Reset Link",
        description: message,
      })
      return
    }
    if (!password || password.length < 8) {
      const message = "Password must be at least 8 characters."
      setError(message)
      toast({
        title: "Error",
        description: message,
      })
      return
    }
    if (password !== passwordConfirmation) {
      const message = "Passwords do not match."
      setError(message)
      toast({
        title: "Error",
        description: message,
      })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password, password_confirmation: passwordConfirmation }),
      })
      const data = await res.json()
      if (res.ok && data.status) {
        const message = "Password reset successful. Redirecting to login..."
        setSuccess(message)
        toast({
          title: "Success",
          description: message,
        })
        setTimeout(() => router.push("/login"), 2000)
      } else {
        const message = data.message || data.error || "Failed to reset password."
        setError(message)
        toast({
          title: "Error",
          description: message,
        })
      }
    } catch (err: any) {
      const message = err.message || "Failed to reset password."
      setError(message)
      toast({
        title: "Error",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="hidden" value={token} readOnly />
          <Input type="hidden" value={email} readOnly />
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <Input
              type="password"
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          {!hasResetContext && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              This reset link is incomplete or expired. Request a new reset email from the login page.
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="w-full" disabled={loading || !hasResetContext}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
