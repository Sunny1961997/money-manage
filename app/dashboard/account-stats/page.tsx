"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, AlertTriangle, Users, Building2, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface AccountStats {
  user_type_distribution: {
    individual: number
    corporate: number
  }
  risk_level_distribution: {
    low: number
    low_medium: number
    medium: number
    medium_high: number
    high: number
  }
  onboarding_status: {
    onboarded: number
    in_review: number
    false_match: number
    rejected: number
    alerted: number
  }
  risk_assessment: {
    high_risk_count: number
    total_count: number
  }
  ongoing_monitoring_count: number
  company_info: {
    id: number
    name: string
  }
}

export default function AccountStatsPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState<AccountStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/users/account-stats", {
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok && data.status) {
        setStats(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch account statistics",
          // variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        // variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const totalUsers = stats.user_type_distribution.individual + stats.user_type_distribution.corporate
  const totalOnboarded = stats.onboarding_status.onboarded
  const highRiskPercentage = stats.risk_assessment.total_count > 0
    ? ((stats.risk_assessment.high_risk_count / stats.risk_assessment.total_count) * 100).toFixed(0)
    : 0

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Account Statistics</h1>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total Onboarded Users</div>
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalOnboarded}</div>
            <div className="text-xs text-muted-foreground">
              {stats.user_type_distribution.individual} individual, {stats.user_type_distribution.corporate} corporate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Ongoing Monitoring</div>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.ongoing_monitoring_count}</div>
            <div className="text-xs text-muted-foreground">
              {totalUsers > 0 ? ((stats.ongoing_monitoring_count / totalUsers) * 100).toFixed(0) : 0}% of total users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Onboarded Status</div>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalOnboarded}</div>
            <div className="text-xs text-muted-foreground">
              {totalUsers > 0 ? ((totalOnboarded / totalUsers) * 100).toFixed(0) : 0}% successful onboardings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">High Risk Users</div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.risk_assessment.high_risk_count}</div>
            <div className="text-xs text-muted-foreground">{highRiskPercentage}% of total users</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Type Distribution</CardTitle>
            <CardDescription>Breakdown of individual vs corporate users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Level Distribution</CardTitle>
            <CardDescription>Breakdown of users by risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboarding Status</CardTitle>
            <CardDescription>Current status of all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-around gap-2 p-4">
              {[
                { label: "Onboarded", count: stats.onboarding_status.onboarded, color: "bg-teal-600" },
                { label: "In Review", count: stats.onboarding_status.in_review, color: "bg-blue-500" },
                { label: "False Match", count: stats.onboarding_status.false_match, color: "bg-yellow-500" },
                { label: "Rejected", count: stats.onboarding_status.rejected, color: "bg-red-500" },
                { label: "Alerted", count: stats.onboarding_status.alerted, color: "bg-orange-500" },
              ].map((item) => {
                const maxCount = Math.max(
                  stats.onboarding_status.onboarded,
                  stats.onboarding_status.in_review,
                  stats.onboarding_status.false_match,
                  stats.onboarding_status.rejected,
                  stats.onboarding_status.alerted
                )
                const heightPercentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0

                return (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full ${item.color} rounded-t`}
                      style={{ height: `${Math.max(heightPercentage, 10)}%` }}
                    ></div>
                    <div className="text-xs text-muted-foreground text-center">{item.label}</div>
                    <div className="text-xs font-semibold">{item.count}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Risk Assessment</CardTitle>
            <CardDescription>Summary of risk levels across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { level: "High Risk (≥ 4)", count: stats.risk_level_distribution.high, color: "bg-red-500" },
                { level: "Medium High (≥ 3)", count: stats.risk_level_distribution.medium_high, color: "bg-orange-500" },
                { level: "Medium Risk (≥ 2)", count: stats.risk_level_distribution.medium, color: "bg-yellow-500" },
                { level: "Low Medium (≥ 1.5)", count: stats.risk_level_distribution.low_medium, color: "bg-blue-500" },
                { level: "Low Risk (1 to < 1.5)", count: stats.risk_level_distribution.low, color: "bg-green-500" },
              ].map((item) => {
                const maxCount = Math.max(
                  stats.risk_level_distribution.high,
                  stats.risk_level_distribution.medium_high,
                  stats.risk_level_distribution.medium,
                  stats.risk_level_distribution.low_medium,
                  stats.risk_level_distribution.low
                )
                const widthPercentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0

                return (
                  <div key={item.level} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <div className="flex-1 text-sm">{item.level}</div>
                    <div className="w-1/2 bg-gray-100 rounded-full h-2 overflow-hidden">
                      {item.count > 0 && (
                        <div className={`h-full ${item.color}`} style={{ width: `${widthPercentage}%` }}></div>
                      )}
                    </div>
                    <div className="w-12 text-right text-sm font-medium">{item.count}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ongoing Monitoring Requirements</CardTitle>
            <CardDescription>Users requiring special ongoing monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <div className="text-sm font-medium mb-1">Ongoing Monitoring</div>
              <div className="text-3xl font-bold mb-2">{stats.ongoing_monitoring_count}</div>
              <div className="text-xs text-muted-foreground">
                {stats.user_type_distribution.individual} individual, {stats.user_type_distribution.corporate} corporate
              </div>
              <div className="mt-6 space-y-3 w-full">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Individual Users</span>
                  </div>
                  <span className="font-bold">{stats.user_type_distribution.individual}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Corporate Users</span>
                  </div>
                  <span className="font-bold">{stats.user_type_distribution.corporate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* License Warning */}
      {/* <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-orange-900 mb-1">ID/License Already Expired</div>
              <div className="text-sm text-orange-700 mb-3">
                Users with ID, trade license, partner ID, or tenancy contract already expired
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                <div className="flex items-center gap-2 text-orange-900">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">1 corporate license / tenancy contract</span>
                </div>
                <Button variant="link" className="text-orange-700 text-sm">
                  View details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
