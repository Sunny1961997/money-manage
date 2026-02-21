"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, FileText, Loader2, PencilLine } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { buildGoamlXml, buildGoamlXmlFilename, downloadXml } from "./goamlXml"
import { useAuthStore } from "@/lib/store"
import { formatDate } from "@/lib/date-format"

type DetailFieldItem = {
  key: string
  label: string
  value: ReactNode
  fullWidth?: boolean
}

const PAGE_CLASS = "space-y-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-xs font-extrabold uppercase tracking-[0.14em] text-foreground"

async function readJsonSafely(res: Response): Promise<any | null> {
  const text = await res.text()
  if (!text || !text.trim()) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function formatNumberValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-"

  const source = typeof value === "string" ? value.trim() : value
  const normalized = typeof source === "string" ? source.replace(/,/g, "") : source
  const numberValue = typeof normalized === "number" ? normalized : Number(normalized)

  if (Number.isFinite(numberValue)) {
    return new Intl.NumberFormat("en-US").format(numberValue)
  }

  return String(value)
}

function DetailField({ label, value, fullWidth }: { label: string; value: ReactNode; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <div className="mt-1 rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-sm">{value}</div>
    </div>
  )
}

export default function ViewGoamlReportPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [report, setReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [xmlBusy, setXmlBusy] = useState(false)

  const { user } = useAuthStore()
  const normalizedRole = user?.role?.toLowerCase().trim() || ""

  useEffect(() => {
    if (!id) {
      setError("Missing report ID")
      setLoading(false)
      return
    }

    async function fetchReport() {
      try {
        setLoading(true)
        const res = await fetch(`/api/goaml/reports/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await readJsonSafely(res)

        if (!res.ok) {
          setError(json?.message || json?.error || `Failed to load report (${res.status})`)
          return
        }

        if (json?.status) {
          setReport(json.data.report)
          setError(null)
        } else if (json?.data?.report) {
          setReport(json.data.report)
          setError(null)
        } else {
          setError(json?.message || "Failed to load report")
        }
      } catch (fetchError: unknown) {
        const message = fetchError instanceof Error ? fetchError.message : "Failed to load report"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void fetchReport()
  }, [id])

  const xmlFilename = useMemo(() => buildGoamlXmlFilename(report, id), [report, id])

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/dashboard/goaml-reporting")
  }

  const onGenerateXml = () => {
    if (!report) return
    setXmlBusy(true)
    try {
      const xml = buildGoamlXml(report)
      downloadXml(xmlFilename, xml)
    } finally {
      setXmlBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" aria-hidden="true" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-rose-600">{error}</p>
            <Button className="mt-4 rounded-xl" variant="outline" onClick={handleBack}>
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!report) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No report found.</p>
            <Button className="mt-4 rounded-xl" variant="outline" onClick={handleBack}>
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const customerType = report.customer?.customer_type
  const isCorporate = customerType === "corporate"
  const isIndividual = customerType === "individual"
  const indiv = report.customer?.individual_detail
  const corp = report.customer?.corporate_detail
  const products = Array.isArray(report.customer?.products) ? report.customer.products : []

  const customerFields: DetailFieldItem[] = [
    {
      key: "customerType",
      label: "Customer Type",
      value: customerType || "-",
    },
    {
      key: "customerName",
      label: "Customer Name",
      value:
        report.customer_name ||
        (isCorporate ? corp?.company_name : `${indiv?.first_name || ""} ${indiv?.last_name || ""}`.trim()) ||
        report.customer?.name ||
        "-",
    },
    {
      key: "customerId",
      label: "Customer ID",
      value: report.customer_id || report.customer?.id || "-",
    },
    {
      key: "customerEmail",
      label: "Email",
      value: indiv?.email || corp?.email || report.customer?.email || "-",
    },
  ]

  if (isCorporate) {
    customerFields.push(
      {
        key: "companyAddress",
        label: "Company Address",
        value: corp?.company_address || "-",
      },
      {
        key: "companyCity",
        label: "City",
        value: corp?.city || "-",
      },
      {
        key: "countryIncorporated",
        label: "Country of Incorporation",
        value: corp?.country_incorporated || "-",
      },
      {
        key: "officeContact",
        label: "Office Contact",
        value: corp?.office_no ? `${corp?.office_country_code || ""} ${corp?.office_no}`.trim() : "-",
      },
    )
  }

  if (isIndividual) {
    customerFields.push(
      {
        key: "contactNo",
        label: "Contact Number",
        value: indiv?.contact_no ? `${indiv?.country_code || ""} ${indiv?.contact_no}`.trim() : "-",
      },
      {
        key: "address",
        label: "Address",
        value: indiv?.address || "-",
      },
      {
        key: "countryResidence",
        label: "Country of Residence",
        value: indiv?.country_of_residence || "-",
      },
      {
        key: "city",
        label: "City",
        value: indiv?.city || "-",
      },
    )
  }

  const individualPersonalFields: DetailFieldItem[] = [
    { key: "firstName", label: "First Name", value: indiv?.first_name || "-" },
    { key: "lastName", label: "Last Name", value: indiv?.last_name || "-" },
    { key: "dob", label: "Date of Birth", value: formatDate(indiv?.dob, indiv?.dob || "-") },
    { key: "gender", label: "Gender", value: indiv?.gender || "-" },
    { key: "residential", label: "Residential Status", value: indiv?.residential_status || "-" },
    { key: "nationality", label: "Nationality", value: indiv?.nationality || "-" },
    { key: "placeBirth", label: "Place of Birth", value: indiv?.place_of_birth || "-" },
    { key: "countryResidence", label: "Country of Residence", value: indiv?.country_of_residence || "-" },
    { key: "address", label: "Address", value: indiv?.address || "-", fullWidth: true },
    { key: "country", label: "Country", value: indiv?.country || "-" },
    {
      key: "contactNo",
      label: "Contact Number",
      value: indiv?.contact_no ? `${indiv?.country_code || ""} ${indiv?.contact_no}`.trim() : "-",
    },
    { key: "email", label: "Email", value: indiv?.email || report.customer?.email || "-" },
    { key: "dualNationality", label: "Dual Nationality", value: indiv?.dual_nationality ? "Yes" : "No" },
    { key: "adverseNews", label: "Adverse News", value: indiv?.adverse_news ? "Yes" : "No" },
    { key: "pep", label: "PEP", value: indiv?.is_pep ? "Yes" : "No" },
    { key: "occupation", label: "Occupation", value: indiv?.occupation || "-" },
    { key: "income", label: "Source of Income", value: indiv?.source_of_income || "-" },
    { key: "purpose", label: "Purpose of Onboarding", value: indiv?.purpose_of_onboarding || "-" },
    { key: "payment", label: "Payment Mode", value: indiv?.payment_mode || "-" },
    { key: "expectedNo", label: "Expected No. of Transactions", value: formatNumberValue(indiv?.expected_no_of_transactions) },
    { key: "expectedVolume", label: "Expected Volume", value: formatNumberValue(indiv?.expected_volume) },
    { key: "approach", label: "Mode of Approach", value: indiv?.mode_of_approach || "-" },
  ]

  const individualIdentificationFields: DetailFieldItem[] = [
    { key: "idType", label: "ID Type", value: indiv?.id_type || "-" },
    { key: "idNo", label: "ID Number", value: indiv?.id_no || "-" },
    { key: "issuingAuthority", label: "Issuing Authority", value: indiv?.issuing_authority || "-" },
    { key: "issuingCountry", label: "Issuing Country", value: indiv?.issuing_country || "-" },
    { key: "issueDate", label: "ID Issue Date", value: formatDate(indiv?.id_issue_date, indiv?.id_issue_date || "-") },
    { key: "expiryDate", label: "ID Expiry Date", value: formatDate(indiv?.id_expiry_date, indiv?.id_expiry_date || "-") },
  ]

  const corporateFields: DetailFieldItem[] = [
    { key: "companyName", label: "Company Name", value: corp?.company_name || "-" },
    { key: "entityType", label: "Entity Type", value: corp?.entity_type || "-" },
    { key: "customerType", label: "Customer Type", value: corp?.customer_type || "-" },
    { key: "businessActivity", label: "Business Activity", value: corp?.business_activity || "-" },
    { key: "companyAddress", label: "Company Address", value: corp?.company_address || "-" },
    { key: "poBox", label: "PO Box", value: corp?.po_box || "-" },
    { key: "city", label: "City", value: corp?.city || "-" },
    { key: "country", label: "Country of Incorporation", value: corp?.country_incorporated || "-" },
    { key: "email", label: "Email", value: corp?.email || report.customer?.email || "-" },
    {
      key: "officeNo",
      label: "Office Contact",
      value: corp?.office_no ? `${corp?.office_country_code || ""} ${corp?.office_no}`.trim() : "-",
    },
    {
      key: "mobileNo",
      label: "Mobile Contact",
      value: corp?.mobile_no ? `${corp?.mobile_country_code || ""} ${corp?.mobile_no}`.trim() : "-",
    },
    { key: "tradeLicenseNo", label: "Trade License No", value: corp?.trade_license_no || "-" },
    { key: "tradeLicenseAt", label: "Trade License Issued At", value: corp?.trade_license_issued_at || "-" },
    { key: "tradeLicenseBy", label: "Trade License Issued By", value: corp?.trade_license_issued_by || "-" },
    { key: "licenseIssueDate", label: "License Issue Date", value: formatDate(corp?.license_issue_date, corp?.license_issue_date || "-") },
    { key: "licenseExpiryDate", label: "License Expiry Date", value: formatDate(corp?.license_expiry_date, corp?.license_expiry_date || "-") },
    { key: "vat", label: "VAT Registration No", value: corp?.vat_registration_no || "-" },
    {
      key: "tenancyExpiry",
      label: "Tenancy Contract Expiry",
      value: formatDate(corp?.tenancy_contract_expiry_date, corp?.tenancy_contract_expiry_date || "-"),
    },
    { key: "bank", label: "Account Holding Bank Name", value: corp?.account_holding_bank_name || "-" },
    { key: "productSource", label: "Product Source", value: corp?.product_source || "-" },
    { key: "paymentMode", label: "Payment Mode", value: corp?.payment_mode || "-" },
    { key: "delivery", label: "Delivery Channel", value: corp?.delivery_channel || "-" },
    { key: "expectedNo", label: "Expected No. of Transactions", value: formatNumberValue(corp?.expected_no_of_transactions) },
    { key: "expectedVolume", label: "Expected Volume", value: formatNumberValue(corp?.expected_volume) },
    { key: "importExport", label: "Import/Export", value: corp?.is_entity_dealting_with_import_export ? "Yes" : "No" },
    { key: "sisterConcern", label: "Has Sister Concern", value: corp?.has_sister_concern ? "Yes" : "No" },
    { key: "dualUse", label: "Dual Use Goods", value: corp?.dual_use_goods ? "Yes" : "No" },
    {
      key: "kycDocs",
      label: "KYC Documents Collected With Form",
      value: corp?.kyc_documents_collected_with_form ? "Yes" : "No",
    },
    {
      key: "registeredGoaml",
      label: "Registered in GOAML",
      value: corp?.is_entity_registered_in_GOAML ? "Yes" : "No",
    },
    {
      key: "adverseNews",
      label: "Adverse News",
      value: corp?.is_entity_having_adverse_news ? "Yes" : "No",
    },
  ]

  const reportFields: DetailFieldItem[] = [
    { key: "entityReference", label: "Entity Reference", value: report.entity_reference || "-" },
    { key: "transactionType", label: "Transaction Type", value: report.transaction_type || "-" },
    { key: "comments", label: "Comments", value: report.comments || "-" },
    { key: "itemType", label: "Item Type", value: report.item_type || "-" },
    { key: "itemMake", label: "Item Make", value: report.item_make || "-" },
    { key: "description", label: "Description", value: report.description || "-", fullWidth: true },
    { key: "disposedValue", label: "Disposed Value", value: report.disposed_value || "-" },
    { key: "statusComments", label: "Status Comments", value: report.status_comments || "-" },
    { key: "estimatedValue", label: "Estimated Value", value: report.estimated_value || "-" },
    { key: "currencyCode", label: "Currency Code", value: report.currency_code || "-" },
  ]

  return (
    <div className={PAGE_CLASS}>
      <Button
        variant="ghost"
        onClick={handleBack}
        className="w-fit gap-2 rounded-xl px-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </Button>

      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">GOAML Report Details</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Report ID #{report.id}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <Button variant="outline" className="h-10 w-full rounded-xl sm:w-auto" onClick={onGenerateXml} disabled={xmlBusy}>
                <Download className="h-4 w-4" />
                {xmlBusy ? "Generating..." : "Generate XML"}
              </Button>
              {normalizedRole !== "analyst" && (
                <Button asChild className="h-10 w-full rounded-xl sm:w-auto">
                  <Link href={`/dashboard/goaml-reporting/edit/${id}`}>
                    <PencilLine className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
              <p className={SECONDARY_LABEL_CLASS}>Created</p>
              <p className="mt-1 text-sm font-semibold">{formatDate(report.created_at, "-")}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
              <p className={SECONDARY_LABEL_CLASS}>Customer Type</p>
              <p className="mt-1 text-sm font-semibold capitalize">{customerType || "-"}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
              <p className={SECONDARY_LABEL_CLASS}>Currency</p>
              <p className="mt-1 text-sm font-semibold">{report.currency_code || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <section>
            <p className={SECONDARY_LABEL_CLASS}>Customer Information</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {customerFields.map((field) => (
                <DetailField key={field.key} label={field.label} value={field.value} fullWidth={field.fullWidth} />
              ))}
            </div>
          </section>

          <section className="border-t border-border/60 pt-6">
            <p className={SECONDARY_LABEL_CLASS}>Products</p>
            {products.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product: any) => (
                  <div key={product.id || product.sku || product.name} className="rounded-2xl border border-border/60 bg-background/80 p-3">
                    <p className="text-sm font-semibold">{product?.name || "-"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">SKU: {product?.sku || "-"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No products found.</p>
            )}
          </section>

          {isIndividual && (
            <section className="border-t border-border/60 pt-6">
              <p className={SECONDARY_LABEL_CLASS}>Personal Information (Tenant Details)</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {individualPersonalFields.map((field) => (
                  <DetailField key={field.key} label={field.label} value={field.value} fullWidth={field.fullWidth} />
                ))}
              </div>
            </section>
          )}

          {isIndividual && (
            <section className="border-t border-border/60 pt-6">
              <p className={SECONDARY_LABEL_CLASS}>Identification Details</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {individualIdentificationFields.map((field) => (
                  <DetailField key={field.key} label={field.label} value={field.value} />
                ))}
              </div>
            </section>
          )}

          {isCorporate && (
            <section className="border-t border-border/60 pt-6">
              <p className={SECONDARY_LABEL_CLASS}>Company Information</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {corporateFields.map((field) => (
                  <DetailField key={field.key} label={field.label} value={field.value} />
                ))}
              </div>
            </section>
          )}

          <section className="border-t border-border/60 pt-6">
            <p className={SECONDARY_LABEL_CLASS}>Report Details</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {reportFields.map((field) => (
                <DetailField key={field.key} label={field.label} value={field.value} fullWidth={field.fullWidth} />
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
