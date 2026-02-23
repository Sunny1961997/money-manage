"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Building2, Users, FileCheck, ArrowRight, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type AccountStats = {
  company_count: number
  system_users: number
  screening_logs: number
  active_users: number
}

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const LABEL_CLASS = "text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AccountStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", { credentials: "include" })
        const data = await res.json()

        if (res.ok && data.status) {
          setStats(data.data)
          return
        }

        toast({
          title: "Error",
          description: data.message || "Failed to fetch account statistics",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "An error occurred",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  const adminCards = useMemo(
    () => [
      {
        title: "Companies",
        description: "Manage company accounts and subscriptions.",
        icon: Building2,
        href: "/dashboard/admin/companies",
        count: stats?.company_count ?? 0,
      },
      {
        title: "Users",
        description: "Manage system users and access levels.",
        icon: Users,
        href: "/dashboard/admin/company-users",
        count: stats?.system_users ?? 0,
      },
      {
        title: "Products",
        description: "Configure products and risk levels.",
        icon: Shield,
        href: "/dashboard/admin/product",
        count: "-",
      },
      {
        title: "Audit Logs",
        description: "Review activity and compliance trails.",
        icon: FileCheck,
        href: "/dashboard/admin/audit-logs",
        count: stats?.screening_logs ?? 0,
      },
    ],
    [stats]
  )

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitor account health and navigate core administration modules.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href}>
              <Card className={`${CARD_STYLE} h-full hover:border-primary/40`}>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div className="space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold tracking-tight text-foreground">{card.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={LABEL_CLASS}>Count</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{card.count}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className={CARD_STYLE}>
        <CardContent className="p-5 sm:p-6">
          <div className="mb-4 border-b border-border/50 pb-3">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">System Overview</h3>
            <p className="text-sm text-muted-foreground">Current platform-level indicators.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
              <p className={LABEL_CLASS}>Total Companies</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{stats?.company_count ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
              <p className={LABEL_CLASS}>Active Users</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{stats?.active_users ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
              <p className={LABEL_CLASS}>Total Screenings</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{stats?.screening_logs ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
