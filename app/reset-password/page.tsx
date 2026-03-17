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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!password || password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters.",
        
      })
      return
    }
    if (password !== passwordConfirmation) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
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
        // setSuccess("Password reset successful. You can now log in.")
        toast({
          title: "Success",
          description: "Password reset successful. Redirecting to login...",
        })
        setTimeout(() => router.push("/login"), 2000)
      } else {
        // setError(data.message || "Failed to reset password.")
        toast({
          title: "Error",
          description: data.message || "Failed to reset password.",
          
        })
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reset password.",
        
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
