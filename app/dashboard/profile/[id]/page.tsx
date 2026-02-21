"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Building2, Globe, Loader2, Mail } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { RequiredLabel } from "@/components/ui/required-label"
import { useToast } from "@/components/ui/use-toast"

type Country = {
  id: number
  name: string
  sortname?: string
  phoneCode?: string
  currency?: string
}

type ComboboxOption = {
  value: string
  label: string
}

type CompanyForm = {
  name: string
  email: string
  expiration_date: string
  total_screenings: string
  trade_license_number: string
  passport_number: string
  passport_country: string
  nationality: string
  contact_type: string
  phone_number: string
  communication_type: string
  address: string
  city: string
  state: string
  country: string
}

const EMPTY_FORM: CompanyForm = {
  name: "",
  email: "",
  expiration_date: "",
  total_screenings: "",
  trade_license_number: "",
  passport_number: "",
  passport_country: "",
  nationality: "",
  contact_type: "",
  phone_number: "",
  communication_type: "",
  address: "",
  city: "",
  state: "",
  country: "",
}

const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all hover:shadow-[0_28px_70px_-34px_oklch(0.28_0.06_260/0.6)]"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"
const SECTION_STYLE = "rounded-2xl border border-border/60 bg-background/70 p-5 sm:p-6"
const INPUT_CLASS =
  "h-11 rounded-xl border-border/70 bg-background/90 transition-colors focus-visible:outline-none focus-visible:border-primary/80 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
const COMBOBOX_CLASS =
  "h-11 rounded-xl border-border/70 bg-background/90 transition-colors focus-visible:outline-none focus-visible:border-primary/80 focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
const REQUIRED_FIELDS: Array<{ key: keyof CompanyForm; label: string }> = [
  { key: "name", label: "Company Name" },
  { key: "email", label: "Company Email" },
  { key: "expiration_date", label: "Expiration Date" },
  { key: "total_screenings", label: "Total Screenings" },
  { key: "trade_license_number", label: "Trade License Number" },
  { key: "passport_number", label: "Passport Number" },
  { key: "passport_country", label: "Passport Country" },
  { key: "nationality", label: "Nationality" },
  { key: "contact_type", label: "Contact Type" },
  { key: "communication_type", label: "Communication Type" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
]

function toMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === "string" ? error : "Unknown error"
}

export default function EditCompanyPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const companyId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(false)

  useEffect(() => {
    if (!companyId) return

    let cancelled = false

    async function loadPageData() {
      try {
        setLoading(true)
        setError(null)
        setCountriesLoading(true)

        const [profileRes, countriesRes] = await Promise.all([
          fetch(`/api/profile/${companyId}`, { credentials: "include" }),
          fetch("/api/countries", { method: "GET", credentials: "include" }),
        ])

        const profileJson = await profileRes.json()
        const countriesJson = await countriesRes.json().catch(async () => ({ message: await countriesRes.text() }))

        if (cancelled) return

        if (profileJson.status && profileJson.data) {
          setForm({
            ...EMPTY_FORM,
            ...profileJson.data,
            total_screenings: String(profileJson.data.total_screenings ?? ""),
          })
        } else {
          setError(profileJson.message || "Failed to load company info")
        }

        if (!countriesRes.ok) {
          throw new Error(countriesJson?.message || "Failed to fetch countries")
        }

        const list: Country[] = countriesJson?.data?.countries || []
        setCountries(list)
      } catch (loadError) {
        if (!cancelled) {
          const message = toMessage(loadError)
          setError((current) => current || message)
          toast({ title: "Load failed", description: message })
        }
      } finally {
        if (!cancelled) {
          setCountriesLoading(false)
          setLoading(false)
        }
      }
    }

    loadPageData()

    return () => {
      cancelled = true
    }
  }, [companyId, toast])

  const countryOptions: ComboboxOption[] = useMemo(
    () => countries.map((country) => ({ value: country.name, label: country.name })),
    [countries]
  )

  const communicationTypes = [
    { value: "Mail", label: "Mail" },
    { value: "Email", label: "Email" },
    { value: "Phone", label: "Phone" },
  ]

  const contactTypes = [
    { value: "OFFIC", label: "Office" },
    { value: "HOME", label: "Home" },
    { value: "MOBIL", label: "Mobile" },
  ]

  const formattedExpiry = useMemo(() => {
    if (!form.expiration_date) return "Not set"
    const [year, month, day] = form.expiration_date.split("-")
    if (!year || !month || !day) return form.expiration_date

    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return Number.isNaN(date.getTime())
      ? form.expiration_date
      : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  }, [form.expiration_date])

  const screeningCount = Number(form.total_screenings || 0)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const setField = (name: keyof CompanyForm, value: string) => {
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    const missingField = REQUIRED_FIELDS.find(({ key }) => String(form[key] || "").trim() === "")
    if (missingField) {
      toast({
        title: "Validation Error",
        description: `${missingField.label} is required.`,
      })
      setSaving(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email || "")) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address with a domain (e.g., user@example.com).",
      })
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/profile/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          total_screenings: Number(form.total_screenings || 0),
        }),
      })

      const json = await response.json()
      if (json.status) {
        toast({ title: "Company updated", description: "Company information has been updated successfully." })
        router.push("/dashboard/profile")
      } else {
        toast({ title: "Update failed", description: json.message || "Failed to update company info" })
      }
    } catch {
      toast({ title: "Update failed", description: "Failed to update company info" })
    } finally {
      setSaving(false)
    }
  }

  const CountrySelect = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string
    onChange: (nextValue: string) => void
    placeholder: string
  }) => (
    <Combobox
      options={countryOptions}
      value={value}
      onValueChange={(selected) => typeof selected === "string" && onChange(selected)}
      placeholder={countriesLoading ? "Loading..." : placeholder}
      searchPlaceholder="Search country..."
      className={COMBOBOX_CLASS}
    />
  )

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className={CARD_STYLE}>
          <CardContent className="py-10 text-center text-red-600">{error}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/10 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="outline" size="icon" className="rounded-xl border-border/70 bg-background/90" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <p className={SECONDARY_LABEL_CLASS}>Compliance Dashboard</p>
              <h1 className="text-2xl font-semibold tracking-tight">Edit Company Information</h1>
              <p className="mt-1 text-sm text-muted-foreground">Refine company details with a complete compliance-ready profile.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <Building2 className="w-3.5 h-3.5" />
              Company ID: {companyId}
            </div>
          </div>
        </div>
        <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/85 p-4">
            <p className="text-sm font-semibold break-words">{form.name || "Untitled Company"}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/85 p-4">
            <p className={SECONDARY_LABEL_CLASS}>Expiry</p>
            <p className="mt-1 text-sm font-semibold">{formattedExpiry}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/85 p-4">
            <p className={SECONDARY_LABEL_CLASS}>Screening Capacity</p>
            <p className="mt-1 text-sm font-semibold">{screeningCount > 0 ? screeningCount : "Not set"}</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <Card className={`${CARD_STYLE} gap-3 overflow-hidden border-border/60 bg-gradient-to-b from-card to-card/80`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Edit Company Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 pb-6 pt-0">
            <section className={SECTION_STYLE}>
              <div className="mb-4 flex items-start gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">01</span>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">Company Core Details</h2>
                  <p className="text-xs text-muted-foreground">Core legal and operational company information.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <RequiredLabel text="Company Name" />
                  <Input className={INPUT_CLASS} name="name" type="text" value={form.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Company Email" />
                  <Input className={INPUT_CLASS} name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Expiration Date" />
                  <Input className={INPUT_CLASS} name="expiration_date" type="date" value={form.expiration_date} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Total Screenings" />
                  <Input className={INPUT_CLASS} name="total_screenings" type="number" value={form.total_screenings} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Trade License Number" />
                  <Input className={INPUT_CLASS} name="trade_license_number" value={form.trade_license_number} onChange={handleChange} required />
                </div>
              </div>
            </section>

            <section className={SECTION_STYLE}>
              <div className="mb-4 flex items-start gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">02</span>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">Identity And Contact Preferences</h2>
                  <p className="text-xs text-muted-foreground">Identity records and preferred communication channels.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <RequiredLabel text="Passport Number" />
                  <Input className={INPUT_CLASS} name="passport_number" value={form.passport_number} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Passport Country" />
                  <CountrySelect value={form.passport_country} onChange={(value) => setField("passport_country", value)} placeholder="Select passport country" />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Nationality" />
                  <CountrySelect value={form.nationality} onChange={(value) => setField("nationality", value)} placeholder="Select nationality" />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Contact Type" />
                  <Combobox
                    className={COMBOBOX_CLASS}
                    options={contactTypes}
                    value={form.contact_type}
                    onValueChange={(value) => typeof value === "string" && setField("contact_type", value)}
                    placeholder="Select contact type"
                    searchPlaceholder="Search contact type..."
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Communication Type" />
                  <Combobox
                    className={COMBOBOX_CLASS}
                    options={communicationTypes}
                    value={form.communication_type}
                    onValueChange={(value) => typeof value === "string" && setField("communication_type", value)}
                    placeholder="Select communication type"
                    searchPlaceholder="Search communication type..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input className={INPUT_CLASS} name="phone_number" value={form.phone_number} onChange={handleChange} />
                </div>
              </div>
            </section>

            <section className={SECTION_STYLE}>
              <div className="mb-4 flex items-start gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">03</span>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">Address Information</h2>
                  <p className="text-xs text-muted-foreground">Registered geographic and mailing location details.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <RequiredLabel text="Address" />
                  <Input className={INPUT_CLASS} name="address" value={form.address} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="City" />
                  <Input className={INPUT_CLASS} name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="State" />
                  <Input className={INPUT_CLASS} name="state" value={form.state} onChange={handleChange} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <RequiredLabel text="Country" />
                  <CountrySelect value={form.country} onChange={(value) => setField("country", value)} placeholder="Select country" />
                </div>
              </div>
            </section>
          </CardContent>

          <CardFooter className="border-t border-border/60 bg-background/70 pb-6 pt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-zinc-300 !bg-white text-zinc-700 hover:border-zinc-400 hover:!bg-zinc-100 hover:text-zinc-900 active:!bg-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-zinc-600 dark:!bg-zinc-900 dark:text-zinc-100 dark:hover:!bg-zinc-800 dark:active:!bg-zinc-700"
              onClick={() => router.push("/dashboard/profile")}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 rounded-xl px-5" disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Update Information
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
