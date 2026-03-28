"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Search, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/date-format"

type Company = {
  id: number
  name: string
  email: string | null
  creation_date: string
  expiration_date: string
  total_screenings: number
  remaining_screenings: number
  trade_license_number: string
  phone_number: string
  city: string
  country: string
  created_at: string | null
  updated_at: string | null
  status?: string
  company_users_count?: number
}

const PAGE_CLASS = "space-y-8 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const LABEL_CLASS = "text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const ACTION_ICON_BUTTON_CLASS =
  "h-8 w-8 rounded-lg border border-border/60 bg-background/85 p-0 text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-sm active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
const ACTION_ICON_DELETE_BUTTON_CLASS =
  "h-8 w-8 rounded-lg border border-destructive/30 bg-background/85 p-0 text-destructive transition-all duration-200 hover:-translate-y-px hover:border-destructive/60 hover:bg-destructive/15 hover:text-destructive hover:shadow-sm active:translate-y-0 focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-0"

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [activeCount, setActiveCount] = useState(0)
  const [remainingScreeningsTotal, setRemainingScreeningsTotal] = useState(0)

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchParams = new URLSearchParams({
          offset: String((page - 1) * limit),
          limit: String(limit),
        })
        if (searchTerm) fetchParams.append("search", searchTerm)

        const res = await fetch(`/api/companies?${fetchParams.toString()}`, {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        console.log("API Response:", data)

        if (!(data.status === "success" || data.status)) {
          setError(data.message || "Failed to load companies")
          setCompanies([])
          return
        }

        const companiesFromApi: Company[] = Array.isArray(data.data) ? data.data : []

        if (data.meta) {
          setTotal(Number(data.meta.total ?? 0))
          setActiveCount(Number(data.meta.active ?? 0))
          setRemainingScreeningsTotal(Number(data.meta.remaining_screenings ?? 0))
        }

        setCompanies(companiesFromApi)
      } catch (err: any) {
        setError(err.message || "Failed to load companies")
      } finally {
        setLoading(false)
        setInitialLoad(false)
      }
    }

    fetchCompanies()
  }, [page, limit, searchTerm])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (initialLoad && loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="p-10 text-center text-sm text-destructive">{error}</CardContent>
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
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Companies</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage company profiles, subscription status, and screening capacity.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Button className="h-10 rounded-xl px-4" onClick={() => router.push("/dashboard/admin/companies/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={LABEL_CLASS}>Total Companies</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{total}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={LABEL_CLASS}>Active Subscriptions</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={LABEL_CLASS}>Remaining Screenings</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{remainingScreeningsTotal}</p>
          </CardContent>
        </Card>
      </div>

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          <div className="border-b border-border/60 p-5 sm:p-6">
            <div className="space-y-2">
              <p className={LABEL_CLASS}>Search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by company name, email, or license number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${FIELD_CLASS} pl-10`}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px]">
              <thead className="border-b border-border/70 bg-muted/30">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Company Name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">License Number/Emirates ID</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Location</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Screenings</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Creation Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Expiry Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={8}>
                      <Loader2 className="inline h-5 w-5 animate-spin mr-2" />Loading...
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={8}>
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => {
                    const isActive = new Date(company.expiration_date) > new Date()
                    const screeningPercentage =
                      company.total_screenings > 0
                        ? Math.round((company.remaining_screenings / company.total_screenings) * 100)
                        : 0

                    return (
                      <tr key={company.id} className="border-b border-border/60 transition hover:bg-muted/20">
                        <td className="px-4 py-3.5 pr-4">
                          <div className="flex items-center gap-2.5 text-sm text-foreground">
                            <Building2 className="h-4 w-4 shrink-0 text-primary" />
                            <span className="font-medium text-foreground">{company.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-foreground pr-4">
                          {company.email || "-"}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-foreground pr-4">{company.trade_license_number}</td>
                        <td className="px-4 py-3.5 text-sm text-foreground pr-4">
                          {company.city}, {company.country}
                        </td>
                        <td className="px-4 py-3.5 text-sm">
                          <div className="space-y-1.5">
                            <p className="text-foreground">
                              {company.remaining_screenings} / {company.total_screenings}
                            </p>
                            <div className="h-1.5 w-full rounded-full bg-muted">
                              <div className="h-1.5 rounded-full bg-primary" style={{ width: `${screeningPercentage}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-foreground">{formatDate(company.creation_date)}</td>
                        <td className="px-4 py-3.5 text-sm text-foreground">{formatDate(company.expiration_date)}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                              isActive
                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                : "border-rose-200 bg-rose-100 text-rose-700"
                            }`}
                          >
                            {isActive ? "Active" : "Expired"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 pr-6 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 justify-end">
                            <Button
                              type="button"
                              title="View Company Details"
                              variant="ghost"
                              size="sm"
                              className={ACTION_ICON_BUTTON_CLASS}
                              aria-label={`View ${company.name}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              title="Edit Company Details"
                              variant="ghost"
                              size="sm"
                              className={ACTION_ICON_BUTTON_CLASS}
                              aria-label={`Edit ${company.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              title="Delete Company"
                              variant="ghost"
                              size="sm"
                              className={ACTION_ICON_DELETE_BUTTON_CLASS}
                              aria-label={`Delete ${company.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              title="View Subscription History"
                              variant="ghost"
                              size="sm"
                              className={ACTION_ICON_BUTTON_CLASS}
                              aria-label={`Subscription History for ${company.name}`}
                              onClick={() => router.push(`/dashboard/admin/companies/${company.id}/subscriptions`)}
                            >
                              <span className="sr-only">Subscription History</span>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17l4 4 4-4m-4-5v9" /><circle cx="12" cy="7" r="4" /></svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between gap-4 px-4 py-6">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={p === page ? "bg-primary text-primary-foreground" : ""}
                  >
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Page {page} of {totalPages} ({total} total)
              </div>
              <div>
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={limit}
                  onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}
                >
                  {[10, 25, 50, 100].map(opt => (
                    <option key={opt} value={opt}>{opt} / page</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
