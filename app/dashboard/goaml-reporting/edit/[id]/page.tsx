"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FilePenLine, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Combobox } from "@/components/ui/combobox"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Customer {
  id: number
  name: string
  customer_type: string
  contact_office_number?: string
  company_address?: string
  individual_detail?: {
    id: number
    customer_id: number
    first_name: string
    last_name: string
  }
  corporate_detail?: {
    id: number
    customer_id: number
    company_name: string
    trade_license_no: string
    company_address: string
    office_country_code: string
    office_no: string
  }
}

interface Country {
  id: number
  name: string
  currency: string
}

type ReportFormData = {
  entity_reference: string
  transaction_type: string
  comments: string
  item_type: string
  item_make: string
  description: string
  disposed_value: string
  status_comments: string
  estimated_value: string
  currency_code: string
}

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-xs font-extrabold uppercase tracking-[0.14em] text-foreground"
const FIELD_LABEL_CLASS = "mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"
const READONLY_FIELD_CLASS =
  "rounded-xl border border-border/80 bg-muted/60 px-3 py-2 text-sm text-foreground/80 cursor-not-allowed select-none"

const INITIAL_FORM_DATA: ReportFormData = {
  entity_reference: "",
  transaction_type: "",
  comments: "",
  item_type: "",
  item_make: "",
  description: "",
  disposed_value: "",
  status_comments: "",
  estimated_value: "",
  currency_code: "",
}

export default function EditGoamlReportPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [existingCustomerId, setExistingCustomerId] = useState("")
  const [formData, setFormData] = useState<ReportFormData>(INITIAL_FORM_DATA)

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push(id ? `/dashboard/goaml-reporting/${id}` : "/dashboard/goaml-reporting")
  }

  const fetchCustomerDetails = async (customerId: number) => {
    try {
      const res = await fetch(`/api/onboarding/customers/${customerId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const json = await res.json()
      if (json?.status) {
        const customerData = json.data
        if (!customerData.id) {
          customerData.id = customerId
        }
        setSelectedCustomer(customerData)
      }
    } catch (error) {
      console.error("Failed to fetch customer details", error)
    }
  }

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await fetch("/api/goaml/meta", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await res.json()
        if (json?.status) {
          setCountries(json.data?.countries?.countries || [])
        }
      } catch (error) {
        console.error("Failed to fetch metadata", error)
      }
    }

    void fetchMetadata()
  }, [])

  useEffect(() => {
    if (!id) return

    async function fetchReport() {
      try {
        const res = await fetch(`/api/goaml/reports/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await res.json()

        if (json?.status) {
          const report = json.data.report
          const normalizedTransactionType = String(report.transaction_type || "").trim()
          const linkedCustomerId = report.customer_id?.toString() || ""

          setExistingCustomerId(linkedCustomerId)
          setFormData({
            entity_reference: report.entity_reference || "",
            transaction_type: /^(sale|purchase)$/i.test(normalizedTransactionType)
              ? normalizedTransactionType.toLowerCase()
              : normalizedTransactionType,
            comments: report.comments || "",
            item_type: report.item_type || "",
            item_make: report.item_make || "",
            description: report.description || "",
            disposed_value: report.disposed_value || "",
            status_comments: report.status_comments || "",
            estimated_value: report.estimated_value || "",
            currency_code: report.currency_code || "",
          })

          setSelectedCustomer(null)
          if (linkedCustomerId) {
            await fetchCustomerDetails(Number.parseInt(linkedCustomerId, 10))
          }
        } else {
          toast({
            title: "Error",
            description: json?.message || "Failed to load report",
          })
        }
      } catch (error) {
        console.error("Failed to fetch report", error)
        toast({
          title: "Error",
          description: "Failed to load report",
        })
      } finally {
        setLoading(false)
      }
    }

    void fetchReport()
  }, [id, toast])

  const handleSubmit = async () => {
    if (!existingCustomerId) {
      toast({
        title: "Missing customer",
        description: "This report has no linked customer to update.",
      })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        customer_id: Number(existingCustomerId),
        entity_reference: formData.entity_reference,
        transaction_type: formData.transaction_type,
        comments: formData.comments,
        item_type: formData.item_type,
        item_make: formData.item_make,
        description: formData.description,
        disposed_value: formData.disposed_value,
        status_comments: formData.status_comments,
        estimated_value: formData.estimated_value,
        currency_code: formData.currency_code,
      }

      const res = await fetch(`/api/goaml/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json?.status) {
        toast({
          title: "Success",
          description: json.message || "Report updated successfully",
        })
        router.push("/dashboard/goaml-reporting")
      } else {
        toast({
          title: "Error",
          description: json?.message || "Failed to update report",
        })
      }
    } catch (error) {
      console.error("Failed to update report", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the report",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const currencyOptions = countries
    .filter((country) => country.currency)
    .map((country) => ({ value: country.currency, label: country.currency }))
    .filter((option, index, arr) => arr.findIndex((item) => item.value === option.value) === index)

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
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <FilePenLine className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit GOAML Report</h1>
              <p className="mt-1 text-sm text-muted-foreground">Update this report and review its linked customer details.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <section>
            <p className={SECONDARY_LABEL_CLASS}>Report Context</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={FIELD_LABEL_CLASS}>Report ID</label>
                <div className={READONLY_FIELD_CLASS}>{id || "-"}</div>
              </div>
              <div>
                <label className={FIELD_LABEL_CLASS}>Linked Customer ID</label>
                <div className={READONLY_FIELD_CLASS}>{existingCustomerId || "-"}</div>
              </div>
            </div>
          </section>

          <section className="border-t border-border/60 pt-6">
            <p className={SECONDARY_LABEL_CLASS}>Linked Customer Details</p>

            {selectedCustomer ? (
              <div className="space-y-6">
                {selectedCustomer?.corporate_detail?.customer_id && (
                  <section>
                    <p className={SECONDARY_LABEL_CLASS}>Company Information</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={FIELD_LABEL_CLASS}>Company Name</label>
                        <div className={READONLY_FIELD_CLASS}>
                          {selectedCustomer.corporate_detail?.company_name || selectedCustomer.name || "-"}
                        </div>
                      </div>
                      <div>
                        <label className={FIELD_LABEL_CLASS}>Trade License Number</label>
                        <div className={READONLY_FIELD_CLASS}>
                          {selectedCustomer.corporate_detail?.trade_license_no || "-"}
                        </div>
                      </div>
                      <div>
                        <label className={FIELD_LABEL_CLASS}>Contact Office Number</label>
                        <div className={READONLY_FIELD_CLASS}>
                          {`${selectedCustomer.corporate_detail?.office_country_code || ""}${selectedCustomer.corporate_detail?.office_no || ""}`.trim() ||
                            "-"}
                        </div>
                      </div>
                      <div>
                        <label className={FIELD_LABEL_CLASS}>Company Address</label>
                        <div className={READONLY_FIELD_CLASS}>
                          {selectedCustomer.corporate_detail?.company_address || selectedCustomer.company_address || "-"}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {selectedCustomer?.individual_detail?.customer_id && (
                  <section>
                    <p className={SECONDARY_LABEL_CLASS}>Personal Information</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={FIELD_LABEL_CLASS}>First Name</label>
                        <div className={READONLY_FIELD_CLASS}>
                          {selectedCustomer.individual_detail.first_name}
                        </div>
                      </div>
                      <div>
                        <label className={FIELD_LABEL_CLASS}>Last Name</label>
                        <div className={READONLY_FIELD_CLASS}>
                          {selectedCustomer.individual_detail.last_name}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Customer details are unavailable for this report.</p>
            )}
          </section>

          <section className="border-t border-border/60 pt-6">
            <p className={SECONDARY_LABEL_CLASS}>GOAML Report Details</p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={FIELD_LABEL_CLASS}>
                  Entity Reference <span className="text-destructive">*</span>
                </label>
                <input className={FIELD_CLASS} value={formData.entity_reference} onChange={(e) => setFormData({ ...formData, entity_reference: e.target.value })} />
              </div>
              <div>
                <label className={FIELD_LABEL_CLASS}>
                  Transaction Type <span className="text-destructive">*</span>
                </label>
                <select className={FIELD_CLASS} value={formData.transaction_type} onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}>
                  <option value="">Select a transaction type</option>
                  <option value="sale">Sale</option>
                  <option value="purchase">Purchase</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={FIELD_LABEL_CLASS}>Comments</label>
              <input className={FIELD_CLASS} value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={FIELD_LABEL_CLASS}>
                  Item Make <span className="text-destructive">*</span>
                </label>
                <input className={FIELD_CLASS} value={formData.item_make} onChange={(e) => setFormData({ ...formData, item_make: e.target.value })} />
              </div>
              <div>
                <label className={FIELD_LABEL_CLASS}>
                  Item Type <span className="text-destructive">*</span>
                </label>
                <select className={FIELD_CLASS} value={formData.item_type} onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}>
                  <option value="">Select an item type</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Gemstones">Gemstones</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Grain / Cereals">Grain / Cereals</option>
                  <option value="Real estate / land dealing">Real estate / land dealing</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Property / Real estate">Property / Real estate</option>
                  <option value="Building / Real estate construction">Building / Real estate construction</option>
                  <option value="Watch">Watch</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={FIELD_LABEL_CLASS}>
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                className={TEXTAREA_CLASS}
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={FIELD_LABEL_CLASS}>
                  Disposed Value <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  className={FIELD_CLASS}
                  value={formData.disposed_value}
                  onChange={(e) => setFormData({ ...formData, disposed_value: e.target.value })}
                />
              </div>
              <div>
                <label className={FIELD_LABEL_CLASS}>Status Comments</label>
                <input className={FIELD_CLASS} value={formData.status_comments} onChange={(e) => setFormData({ ...formData, status_comments: e.target.value })} />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={FIELD_LABEL_CLASS}>
                  Estimated Value <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  className={FIELD_CLASS}
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                />
              </div>
              <div>
                <label className={FIELD_LABEL_CLASS}>
                  Currency Code <span className="text-destructive">*</span>
                </label>
                <Combobox
                  options={currencyOptions}
                  value={formData.currency_code}
                  onValueChange={(value) => typeof value === "string" && setFormData({ ...formData, currency_code: value })}
                  placeholder="Select currency code..."
                  searchPlaceholder="Search currency..."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button className="h-10 w-full rounded-xl px-5 sm:w-auto" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Updating..." : "Update Report"}
              </Button>
              <Button variant="outline" className="h-10 w-full rounded-xl sm:w-auto" onClick={handleBack} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
