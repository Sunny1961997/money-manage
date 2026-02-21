"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, FileSearch, Loader2, PencilLine, RefreshCw, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/lib/store"
import { formatDate } from "@/lib/date-format"

type GoamlReport = {
  id: number
  entity_reference?: string
  entityRefNo?: string
  customer_name?: string
  customerName?: string
  customer_id?: number | string
  customerId?: number | string
  estimated_value?: number | string
  created_at?: string
  createdDate?: string
  customer?: {
    customer_type?: string
  }
}

type GoamlReportsResponse = {
  status: boolean
  message?: string
  data?: {
    reports?: GoamlReport[]
    total?: number
  }
}

const PAGE_SIZE = 10
const PAGE_CLASS = "space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-xs font-extrabold uppercase tracking-[0.14em] text-foreground"
const INDIVIDUAL_TYPE_TONE_CLASS = "border-primary/30 bg-primary/12 text-primary"
const CORPORATE_TYPE_TONE_CLASS = "border-zinc-300 bg-zinc-200 text-zinc-700"

export default function GoamlReportingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useAuthStore()

  const [reports, setReports] = useState<GoamlReport[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  const normalizedRole = user?.role?.toLowerCase().trim() || ""
  const createdParam = searchParams.get("created")

  useEffect(() => {
    if (createdParam !== "1") return

    toast({
      title: "Success",
      description: "GOAML report created successfully.",
      variant: "success",
    })

    router.replace("/dashboard/goaml-reporting")
  }, [createdParam, router, toast])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const qs = new URLSearchParams()
      qs.set("limit", String(PAGE_SIZE))
      qs.set("offset", String(page))
      if (debouncedSearch.trim()) qs.set("search", debouncedSearch.trim())

      const res = await fetch(`/api/goaml/reports?${qs.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      const json: GoamlReportsResponse = await res.json()
      if (json?.status) {
        setReports(json.data?.reports || [])
        setTotal(json.data?.total || 0)
        setError(null)
      } else {
        setReports([])
        setTotal(0)
        setError(json?.message || "Failed to load reports")
      }
    } catch (fetchError: unknown) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to load reports"
      setReports([])
      setTotal(0)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    void fetchReports()
  }, [fetchReports, refreshKey])

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/dashboard")
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const showingTo = total === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + reports.length, total)

  const summary = useMemo(
    () => ({
      total,
      listedIndividuals: reports.filter((report) => String(report.customer?.customer_type || "").toLowerCase().trim() === "individual")
        .length,
      listedCorporates: reports.filter((report) => String(report.customer?.customer_type || "").toLowerCase().trim() === "corporate")
        .length,
    }),
    [reports, total],
  )

  return (
    <div className={PAGE_CLASS}>
      <Button
        variant="ghost"
        onClick={handleBack}
        className="w-fit gap-2 rounded-xl px-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <FileSearch className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">GOAML Reporting</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage generated GOAML reports, review details, and continue report workflows.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:min-w-[360px] sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Total</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{summary.total}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Individual</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{summary.listedIndividuals}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Corporate</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{summary.listedCorporates}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, customer ID, entity reference, or amount"
                className="h-10 rounded-xl border-border/70 bg-background/90 pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setRefreshKey((k) => k + 1)}
                    aria-label="Refresh reports"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Refresh reports</TooltipContent>
              </Tooltip>
              {normalizedRole !== "analyst" && (
                <Button asChild className="h-10 rounded-xl">
                  <Link href="/dashboard/goaml-reporting/create">Create New Report</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="-mx-4 mt-4 overflow-hidden border-y border-border/70 sm:-mx-5">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-3 py-3">Sl No.</th>
                    <th className="px-3 py-3">Entity Ref</th>
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Customer ID</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Created</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => {
                    const customerType = report.customer?.customer_type || "-"
                    const normalizedCustomerType = String(customerType).toLowerCase().trim()
                    const customerTypeTone =
                      normalizedCustomerType === "individual"
                        ? INDIVIDUAL_TYPE_TONE_CLASS
                        : normalizedCustomerType === "corporate"
                          ? CORPORATE_TYPE_TONE_CLASS
                          : "border-border/70 bg-muted/60 text-muted-foreground"
                    return (
                      <tr key={report.id || idx} className="border-t border-border/60 bg-background/70 hover:bg-muted/40">
                        <td className="px-3 py-3">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="px-3 py-3">{report.entity_reference || report.entityRefNo || "-"}</td>
                        <td className="px-3 py-3">{report.customer_name || report.customerName || "-"}</td>
                        <td className="px-3 py-3">{report.customer_id || report.customerId || "-"}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${customerTypeTone}`}
                          >
                            {customerType}
                          </span>
                        </td>
                        <td className="px-3 py-3">{report.estimated_value ?? "-"}</td>
                        <td className="px-3 py-3">{formatDate(report.created_at || report.createdDate, "-")}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            {normalizedRole !== "analyst" && (
                              <Button variant="outline" size="sm" asChild className="h-8 rounded-lg px-2.5">
                                <Link href={`/dashboard/goaml-reporting/edit/${report.id}`}>
                                  <PencilLine className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild className="h-8 rounded-lg px-2.5">
                              <Link href={`/dashboard/goaml-reporting/${report.id}`}>
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {!loading && reports.length === 0 && (
                    <tr>
                      <td className="px-4 py-8 text-center text-sm text-muted-foreground" colSpan={8}>
                        {error || "No reports found."}
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td className="px-4 py-8 text-center text-sm text-muted-foreground" colSpan={8}>
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span>Loading reports...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {showingFrom} to {showingTo} of {total}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="rounded-lg border border-border/70 bg-muted/60 px-2.5 py-1 text-xs font-semibold">
                  {page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
