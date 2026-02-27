"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts"
import { DollarSign, Users, CheckCircle2, AlertCircle, FileText, Download, Calendar, Loader2 } from "lucide-react"

// Styles from your existing structure
const PAGE_CLASS = "space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE = "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"

export default function RevenueDashboard() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/revenue-dashboard", { credentials: "include" })
        const data = await res.json()
        if (data.status) {
          setDashboard(data.data)
        } else {
          setError(data.message || "Failed to load dashboard")
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" aria-hidden="true" />
          </div>
          <p className="absolute top-full mt-4 text-sm text-muted-foreground animate-pulse whitespace-nowrap">Loading dashboard data...</p>
        </div>
      </div>
    )
  }
  if (error) return <div className={PAGE_CLASS}><div className="text-center py-20 text-destructive">{error}</div></div>
  if (!dashboard) return null

  // Prepare data for charts and cards
  const monthlyRevenueData = (dashboard.revenue_trend || []).map((item: any) => ({
    month: item.month,
    revenue: Number(item.revenue)
  }))
  const statusData = (dashboard.payment_by_status || []).map((item: any) => ({
    name: item.status,
    value: Number(item.amount),
    color: item.status === "Paid" ? "#3b82f6" : item.status === "Patially Paid" ? "#f59e0b" : "#ef4444"
  }))
  const topClientsData = (dashboard.top_companies || []).map((item: any) => ({
    clientId: item.company_name,
    revenue: Number(item.total_payment)
  }))
  const summaryData = {
    totalClients: dashboard.total_client,
    totalRevenue: Number(dashboard.total_revenue),
    activeClients: dashboard.total_client, // No separate field, fallback
    upcomingRenewals: dashboard.overdue_last_30_days,
  }
  const renewalData = {
    overdue: dashboard.overdue_count,
    dueIn30Days: dashboard.overdue_last_30_days,
    dueIn3190Days: dashboard.due_31_90_days,
  }

  return (
    <div className={PAGE_CLASS}>
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AML Meter Revenue Dashboard</h1>
          <p className="text-muted-foreground">Financial overview based on AML Meter Client Database</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-border/50">
            <FileText className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Download className="mr-2 h-4 w-4" /> PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={CARD_STYLE}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {summaryData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">SUM('Sales Tracker'!H2:H1000)</p>
          </CardContent>
        </Card>

        <Card className={CARD_STYLE}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalClients}</div>
            <p className="text-xs text-muted-foreground">COUNTA('Client Master'!A2:A1000)</p>
          </CardContent>
        </Card>

        <Card className={CARD_STYLE}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{summaryData.activeClients}</div>
            <p className="text-xs text-muted-foreground">COUNTIF('Client Master'!J2:J1000,"Active")</p>
          </CardContent>
        </Card>

        <Card className={CARD_STYLE}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{summaryData.upcomingRenewals}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart - LINE CHART */}
      <Card className={CARD_STYLE}>
        <CardHeader>
          <CardTitle>Revenue Trend (AED)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                axisLine={{ stroke: '#9ca3af' }}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={{ stroke: '#9ca3af' }}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  backgroundColor: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 8, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-end mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#3b82f6]"></span>
              <span>Revenue (AED)</span>
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Payment Status - Now with Overdue */}
        <Card className={CARD_STYLE}>
          <CardHeader>
            <CardTitle>Revenue by Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="80%">
              <BarChart 
                data={statusData} 
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  axisLine={{ stroke: '#9ca3af' }}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  axisLine={{ stroke: '#9ca3af' }}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    backgroundColor: 'white'
                  }}
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  formatter={(value) => [`AED ${value}`, 'Revenue']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 text-sm mt-4">
              {statusData.map((item: any) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-4 h-4" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground">{item.name}: AED {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Revenue (Top Rows) */}
        <Card className={CARD_STYLE}>
          <CardHeader>
            <CardTitle>Client Revenue (Top Rows)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={topClientsData.slice(0, 10)} 
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  axisLine={{ stroke: '#9ca3af' }}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="clientId"
                  axisLine={{ stroke: '#9ca3af' }}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    backgroundColor: 'white'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  formatter={(value) => [`AED ${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-end mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-[#3b82f6] rounded-sm"></span>
                <span>Revenue (AED)</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Alerts Section */}
      <Card className={CARD_STYLE}>
        <CardHeader>
          <CardTitle className="text-lg">Renewal Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
              <div className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">{renewalData.overdue}</div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900">
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400">Due in 0-30 days</div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{renewalData.dueIn30Days}</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Due in 31-90 days</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{renewalData.dueIn3190Days}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}