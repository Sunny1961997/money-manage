"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Building2, Loader2, Search, CheckCircle2, PieChart as LucidePieChart, BarChart3, ShieldAlert, Table as TableIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
  AreaChart,
  Area,
} from "recharts"

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

const COLORS = {
  primary: "var(--primary)",
  blue: "#4f7fe8",
  cyan: "#13b5cf",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f59e0b",
  slate: "var(--muted-foreground)",
}

const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all hover:shadow-[0_30px_70px_-32px_oklch(0.28_0.06_260/0.6)]"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border/50 px-3 py-2 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <p className="font-medium text-xs text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm font-bold text-foreground">
            {payload[0].value} <span className="text-muted-foreground font-normal">Clients</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function AccountStatsPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState<AccountStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchStats()
  }, [toast])
  const safeStats: AccountStats = stats ?? {
    user_type_distribution: { individual: 0, corporate: 0 },
    risk_level_distribution: { low: 0, low_medium: 0, medium: 0, medium_high: 0, high: 0 },
    onboarding_status: { onboarded: 0, in_review: 0, false_match: 0, rejected: 0, alerted: 0 },
    risk_assessment: { high_risk_count: 0, total_count: 0 },
    ongoing_monitoring_count: 0,
    company_info: { id: 0, name: "" },
  }

  const totalUsers = safeStats.user_type_distribution.individual + safeStats.user_type_distribution.corporate
  const totalOnboarded = safeStats.onboarding_status.onboarded
  const highRiskCount = safeStats.risk_assessment.high_risk_count ?? safeStats.risk_level_distribution.high ?? 0
  const monitoringCount = safeStats.ongoing_monitoring_count ?? 0
  const riskAssessmentPopulation = safeStats.risk_assessment.total_count || totalUsers

  const numberFormatter = new Intl.NumberFormat(undefined)
  const percentFormatter = new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 0,
  })

  const clientGrowthData = useMemo(() => {
    const months = 6
    const monthLabels: string[] = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthLabels.push(d.toLocaleString("default", { month: "short" }))
    }

    if (totalOnboarded <= 0) {
      return monthLabels.map((name) => ({ name, value: 0 }))
    }

    const base = Math.floor(totalOnboarded / months)
    const remainder = totalOnboarded % months

    return monthLabels.map((name, index) => {
      const addOne = index >= months - remainder ? 1 : 0
      return { name, value: base + addOne }
    })
  }, [totalOnboarded])

  const onboardingData = [
    { name: "Onboarded", value: safeStats.onboarding_status.onboarded, color: COLORS.green },
    { name: "In Review", value: safeStats.onboarding_status.in_review, color: COLORS.blue },
    { name: "False Match", value: safeStats.onboarding_status.false_match, color: COLORS.slate },
    { name: "Rejected", value: safeStats.onboarding_status.rejected, color: COLORS.primary },
    { name: "Alerted", value: safeStats.onboarding_status.alerted, color: COLORS.yellow },
  ]

  const clientMixData = [
    { name: "Individual", value: safeStats.user_type_distribution.individual, color: COLORS.primary },
    { name: "Corporate", value: safeStats.user_type_distribution.corporate, color: COLORS.slate },
  ]

  const riskData = [
    { name: "Low", value: safeStats.risk_level_distribution.low ?? 0, color: COLORS.green, range: "< 1.5" },
    { name: "Low-Med", value: safeStats.risk_level_distribution.low_medium ?? 0, color: COLORS.cyan, range: "≥ 1.5" },
    { name: "Medium", value: safeStats.risk_level_distribution.medium ?? 0, color: COLORS.yellow, range: "≥ 2" },
    { name: "Med-High", value: safeStats.risk_level_distribution.medium_high ?? 0, color: COLORS.orange, range: "≥ 3" },
    { name: "High", value: safeStats.risk_level_distribution.high ?? 0, color: COLORS.primary, range: "≥ 4" },
  ]

  const riskBadgeBackgroundByName: Record<string, string> = {
    Low: "#22c55e20",
    "Low-Med": "#13b5cf20",
    Medium: "#eab30820",
    "Med-High": "#f59e0b20",
    High: "color-mix(in oklab, var(--primary) 18%, transparent)",
  }

  const totalRiskUsers = riskData.reduce((sum, item) => sum + item.value, 0)
  const monitoringShare = totalUsers > 0 ? monitoringCount / totalUsers : 0
  const highRiskShare = riskAssessmentPopulation > 0 ? highRiskCount / riskAssessmentPopulation : 0
  const riskApiReturnedZero = totalRiskUsers === 0 && highRiskCount === 0 && monitoringCount === 0

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="bg-muted/50 p-6 rounded-full">
          <FileText className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold font-heading">No Data Available</h3>
          <p className="text-muted-foreground">Unable to load account statistics at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Top Stats Grid */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={`${CARD_STYLE} h-full`}>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-foreground font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-6">
              <div>
                <div className="text-4xl font-bold tracking-tight text-foreground">{numberFormatter.format(totalUsers)}</div>
                <p className={`${SECONDARY_LABEL_CLASS} mt-1`}>Total Clients</p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-primary">{numberFormatter.format(totalOnboarded)}</div>
                    <p className={SECONDARY_LABEL_CLASS}>Total Onboarded Users</p>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="h-[80px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={clientGrowthData}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" hide />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--muted)", strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="value" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorGrowth)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className={`${SECONDARY_LABEL_CLASS} mt-3 text-center`}>Monthly Client Acquisition</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`lg:col-span-2 ${CARD_STYLE} h-full`}>
            <CardHeader>
              <CardTitle className="font-heading text-base text-foreground font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Customer Mix
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-around h-[250px]">
                <div className="h-full w-1/2 min-w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={clientMixData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {clientMixData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-6 justify-center">
                  {clientMixData.map((item) => (
                    <div key={item.name} className="flex items-center gap-4">
                      <div className="w-3 h-12 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{item.name}</p>
                        <p className="text-2xl font-bold tracking-tight">{item.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {totalUsers > 0 ? percentFormatter.format(item.value / totalUsers) : "0%"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts Row */}
      <section className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={`lg:col-span-2 ${CARD_STYLE} h-full`}>
            <CardHeader>
              <CardTitle className="font-heading text-base text-foreground font-semibold">Onboarding Status</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={onboardingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                      dy={10}
                      interval={0}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {onboardingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" position="top" className="text-sm font-bold fill-foreground" />
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={`col-span-1 ${CARD_STYLE} h-full flex flex-col justify-center`}>
            <CardHeader>
              <CardTitle className="font-heading text-base flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Onboarding Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center flex-1 pb-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                <span className="text-6xl font-black tracking-tighter text-foreground relative z-10">
                  {totalUsers > 0 ? percentFormatter.format(totalOnboarded / totalUsers) : "0%"}
                </span>
              </div>
              <div className="mt-4 px-4 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm font-medium border border-green-500/20">
                {totalOnboarded} Completed Onboardings
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="mt-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="font-heading text-base text-foreground font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Risk Level Distribution by Risk Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={riskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" position="top" className="text-sm font-bold fill-foreground" />
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
              {riskApiReturnedZero && (
                <p className={`${SECONDARY_LABEL_CLASS} mt-3 text-center`}>
                  API currently returns 0 values for risk metrics.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="font-heading text-base text-foreground font-semibold flex items-center gap-2">
                <LucidePieChart className="w-4 h-4 text-primary" />
                Risk Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-around h-[250px]">
                <div className="h-full w-1/2 min-w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 justify-center pr-4">
                  {riskData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-8 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={CARD_STYLE}>
            <CardHeader>
              <CardTitle className="font-heading text-base text-foreground font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                High-Risk Customers
              </CardTitle>
              <CardDescription>Customers flagged as high risk.</CardDescription>
            </CardHeader>
            <CardContent className="pb-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                <div className="text-center relative z-10">
                  <div className="text-5xl font-black tracking-tighter text-primary mb-1">{highRiskCount}</div>
                  <div className={SECONDARY_LABEL_CLASS}>High Risk Users</div>
                </div>
              </div>
              <div className="w-full space-y-4">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-muted-foreground font-medium">Against Risk Population</span>
                  <span className="font-bold text-lg">{percentFormatter.format(highRiskShare)}</span>
                </div>
                <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${Math.max(0, Math.min(100, highRiskShare * 100))}%` }}
                  />
                </div>
                <p className={`${SECONDARY_LABEL_CLASS} text-center`}>
                  Risk Assessment Coverage: {numberFormatter.format(riskAssessmentPopulation)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={`lg:col-span-2 ${CARD_STYLE}`}>
            <CardHeader>
              <CardTitle className="font-heading text-base text-foreground font-semibold flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-primary" />
                Risk Assessment Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[150px]">Risk Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead className="text-right">User Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskData.map((row) => (
                    <TableRow key={row.name} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-medium">{row.name} Assessment</TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]"
                          style={{ backgroundColor: riskBadgeBackgroundByName[row.name] ?? "transparent", color: row.color }}
                        >
                          {row.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">{row.range}</TableCell>
                      <TableCell className="text-right font-bold">{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-8">
        <Card className={`${CARD_STYLE} bg-gradient-to-br from-card/60 to-primary/5 overflow-hidden`}>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="font-heading text-base text-foreground font-semibold">Monitoring Requirements</CardTitle>
                <CardDescription>Customers requiring active monitoring.</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <div className="text-3xl font-black tracking-tighter text-foreground">{monitoringCount}</div>
              <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
                {percentFormatter.format(monitoringShare)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-6 px-6">
            <div className="space-y-4">
              <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 shadow-[0_0_8px_rgba(95,74,223,0.45)]"
                  style={{ width: `${Math.max(0, Math.min(100, monitoringShare * 100))}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
                  <p className={SECONDARY_LABEL_CLASS}>Total Customers</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">{numberFormatter.format(totalUsers)}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-primary/5 p-3">
                  <p className={SECONDARY_LABEL_CLASS}>Under Monitoring</p>
                  <p className="mt-1 text-xl font-semibold text-primary">{numberFormatter.format(monitoringCount)}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
                  <p className={SECONDARY_LABEL_CLASS}>Not Monitored</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {numberFormatter.format(Math.max(totalUsers - monitoringCount, 0))}
                  </p>
                </div>
              </div>

              {monitoringCount === 0 ? (
                <p className={SECONDARY_LABEL_CLASS}>No active monitoring records are currently returned by the API.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

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
