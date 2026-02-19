"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

export default function CreateGoamlReportPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerType, setCustomerType] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [isCustomerLoading, setIsCustomerLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<ReportFormData>(INITIAL_FORM_DATA)

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
    async function fetchCustomers() {
      if (!customerType) {
        setCustomers([])
        return
      }

      try {
        const res = await fetch(`/api/onboarding/short-data-customers?customer_type=${customerType}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await res.json()
        if (json?.status) {
          setCustomers(json.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch customers", error)
      }
    }
    void fetchCustomers()
  }, [customerType])

  const handleBackToReports = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/dashboard/goaml-reporting")
  }

  const handleCustomerSelection = async (customerId: string) => {
    if (!customerId) {
      setSelectedCustomer(null)
      setSelectedCustomerId("")
      setIsCustomerLoading(false)
      return
    }

    setSelectedCustomerId(customerId)
    setSelectedCustomer(null)
    setIsCustomerLoading(true)

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
          customerData.id = Number.parseInt(customerId, 10)
        }
        setSelectedCustomer(customerData)
      }
    } catch (error) {
      console.error("Failed to fetch customer details", error)
    } finally {
      setIsCustomerLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedCustomer?.id) {
      toast({
        title: "Required fields missing",
        description: "Please select a customer.",
      })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        customer_id: Number(selectedCustomer.id),
        ...formData,
      }

      const res = await fetch("/api/goaml/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json?.status) {
        router.refresh()
        router.push("/dashboard/goaml-reporting?created=1")
        return
      }

      const fallbackTitle = "Failed to create report"
      const fallbackDescription = "Please try again."
      let title = fallbackTitle
      let description = fallbackDescription

      if (typeof json?.error === "string") {
        try {
          const errorDetails = JSON.parse(json.error)
          title = errorDetails?.message || fallbackTitle
          description = errorDetails?.error || fallbackDescription
        } catch {
          description = json.error
        }
      } else if (json?.error && typeof json.error === "object") {
        title = json.error.message || fallbackTitle
        description = json.error.error || fallbackDescription
      } else if (json?.message) {
        description = json.message
      }

      toast({ title, description })
    } catch (error) {
      console.error("Failed to submit report", error)
      toast({
        title: "Error",
        description: "An error occurred while submitting the report.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const currencyOptions = countries
    .filter((country) => country.currency)
    .map((country) => ({ value: country.currency, label: country.currency }))
    .filter((option, index, arr) => arr.findIndex((item) => item.value === option.value) === index)
  const customerOptions = customers.map((customer) => ({
    value: String(customer.id),
    label: customer.name,
  }))

  return (
    <div className={PAGE_CLASS}>
      <Button
        variant="ghost"
        onClick={handleBackToReports}
        className="w-fit gap-2 rounded-xl px-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
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
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create GOAML Report</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a customer, fill transaction details, and create a new report entry.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={CARD_STYLE}>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <section>
            <p className={SECONDARY_LABEL_CLASS}>Customer Selection</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={FIELD_LABEL_CLASS}>Customer Type</label>
                <select
                  className={FIELD_CLASS}
                  value={customerType}
                  onChange={(e) => {
                    const value = e.target.value
                    setCustomerType(value)
                    setSelectedCustomerId("")
                    setSelectedCustomer(null)
                    setIsCustomerLoading(false)
                  }}
                >
                  <option value="">Select customer type</option>
                  <option value="individual">Individual</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className={FIELD_LABEL_CLASS}>Pick Customer</label>
                <Combobox
                  options={customerOptions}
                  value={selectedCustomerId}
                  onValueChange={(value) => typeof value === "string" && void handleCustomerSelection(value)}
                  disabled={!customerType}
                  placeholder={customerType ? "Select customer" : "Select customer type first"}
                  searchPlaceholder="Search customer..."
                  emptyText="No customers found."
                  matchTriggerWidth
                  className={FIELD_CLASS}
                  contentClassName="p-0"
                />
                {!customerType && (
                  <p className="mt-1 text-xs text-amber-700/90 dark:text-amber-300">Select customer type to enable customer search.</p>
                )}
              </div>
            </div>
          </section>

          {isCustomerLoading ? (
            <section className="border-t border-border/60 pt-6">
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <div className="absolute h-10 w-10 rounded-full bg-primary/20 blur-lg animate-pulse" aria-hidden="true" />
                  <Loader2 className="relative z-10 h-6 w-6 animate-spin text-primary" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">Loading customer details...</p>
              </div>
            </section>
          ) : selectedCustomer ? (
            <>
              {selectedCustomer?.corporate_detail?.customer_id && (
                <section className="border-t border-border/60 pt-6">
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
                        {`${selectedCustomer.corporate_detail?.office_country_code || ""}${selectedCustomer.corporate_detail?.office_no || ""}`.trim() || "-"}
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
                <section className="border-t border-border/60 pt-6">
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

              <section className="border-t border-border/60 pt-6">
                <p className={SECONDARY_LABEL_CLASS}>Report Entry</p>
                <div className="mt-4 space-y-4">
                  <p className={SECONDARY_LABEL_CLASS}>GOAML Report Details</p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={FIELD_LABEL_CLASS}>
                        Entity Reference <span className="text-destructive">*</span>
                      </label>
                      <input
                        className={FIELD_CLASS}
                        value={formData.entity_reference}
                        onChange={(e) => setFormData({ ...formData, entity_reference: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={FIELD_LABEL_CLASS}>
                        Transaction Type <span className="text-destructive">*</span>
                      </label>
                      <select
                        className={FIELD_CLASS}
                        value={formData.transaction_type}
                        onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                      >
                        <option value="">Select a transaction type</option>
                        <option value="sale">Sale</option>
                        <option value="purchase">Purchase</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={FIELD_LABEL_CLASS}>Comments</label>
                    <input className={FIELD_CLASS} value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
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

                  <div>
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

                  <div className="grid gap-4 md:grid-cols-2">
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
                      <input
                        className={FIELD_CLASS}
                        value={formData.status_comments}
                        onChange={(e) => setFormData({ ...formData, status_comments: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
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

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button className="h-10 w-full rounded-xl px-5 sm:w-auto" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button variant="outline" className="h-10 w-full rounded-xl sm:w-auto" onClick={handleBackToReports} disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="border-t border-border/60 pt-6">
              <p className="text-sm text-muted-foreground">Select a customer to view details and continue with report entry.</p>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
