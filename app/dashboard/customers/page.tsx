"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, FileText, FilterX, Loader2, PencilLine, RotateCw, Search, User, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState, Fragment, type ReactNode, useCallback } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/store"
import { generateCustomerPDF } from "@/lib/pdf-generator"
import { formatDate } from "@/lib/date-format"

const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"
const EXPANDED_TABS_LIST_CLASS =
  "h-auto w-full flex-wrap justify-start gap-2 rounded-xl border border-border/60 bg-muted/30 p-1.5"
const EXPANDED_TABS_TRIGGER_CLASS =
  "rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition data-[state=active]:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
const EXPANDED_TAB_CONTENT_CLASS = "mt-3 px-2 pb-2 sm:px-3"
const DETAIL_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground"
const DETAIL_VALUE_CLASS = "mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words"
const DETAIL_RISK_SCORE_CIRCLE_CLASS = "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[13px] font-bold tabular-nums text-white"
const ACTION_BUTTON_CLASS =
  "h-9 rounded-full border-border/70 bg-background/90 px-7 has-[>svg]:px-6 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
const ACTION_PRIMARY_BUTTON_CLASS =
  "h-9 rounded-full bg-primary px-7 has-[>svg]:px-6 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
const ACTION_ICON_BUTTON_CLASS =
  "h-9 w-9 rounded-full border-border/70 bg-background/90 p-0 text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md focus-visible:ring-rose-200"
const INDIVIDUAL_TYPE_TONE_CLASS = "border-primary/30 bg-primary/12 text-primary"
const CORPORATE_TYPE_TONE_CLASS = "border-zinc-300 bg-zinc-200 text-zinc-700"
const QUESTIONNAIRE_GROUP_TONES = [
  {
    card: "border-primary/25 bg-primary/5",
    heading: "text-primary",
    row: "border-primary/20 bg-background/85",
  },
  {
    card: "border-zinc-300 bg-zinc-100/60",
    heading: "text-zinc-800",
    row: "border-zinc-300/80 bg-white/90",
  },
]

type DetailItem = {
  label: string
  value: ReactNode
  valueContainerClassName?: string
}

function DetailGrid({ items }: { items: DetailItem[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <div className={DETAIL_LABEL_CLASS}>{item.label}</div>
          <div className={item.valueContainerClassName ?? DETAIL_VALUE_CLASS}>{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [individualTotal, setIndividualTotal] = useState(0)
  const [corporateTotal, setCorporateTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [detailsById, setDetailsById] = useState<Record<number, any>>({})
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const numberFormatter = new Intl.NumberFormat(undefined)
  const formatDisplayDate = (value: Date | string | number | null | undefined) => {
    if (!value) return "-"
    return formatDate(value, String(value))
  }
  const formatDisplayNumber = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === "") return "-"
    if (typeof value === "number") return numberFormatter.format(value)

    const raw = String(value).trim()
    const normalized = raw.replace(/,/g, "")
    if (/^-?\d+(\.\d+)?$/.test(normalized)) {
      return numberFormatter.format(Number(normalized))
    }

    return raw
  }
  const getRisk = (val: any) => {
    const s = Number(val)

    // Handle empty, null, or invalid numbers
    if (val === null || val === undefined || isNaN(s) || s < 1) {
      return { label: "-", badgeClass: "bg-gray-100 text-gray-600 border-gray-200", scoreClass: "bg-gray-500" }
    }
    if (s >= 4.0) return { label: "High Risk", badgeClass: "bg-red-100 text-red-700 border-red-200", scoreClass: "bg-red-600" }
    if (s >= 3.0) {
      return { label: "Medium High", badgeClass: "bg-orange-100 text-orange-700 border-orange-200", scoreClass: "bg-orange-600" }
    }
    if (s >= 2.0) return { label: "Medium Risk", badgeClass: "bg-amber-100 text-amber-700 border-amber-200", scoreClass: "bg-amber-600" }
    if (s >= 1.5) return { label: "Low Medium", badgeClass: "bg-blue-100 text-blue-700 border-blue-200", scoreClass: "bg-blue-600" }
    return { label: "Low Risk", badgeClass: "bg-green-100 text-green-700 border-green-200", scoreClass: "bg-green-600" }
  }

  const getStatusTone = (status: any) => {
    const value = String(status || "").toLowerCase().trim()
    if (value === "active" || value === "onboarded") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    }
    if (value === "pending") {
      return "bg-amber-100 text-amber-700 border-amber-200"
    }
    if (value === "inactive" || value === "blocked" || value === "rejected") {
      return "bg-rose-100 text-rose-700 border-rose-200"
    }
    return "bg-muted text-muted-foreground border-border"
  }

  const formatStatusLabel = (status: any) => {
    const value = String(status || "Unknown").trim()
    if (!value) return "Unknown"
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!detailsById[id]) {
      try {
        const res = await fetch(`/api/onboarding/customers/${id}`, { credentials: "include" })
        const json = await res.json()
        if (json.status) {
          setDetailsById(prev => ({ ...prev, [id]: json.data }));
        }
      } catch {}
    }
  }

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const buildQuery = (params: Record<string, string | number>) => {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        query.set(key, String(value))
      })
      return query.toString()
    }

    const baseParams = { search: searchTerm || "" }

    try {
      const [res, individualRes, corporateRes] = await Promise.all([
        fetch(`/api/onboarding/customers?${buildQuery({ ...baseParams, limit, offset })}`, { credentials: "include" }),
        fetch(`/api/onboarding/customers?${buildQuery({ ...baseParams, limit: 1, offset: 1, customer_type: "individual" })}`, {
          credentials: "include",
        }),
        fetch(`/api/onboarding/customers?${buildQuery({ ...baseParams, limit: 1, offset: 1, customer_type: "corporate" })}`, {
          credentials: "include",
        }),
      ])

      const [json, individualJson, corporateJson] = await Promise.all([res.json(), individualRes.json(), corporateRes.json()])

      if (json.status && json.data) {
        setCustomers(Array.isArray(json.data.items) ? json.data.items : [])
        setTotal(Number(json.data.total || 0))
      }
      setIndividualTotal(individualJson?.status ? Number(individualJson?.data?.total || 0) : 0)
      setCorporateTotal(corporateJson?.status ? Number(corporateJson?.data?.total || 0) : 0)
    } finally {
      setLoading(false)
    }
  }, [limit, offset, searchTerm])

  useEffect(() => {
    void fetchCustomers()
  }, [fetchCustomers])
  const totalPages = Math.ceil(total / limit)
  const hasActiveFilters = searchTerm.trim().length > 0 || limit !== 10

  const clearFilters = () => {
    setSearchTerm("")
    setLimit(10)
    setOffset(1)
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={SECONDARY_LABEL_CLASS}>Total Records</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{numberFormatter.format(total)}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${INDIVIDUAL_TYPE_TONE_CLASS}`}>
              Individual
            </span>
            <p className="mt-2 text-3xl font-bold tracking-tight">{numberFormatter.format(individualTotal)}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${CORPORATE_TYPE_TONE_CLASS}`}>
              Corporate
            </span>
            <p className="mt-2 text-3xl font-bold tracking-tight">{numberFormatter.format(corporateTotal)}</p>
          </CardContent>
        </Card>
      </section>

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="px-6 py-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_auto] lg:items-center">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="h-11 w-full pl-9 pr-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setOffset(1)
                  }}
                />
                {searchTerm.trim().length > 0 ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSearchTerm("")
                      setOffset(1)
                    }}
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              <Select
                defaultValue="10"
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value))
                  setOffset(1)
                }}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters || loading}
                  title="Clear filters"
                  aria-label="Clear filters"
                >
                  <FilterX className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl"
                  onClick={() => void fetchCustomers()}
                  disabled={loading}
                  title="Refresh customers"
                  aria-label="Refresh customers"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-b-3xl rounded-t-none">
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading customers...</span>
              </div>
            ) : (
              <table className="w-full min-w-[980px] text-sm">
                <thead className="sticky top-0 z-10 border-b border-border/60 bg-muted/50 backdrop-blur">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-[0.12em] text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-[0.12em] text-muted-foreground">Country</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-[0.12em] text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-[0.12em] text-muted-foreground">Customer Type</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-[0.12em] text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-[0.12em] text-muted-foreground">Created Date</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-[0.12em] text-muted-foreground">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-b-0">
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        No customers found for your current filter.
                      </td>
                    </tr>
                  ) : (
                  customers.map((customer) => {
                    const isExpanded = expandedId === customer.id
                    const isIndividualRow = customer.customer_type === "individual"
                    const RowIcon = isIndividualRow ? User : Building2
                    const customerTypeTone = isIndividualRow ? INDIVIDUAL_TYPE_TONE_CLASS : CORPORATE_TYPE_TONE_CLASS
                    const riskInfo = getRisk(customer.risk_level)
                    const hasRisk = customer.risk_level !== null && customer.risk_level !== undefined && !isNaN(Number(customer.risk_level))
                    const riskScoreValue = hasRisk ? Number(customer.risk_level).toFixed(2) : "-"
                    return (
                      <Fragment key={customer.id}>
                        <tr
                          className={`border-b border-border/50 transition-colors ${isExpanded ? "bg-primary/5" : "hover:bg-primary/5"}`}
                        >
                          <td className="px-4 py-3.5">
                            <button
                              className="group flex w-full items-center gap-3 text-left"
                              type="button"
                              onClick={() => toggleExpand(customer.id)}
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                                <RowIcon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span
                                  className={`block truncate font-semibold transition-colors ${isExpanded ? "text-primary" : "text-foreground group-hover:text-primary"}`}
                                >
                                  {customer.name || "-"}
                                </span>
                                <span className="block text-xs text-muted-foreground">ID #{customer.id}</span>
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180 text-primary" : ""}`}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">{customer.country || "-"}</td>
                          <td className="px-4 py-3.5 text-muted-foreground">{customer.email || "-"}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${customerTypeTone}`}>
                              {isIndividualRow ? "Individual" : "Corporate"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(customer.status)}`}>
                              {formatStatusLabel(customer.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">{formatDate(customer.created_at)}</td>
                          <td className="px-4 py-3.5">
                            {hasRisk ? (
                              <span className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-semibold ${riskInfo.badgeClass}`}>
                                <span className={`inline-flex h-7 min-w-7 px-2 items-center justify-center rounded-full text-[10px] font-bold text-white ${riskInfo.scoreClass}`}>
                                  {riskScoreValue}
                                </span>
                                <span>{riskInfo.label}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-2 py-1 text-xs font-medium text-muted-foreground">
                                <span className="inline-flex h-7 min-w-7 px-2 items-center justify-center rounded-full bg-muted-foreground text-[10px] font-bold text-white">
                                  -
                                </span>
                                <span>Not Scored</span>
                              </span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-background/85">
                            <td colSpan={7} className="px-4 py-4">
                              {detailsById[customer.id] ? (
                                (() => {
                                  const data = detailsById[customer.id]
                                  const isCorporate = data.customer_type === "corporate"
                                  const corp = data.corporate_detail
                                  const indiv = data.individual_detail;
                                  const user_customer = data.user_customer
                                  // Aggregate partners/UBOs from multiple possible API keys and flatten
                                  const possiblePersonsArrays = [
                                    data.corporate_detail?.related_persons,
                                    data.corporate_related_persons,
                                    data.corporate_detail?.partners,
                                    data.related_persons,
                                    data.partners,
                                    data.corporate_detail?.ubo_partners,
                                  ].filter((arr: any) => Array.isArray(arr));
                                  const partners = possiblePersonsArrays.reduce((acc: any[], arr: any[]) => acc.concat(arr), [] as any[]);
                                  const partnersCount = partners.length;
                                  const expandedCustomerName = isCorporate
                                    ? corp?.company_name || data.name || "-"
                                    : [indiv?.first_name, indiv?.last_name].filter(Boolean).join(" ") || data.name || "-"
                                  const expandedStatus = formatStatusLabel(data?.status)
                                  const expandedCustomerType = isCorporate ? "Corporate" : "Individual"
                                  const expandedTypeTone = isCorporate ? CORPORATE_TYPE_TONE_CLASS : INDIVIDUAL_TYPE_TONE_CLASS

                                  const companyInfoItems: DetailItem[] = [
                                    { label: "Company Name", value: corp?.company_name || data.name || "-" },
                                    { label: "Email", value: data?.corporate_detail?.email || "-" },
                                    { label: "Company Address", value: corp?.company_address || "-" },
                                    { label: "City", value: corp?.city || "-" },
                                    { label: "Country of Incorporation", value: corp?.country_incorporated || "-" },
                                    { label: "PO Box No", value: corp?.po_box || "-" },
                                    {
                                      label: "Contact Office No",
                                      value: `${data?.corporate_detail?.office_country_code || ""}${data?.corporate_detail?.office_no || ""}` || "-",
                                    },
                                    {
                                      label: "Contact Mobile No",
                                      value: `${data?.corporate_detail?.mobile_country_code || ""}${data?.corporate_detail?.mobile_no || ""}` || "-",
                                    },
                                    {
                                      label: "Corporate Status",
                                      value: (
                                        <span
                                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(
                                            data?.status || "onboarded",
                                          )}`}
                                        >
                                          {formatStatusLabel(data?.status || "Onboarded")}
                                        </span>
                                      ),
                                      valueContainerClassName: "mt-1",
                                    },
                                  ]

                                  const licenseItems: DetailItem[] = [
                                    { label: "Trade License/CR No", value: corp?.trade_license_no || "-" },
                                    { label: "Issued At", value: corp?.trade_license_issued_at || "-" },
                                    { label: "Issued By", value: corp?.trade_license_issued_by || "-" },
                                    {
                                      label: "Issue Date",
                                      value: formatDisplayDate(corp?.license_issue_date),
                                      valueContainerClassName: "mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words",
                                    },
                                    {
                                      label: "Expiry Date",
                                      value: formatDisplayDate(corp?.license_expiry_date),
                                      valueContainerClassName: "mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words",
                                    },
                                    { label: "VAT Registration No", value: corp?.vat_registration_no || "-" },
                                  ]

                                  const businessItems: DetailItem[] = [
                                    { label: "Entity Type", value: corp?.entity_type || "-" },
                                    { label: "Business Activity", value: corp?.business_activity || "-" },
                                    {
                                      label: "Countries of Operation",
                                      value: Array.isArray(data.country_operations) && data.country_operations.length > 0
                                        ? data.country_operations.map((item: any) => item.country).join(", ")
                                        : "-",
                                    },
                                    { label: "Account Holding Bank Name", value: corp?.account_holding_bank_name || "-" },
                                  ]

                                  const hasDetailRisk = data.risk_level !== null && data.risk_level !== undefined && !isNaN(Number(data.risk_level))
                                  const detailRiskInfo = getRisk(data.risk_level)
                                  const detailRiskScore = hasDetailRisk ? Number(data.risk_level).toFixed(2) : "-"
                                  const detailRiskLabel = hasDetailRisk ? detailRiskInfo.label : "Not Scored"

                                  const personalInfoItems: DetailItem[] = [
                                    { label: "Full Name", value: [indiv?.first_name, indiv?.last_name].filter(Boolean).join(" ") || data.name || "-" },
                                    { label: "Email", value: indiv?.email || data.email || "-" },
                                    { label: "Date of Birth", value: formatDisplayDate(indiv?.dob) },
                                    { label: "Gender", value: indiv?.gender || "-" },
                                    { label: "Nationality", value: indiv?.nationality || "-" },
                                    { label: "Country of Residence", value: indiv?.country_of_residence || indiv?.country || "-" },
                                    { label: "Address", value: indiv?.address || "-" },
                                    { label: "City", value: indiv?.city || "-" },
                                  ]

                                  const transactionItems: DetailItem[] = [
                                    { label: "Occupation", value: indiv?.occupation || "-" },
                                    { label: "Source of Income", value: indiv?.source_of_income || "-" },
                                    { label: "Purpose of Onboarding", value: indiv?.purpose_of_onboarding || "-" },
                                    { label: "Payment Mode", value: indiv?.payment_mode || "-" },
                                    {
                                      label: "Expected Transactions",
                                      value: formatDisplayNumber(indiv?.expected_no_of_transactions),
                                    },
                                    { label: "Expected Volume", value: formatDisplayNumber(indiv?.expected_volume) },
                                  ]

                                  const identificationItems: DetailItem[] = [
                                    { label: "ID Type", value: indiv?.id_type || "-" },
                                    { label: "ID Number", value: indiv?.id_no || "-" },
                                    { label: "Issuing Authority", value: indiv?.issuing_authority || "-" },
                                    { label: "Issuing Country", value: indiv?.issuing_country || "-" },
                                    { label: "Issue Date", value: formatDisplayDate(indiv?.id_issue_date) },
                                    { label: "Expiry Date", value: formatDisplayDate(indiv?.id_expiry_date) },
                                  ]

                                  const additionalItems: DetailItem[] = [
                                    { label: "PEP", value: indiv?.is_pep ? "Yes" : "No" },
                                    { label: "Dual Nationality", value: indiv?.dual_nationality ? "Yes" : "No" },
                                    { label: "Adverse News", value: indiv?.adverse_news ? "Yes" : "No" },
                                    { label: "Screening Fuzziness", value: data?.screening_fuzziness || "-" },
                                  ]

                                  return (
                                    <div className="rounded-2xl border border-border/60 bg-background/90 shadow-[0_16px_36px_-24px_oklch(0.28_0.06_260/0.45)]">
                                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/20 p-3">
                                        <div className="min-w-0 flex items-center gap-3">
                                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/70 text-muted-foreground">
                                            {isCorporate ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                          </span>
                                          <div className="min-w-0">
                                            <p className={SECONDARY_LABEL_CLASS}>Customer Details</p>
                                            <p className="truncate font-semibold text-foreground">{expandedCustomerName}</p>
                                          </div>
                                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${expandedTypeTone}`}>
                                            {expandedCustomerType}
                                          </span>
                                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(data?.status)}`}>
                                            {expandedStatus}
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-end gap-2">
                                        {user?.role !== "Analyst" && (
                                          <Link href={`/dashboard/onboarding/customer/edit/${customer.id}`}>
                                            <Button className={ACTION_PRIMARY_BUTTON_CLASS}>
                                              <PencilLine className="h-3.5 w-3.5" />
                                              Edit Information
                                            </Button>
                                          </Link>
                                        )}

                                        <Button 
                                          variant="outline" 
                                          className={ACTION_BUTTON_CLASS}
                                          onClick={() => generateCustomerPDF({...data, user_customer})}
                                        >
                                          <Download className="h-3.5 w-3.5" />
                                          Download
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={ACTION_ICON_BUTTON_CLASS}
                                          onClick={() => setExpandedId(null)}
                                          aria-label="Close details"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </Button>
                                        </div>
                                      </div>
                                      {isCorporate ? (
                                        <Tabs defaultValue="company-info" className="p-4">
                                          <TabsList className={EXPANDED_TABS_LIST_CLASS}>
                                            <TabsTrigger value="company-info" className={EXPANDED_TABS_TRIGGER_CLASS}>Company Info</TabsTrigger>
                                            <TabsTrigger value="license-info" className={EXPANDED_TABS_TRIGGER_CLASS}>License Info</TabsTrigger>
                                            <TabsTrigger value="business-details" className={EXPANDED_TABS_TRIGGER_CLASS}>Business Details</TabsTrigger>
                                            <TabsTrigger value="partners" className={EXPANDED_TABS_TRIGGER_CLASS}>Partners{partnersCount ? ` (${partnersCount})` : ""}</TabsTrigger>
                                            <TabsTrigger value="documents" className={EXPANDED_TABS_TRIGGER_CLASS}>Documents</TabsTrigger>
                                            <TabsTrigger value="risk-details" className={EXPANDED_TABS_TRIGGER_CLASS}>Risk Details</TabsTrigger>
                                            {/* <TabsTrigger value="aml-questionnaires">AML Questionnaires</TabsTrigger> */}
                                            <TabsTrigger value="aml-questionnaire-answers" className={EXPANDED_TABS_TRIGGER_CLASS}>Compliance questionnaire</TabsTrigger>
                                          </TabsList>
                                          <TabsContent value="company-info" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            <DetailGrid items={companyInfoItems} />
                                          </TabsContent>
                                          <TabsContent value="license-info" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            {isCorporate ? (
                                              <DetailGrid items={licenseItems} />
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No license info for individual customers.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="business-details" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            {isCorporate ? (
                                              <DetailGrid items={businessItems} />
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No business details for individual customers.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="partners" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            {Array.isArray(partners) && partners.length > 0 ? (
                                              <div className="space-y-4 mt-4">
                                                {partners.map((p: any, idx: number) => {
                                                  const displayType = p.type || p.person_type || p.entity_type || (p.is_entity ? "Entity" : p.is_individual ? "Individual" : "-");
                                                  const displayName = p.name || [p.first_name, p.last_name].filter(Boolean).join(" ") || p.entity_name || "-";
                                                  const displayNationality = p.nationality || p.country || p.country_of_residence || "-";
                                                  const displayRole = p.role || p.designation || p.relationship || p.position || "-";
                                                  const displayOwnership = (p.ownership_percentage ?? p.share_percentage ?? p.ownership ?? "-");
                                                  const idType = p.id_type || p.identification_type || p.document_type || "-";
                                                  const idNumber = p.id_number || p.id_no || p.identification_number || p.document_number || "-";
                                                  const pepRaw = (p.is_pep ?? p.pep ?? p.politically_exposed_person);
                                                  let displayPep: string | number = pepRaw;
                                                  if (typeof pepRaw === "boolean") {
                                                    displayPep = pepRaw ? "Yes" : "No";
                                                  } else if (typeof pepRaw === "number") {
                                                    displayPep = pepRaw === 1 ? "Yes" : "No";
                                                  } else if (typeof pepRaw === "string") {
                                                    const v = pepRaw.toLowerCase();
                                                    displayPep = ["1", "true", "yes", "y"].includes(v)
                                                      ? "Yes"
                                                      : (["0", "false", "no", "n"].includes(v) ? "No" : pepRaw);
                                                  }
                                                  const dob = formatDisplayDate(p.dob || p.date_of_birth);
                                                  const idIssue = formatDisplayDate(p.id_issue || p.id_issued || p.issue_date);
                                                  const idExpiry = formatDisplayDate(p.id_expiry || p.expiry_date);
                                                  const key = p.id ?? `${displayName}-${displayNationality}-${idx}`;
                                                  return (
                                                    <div key={key} className="grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 md:grid-cols-2">
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Type</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{displayType}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Name</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{displayName}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Nationality</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{displayNationality}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Role</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{displayRole}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Ownership %</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{displayOwnership}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Type</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{idType}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Number</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{idNumber}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">PEP</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{displayPep}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">DOB</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{dob}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Issue</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{idIssue}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Expiry</div>
                                                        <div className="mt-1 px-1 py-0.5 text-sm font-medium text-foreground break-words">{idExpiry}</div>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No partners/UBOs available.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="documents" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            {Array.isArray(data.documents) && data.documents.length > 0 ? (
                                              <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2">
                                                {data.documents.map((doc: any) => {
                                                  const fileName = doc.file_name || "Document"
                                                  const isPdf = /\.pdf$/i.test(fileName)

                                                  return (
                                                    <div key={doc.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                                                      <div className="flex items-start gap-3">
                                                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600">
                                                          <FileText className="h-4 w-4" />
                                                        </span>
                                                        <div className="min-w-0">
                                                          <p className="truncate text-sm font-semibold text-foreground">{fileName}</p>
                                                          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                                                            {isPdf ? "PDF Document" : "Document"}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="mt-3 flex justify-end">
                                                        <a
                                                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${doc.file_path}`}
                                                          target="_blank"
                                                          rel="noreferrer"
                                                          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                                                        >
                                                          <Eye className="h-3.5 w-3.5" />
                                                          View
                                                        </a>
                                                      </div>
                                                    </div>
                                                  )
                                                })}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No documents uploaded.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="risk-details" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            <div className="mt-4 rounded-xl border border-border/60 bg-background/70 p-4">
                                              <p className={SECONDARY_LABEL_CLASS}>Risk Profile</p>
                                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <span
                                                  className={`${DETAIL_RISK_SCORE_CIRCLE_CLASS} ${
                                                    hasDetailRisk ? detailRiskInfo.scoreClass : "bg-muted-foreground"
                                                  }`}
                                                >
                                                  {detailRiskScore}
                                                </span>
                                                <span
                                                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
                                                    hasDetailRisk ? detailRiskInfo.badgeClass : "border-border bg-muted/30 text-muted-foreground"
                                                  }`}
                                                >
                                                  {detailRiskLabel}
                                                </span>
                                              </div>
                                            </div>
                                          </TabsContent>
                                          <TabsContent value="aml-questionnaire-answers" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            {Array.isArray(corp?.question_answers) && corp.question_answers.length > 0 ? (
                                              <div className="space-y-4 mt-4">
                                                {Object.entries(
                                                  (corp.question_answers as any[]).reduce((acc: Record<string, any[]>, qa: any) => {
                                                    const cat = qa?.question?.category || "Other"
                                                    if (!acc[cat]) acc[cat] = []
                                                    acc[cat].push(qa)
                                                    return acc
                                                  }, {})
                                                ).map(([category, items], groupIndex) => {
                                                  const tone = QUESTIONNAIRE_GROUP_TONES[groupIndex % QUESTIONNAIRE_GROUP_TONES.length]
                                                  return (
                                                  <div key={category} className={`rounded-xl border p-3 ${tone.card}`}>
                                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                      <div className={`font-semibold ${tone.heading}`}>{category}</div>
                                                      <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                                                        {(items as any[]).length} questions
                                                      </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                      {(items as any[])
                                                        .slice()
                                                        .sort((a, b) => Number(a?.question?.order || 0) - Number(b?.question?.order || 0))
                                                        .map((qa) => {
                                                          const ans = qa?.answer
                                                          const yesNo = typeof ans === "boolean" ? (ans ? "Yes" : "No") : ans === 1 ? "Yes" : ans === 0 ? "No" : ans ?? "-"
                                                          const qText = qa?.question?.question || "-"
                                                          return (
                                                            <div key={qa.id || `${qa.compliance_question_id}-${qText}`} className={`grid grid-cols-12 gap-3 rounded-lg border p-2.5 ${tone.row}`}>
                                                              <div className="col-span-10 text-sm">{qText}</div>
                                                              <div className="col-span-2 text-sm font-semibold text-right">{yesNo}</div>
                                                            </div>
                                                          )
                                                        })}
                                                    </div>
                                                  </div>
                                                  )
                                                })}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No Compliance questionnaire available.</div>
                                            )}
                                          </TabsContent>
                                        </Tabs>
                                      ) : (
                                        <Tabs defaultValue="personal-info" className="p-4">
                                          <TabsList className={EXPANDED_TABS_LIST_CLASS}>
                                            <TabsTrigger value="personal-info" className={EXPANDED_TABS_TRIGGER_CLASS}>Personal Info</TabsTrigger>
                                            <TabsTrigger value="transaction-details" className={EXPANDED_TABS_TRIGGER_CLASS}>Transaction Details</TabsTrigger>
                                            <TabsTrigger value="identification-details" className={EXPANDED_TABS_TRIGGER_CLASS}>Identification Details</TabsTrigger>
                                            <TabsTrigger value="additional-info" className={EXPANDED_TABS_TRIGGER_CLASS}>Additional Information</TabsTrigger>
                                            <TabsTrigger value="risk-details" className={EXPANDED_TABS_TRIGGER_CLASS}>Risk Details</TabsTrigger>
                                          </TabsList>
                                          <TabsContent value="personal-info" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            <DetailGrid items={personalInfoItems} />
                                          </TabsContent>
                                          <TabsContent value="transaction-details" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            <DetailGrid items={transactionItems} />
                                          </TabsContent>
                                          <TabsContent value="identification-details" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            <DetailGrid items={identificationItems} />
                                          </TabsContent>
                                          <TabsContent value="additional-info" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            <DetailGrid items={additionalItems} />
                                          </TabsContent>
                                          <TabsContent value="risk-details" className={EXPANDED_TAB_CONTENT_CLASS}>
                                            <div className="mt-4 rounded-xl border border-border/60 bg-background/70 p-4">
                                              <p className={SECONDARY_LABEL_CLASS}>Risk Profile</p>
                                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <span
                                                  className={`${DETAIL_RISK_SCORE_CIRCLE_CLASS} ${
                                                    hasDetailRisk ? detailRiskInfo.scoreClass : "bg-muted-foreground"
                                                  }`}
                                                >
                                                  {detailRiskScore}
                                                </span>
                                                <span
                                                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
                                                    hasDetailRisk ? detailRiskInfo.badgeClass : "border-border bg-muted/30 text-muted-foreground"
                                                  }`}
                                                >
                                                  {detailRiskLabel}
                                                </span>
                                              </div>
                                            </div>
                                          </TabsContent>
                                        </Tabs>
                                      )}
                                    </div>
                                  )
                                })()
                              ) : (
                                <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Loading details...</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  }))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(offset - 1) * limit + 1} to {Math.min(offset * limit, total)} of {total} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset((p) => Math.max(1, p - 1))}
                  disabled={offset === 1 || loading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary">
                  Page {offset} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset((p) => Math.min(totalPages, p + 1))}
                  disabled={offset === totalPages || loading}
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
