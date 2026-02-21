"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ChevronLeft, ChevronRight, Download, FileCheck2, FilterX, Loader2, RotateCw, Search, X, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatDateTime } from "@/lib/date-format"

type ScreeningLog = {
  id: number
  user_id: number
  search_string: string
  screening_type: string
  is_match: boolean
  screening_date: string
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

type ScreeningLogsResponse = {
  status: boolean
  message: string
  data: {
    items: ScreeningLog[]
    total: number
    limit: number
    offset: number
  }
}

const PAGE_CLASS = "space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"

function getTypeTone(type: string) {
  const value = String(type || "").toLowerCase()
  if (value.includes("individual")) return "border-primary/30 bg-primary/12 text-primary"
  if (value.includes("entity") || value.includes("corporate") || value.includes("company")) {
    return "border-zinc-300 bg-zinc-200 text-zinc-700"
  }
  if (value.includes("adverse") || value.includes("pep")) return "border-rose-200 bg-rose-100 text-rose-700"
  if (value.includes("sanction")) return "border-violet-200 bg-violet-100 text-violet-700"
  if (value.includes("watch")) return "border-amber-200 bg-amber-100 text-amber-700"
  return "border-blue-200 bg-blue-100 text-blue-700"
}

function formatScreeningTypeLabel(type: string) {
  const normalized = String(type || "")
    .trim()
    .replace(/[_-]+/g, " ")
  if (!normalized) return "-"

  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export default function ScreeningLogsPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<ScreeningLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 15
  const [downloadingLogId, setDownloadingLogId] = useState<number | null>(null)

  useEffect(() => {
    void fetchLogs()
  }, [currentPage])

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/screening-logs?limit=${limit}&offset=${currentPage}`, {
        method: "GET",
        credentials: "include",
      })
      const data: ScreeningLogsResponse = await res.json()

      if (data.status) {
        setLogs(data.data.items || [])
        setTotal(data.data.total || 0)
        setError(null)
      } else {
        setError(data.message || "Failed to load screening logs")
      }
    } catch (err: any) {
      setError(err.message || "Failed to load screening logs")
    } finally {
      setLoading(false)
    }
  }

  const screeningTypes = useMemo(() => {
    const unique = new Set(logs.map((log) => log.screening_type).filter(Boolean))
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [logs])

  const filteredLogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        log.search_string.toLowerCase().includes(query) ||
        log.screening_type.toLowerCase().includes(query) ||
        log.user?.name?.toLowerCase().includes(query) ||
        log.user?.email?.toLowerCase().includes(query)

      const matchesType = typeFilter === "all" || log.screening_type === typeFilter

      return matchesSearch && matchesType
    })
  }, [logs, searchTerm, typeFilter])

  const summary = useMemo(() => {
    const matches = filteredLogs.filter((log) => log.is_match).length
    const matchRate = filteredLogs.length > 0 ? Math.round((matches / filteredLogs.length) * 100) : 0
    return {
      matches,
      matchRate,
      filteredTotal: filteredLogs.length,
    }
  }, [filteredLogs])

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const hasActiveFilters = searchTerm.trim().length > 0 || typeFilter !== "all"

  const clearAllFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setCurrentPage(1)
  }

  const handleDownloadReport = async (logId: number, searchString: string) => {
    if (downloadingLogId) return
    setDownloadingLogId(logId)

    try {
      const res = await fetch(`/api/screening-reports/${logId}`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({} as { message?: string }))
        const msg = errorData?.message || "This log has no file available for download."
        toast({
          title: "Report not found",
          description: msg,
        })
        return
      }

      const contentType = res.headers.get("content-type") || ""

      if (contentType.includes("application/pdf")) {
        // Direct PDF binary response
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${searchString.replace(/\s+/g, "_")}_report.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        const data = await res.json()
        if (data?.data?.file_url) {
          window.open(data.data.file_url, "_blank")
        } else {
          toast({
            title: "Report unavailable",
            description: "No report file is available for this screening log.",
          })
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      toast({
        title: "Download failed",
        description: message,
      })
    } finally {
      setDownloadingLogId(null)
    }
  }

  if (loading && logs.length === 0) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (error && logs.length === 0) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-rose-600">{error}</p>
            <Button className="mt-4 rounded-xl" variant="outline" onClick={() => void fetchLogs()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-10 w-10 shrink-0 rounded-xl border border-primary/20 bg-primary/10 text-primary flex items-center justify-center">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Screening Logs</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Review recent screening activity, match outcomes, and downloadable reports.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Total Records</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{total}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Filtered</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{summary.filteredTotal}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Matches</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{summary.matches}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                <p className={SECONDARY_LABEL_CLASS}>Match Rate</p>
                <p className="mt-1 text-xl font-bold tracking-tight">{summary.matchRate}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card className="rounded-2xl border-rose-200 bg-rose-50/90">
          <CardContent className="py-3 text-sm text-rose-700">{error}</CardContent>
        </Card>
      ) : null}

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          <div className="px-6 py-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, search term, or screening type..."
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-11 pl-9 pr-10"
                />
                {searchTerm.trim().length > 0 ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSearchTerm("")
                      setCurrentPage(1)
                    }}
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {screeningTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl"
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters || loading}
                  title="Clear all filters"
                  aria-label="Clear all filters"
                >
                  <FilterX className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl"
                  onClick={() => void fetchLogs()}
                  disabled={loading}
                  title="Refresh logs"
                  aria-label="Refresh logs"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-b-3xl rounded-t-none">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="sticky top-0 z-10 border-b border-border/60 bg-muted/50 backdrop-blur">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Date And Time</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Search String</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-[0.08em] text-muted-foreground">Screening Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Result</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Report</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={6}>
                      No screening logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {formatDateTime(log.screening_date, "-")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex min-w-[180px] flex-col">
                          <span className="text-sm font-semibold">{log.user?.name || "N/A"}</span>
                          {log.user?.email ? <span className="text-xs text-muted-foreground">{log.user.email}</span> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{log.search_string || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getTypeTone(log.screening_type)}`}>
                          {formatScreeningTypeLabel(log.screening_type)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.is_match ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Match Found
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                            <XCircle className="h-3.5 w-3.5" />
                            No Match
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`border-border/70 bg-background/90 text-xs font-semibold ${
                            downloadingLogId === log.id ? "h-8 rounded-full px-3" : "h-8 w-8 rounded-full p-0"
                          }`}
                          disabled={downloadingLogId === log.id}
                          onClick={() => handleDownloadReport(log.id, log.search_string)}
                          aria-label={downloadingLogId === log.id ? "Downloading..." : "Download"}
                          title={downloadingLogId === log.id ? undefined : "Download"}
                        >
                          {downloadingLogId === log.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          {downloadingLogId === log.id ? "Downloading..." : null}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
