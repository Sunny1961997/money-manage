"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react"

const PAGE_CLASS =
  "mx-auto w-full max-w-[1100px] space-y-6 px-4 pb-10 pt-8 sm:px-6 lg:px-8"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/65 shadow-[0_14px_40px_-30px_oklch(0.28_0.06_260/0.35)] backdrop-blur-sm"
const FIELD_LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-11 rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleBack = () => {
    const referrer = document.referrer
    const sameOrigin = referrer.startsWith(window.location.origin)
    if (sameOrigin && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/dashboard/profile")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 8 characters",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Password changed successfully",
        })

        // Reset form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")

        // Optionally redirect after a delay
        setTimeout(() => {
          router.push("/dashboard/profile")
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to change password",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={PAGE_CLASS}>
      <Card className="rounded-3xl border border-border/50 bg-gradient-to-r from-card via-card to-primary/10 shadow-[0_20px_60px_-38px_oklch(0.28_0.06_260/0.38)]">
        <CardContent className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">Account Security</p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Change Password</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Update your account password and keep your access secure.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 self-start rounded-xl px-4 lg:self-auto"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <RequiredLabel htmlFor="currentPassword" text="Current Password" className={FIELD_LABEL_CLASS} />
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className={`${FIELD_CLASS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showCurrent ? "Hide current password" : "Show current password"}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <RequiredLabel htmlFor="newPassword" text="New Password" className={FIELD_LABEL_CLASS} />
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className={`${FIELD_CLASS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <RequiredLabel htmlFor="confirmPassword" text="Confirm New Password" className={FIELD_LABEL_CLASS} />
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className={`${FIELD_CLASS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="h-11 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="h-11 rounded-xl px-6">
                {loading ? "Changing Password..." : "Update Password"}
              </Button>
            </div>
          </form>

          <aside className="rounded-2xl border border-border/60 bg-muted/25 p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Password Requirements
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Minimum 8 characters long</li>
              <li>Must match confirmation password</li>
              <li>Should differ from current password</li>
              <li>Include upper and lower case letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </aside>
        </CardContent>
      </Card>
    </div>
  )
}
