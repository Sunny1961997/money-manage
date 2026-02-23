"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RequiredLabel } from "@/components/ui/required-label"
import { Combobox } from "@/components/ui/combobox"
import { Building2, ArrowLeft, Loader2, UserRound } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const FIELD_LABEL_CLASS = "block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_GROUP_CLASS = "space-y-2"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"

export default function AddCompanyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [phone, setPhone] = useState("")

  const [companyName, setCompanyName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [totalScreenings, setTotalScreenings] = useState("")
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState("")
  const [dob, setDob] = useState("")
  const [passportNumber, setPassportNumber] = useState("")
  const [passportCountry, setPassportCountry] = useState("")
  const [nationality, setNationality] = useState("")
  const [contactType, setContactType] = useState("")
  const [communicationType, setCommunicationType] = useState("")
  const [role, setRole] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/onboarding/meta", { credentials: "include" })
        const json = await res.json()
        const countryList = json.data.countries.countries.map((c: any) => ({
          value: c.name,
          label: c.name,
        }))
        setCountries(countryList)
      } catch (e) {
        console.error("Failed to fetch countries:", e)
      }
    }
    fetchCountries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name,
      email,
      company_email: companyEmail,
      password,
      password_confirmation: passwordConfirmation,
      phone,
      company_name: companyName,
      expiration_date: expirationDate,
      total_screenings: parseInt(totalScreenings, 10),
      trade_license_number: tradeLicenseNumber,
      dob,
      passport_number: passportNumber,
      passport_country: passportCountry,
      nationality,
      contact_type: contactType,
      communication_type: communicationType,
      phone_number: phoneNumber,
      address,
      city,
      state,
      country,
      role,
    }

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Company created successfully",
        })
        router.push("/dashboard/admin/companies")
      } else {
        const details = data?.errors
          ? Object.values(data.errors as Record<string, string[]>)
            .flat()
            .join("; ")
          : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({
          title: "Failed to create company",
          description: errText,
        })
      }
    } catch (err: any) {
      toast({
        title: "Failed to create company",
        description: err?.message || "Network error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const contactTypes = [
    { value: "OFFIC", label: "Office" },
    { value: "HOME", label: "Home" },
    { value: "MOBIL", label: "Mobile" },
  ]

  const communicationTypes = [
    { value: "Mail", label: "Mail" },
    { value: "Email", label: "Email" },
    { value: "Phone", label: "Phone" },
  ]
  const roles = [
    { value: "Company Admin", label: "Company Admin" },
    { value: "MLRO", label: "MLRO" },
    { value: "Analyst", label: "Analyst" },
  ]

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-border/70 bg-background/90"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Add New Company</h1>
              <p className="mt-1 text-sm text-muted-foreground">Create a company profile and assign the initial admin user.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className={CARD_STYLE}>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserRound className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">User Information</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Name" className={FIELD_LABEL_CLASS} />
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Email" className={FIELD_LABEL_CLASS} />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Password" className={FIELD_LABEL_CLASS} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 8 characters)"
                  className={FIELD_CLASS}
                  required
                />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Confirm Password" className={FIELD_LABEL_CLASS} />
                <Input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Confirm password"
                  className={FIELD_CLASS}
                  required
                />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <Label className={FIELD_LABEL_CLASS}>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className={FIELD_CLASS} />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Role" className={FIELD_LABEL_CLASS} />
                <Combobox
                  options={roles}
                  value={role}
                  onValueChange={(v) => typeof v === "string" && setRole(v)}
                  placeholder="Select role"
                  searchPlaceholder="Search role..."
                  className={FIELD_CLASS}
                  matchTriggerWidth
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={CARD_STYLE}>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 border-b border-border/50 pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Company Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Company Name" className={FIELD_LABEL_CLASS} />
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Trade License Number" className={FIELD_LABEL_CLASS} />
                <Input
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  placeholder="Enter trade license number"
                  className={FIELD_CLASS}
                  required
                />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Expiration Date" className={FIELD_LABEL_CLASS} />
                <Input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Total Screenings" className={FIELD_LABEL_CLASS} />
                <Input
                  type="number"
                  value={totalScreenings}
                  onChange={(e) => setTotalScreenings(e.target.value)}
                  placeholder="Enter total screenings"
                  className={FIELD_CLASS}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={CARD_STYLE}>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 border-b border-border/50 pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Date of Birth" className={FIELD_LABEL_CLASS} />
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Passport Number" className={FIELD_LABEL_CLASS} />
                <Input value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} placeholder="Enter passport number" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Passport Country" className={FIELD_LABEL_CLASS} />
                <Combobox
                  options={countries}
                  value={passportCountry}
                  onValueChange={(v) => typeof v === "string" && setPassportCountry(v)}
                  placeholder="Select passport country"
                  searchPlaceholder="Search country..."
                  className={FIELD_CLASS}
                  matchTriggerWidth
                />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Nationality" className={FIELD_LABEL_CLASS} />
                <Combobox
                  options={countries}
                  value={nationality}
                  onValueChange={(v) => typeof v === "string" && setNationality(v)}
                  placeholder="Select nationality"
                  searchPlaceholder="Search nationality..."
                  className={FIELD_CLASS}
                  matchTriggerWidth
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={CARD_STYLE}>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 border-b border-border/50 pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Phone Number" className={FIELD_LABEL_CLASS} />
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Contact Type" className={FIELD_LABEL_CLASS} />
                <Combobox
                  options={contactTypes}
                  value={contactType}
                  onValueChange={(v) => typeof v === "string" && setContactType(v)}
                  placeholder="Select contact type"
                  searchPlaceholder="Search contact type..."
                  className={FIELD_CLASS}
                  matchTriggerWidth
                />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Communication Type" className={FIELD_LABEL_CLASS} />
                <Combobox
                  options={communicationTypes}
                  value={communicationType}
                  onValueChange={(v) => typeof v === "string" && setCommunicationType(v)}
                  placeholder="Select communication type"
                  searchPlaceholder="Search communication type..."
                  className={FIELD_CLASS}
                  matchTriggerWidth
                />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Company Email" className={FIELD_LABEL_CLASS} />
                <Input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="Enter company email" className={FIELD_CLASS} required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={CARD_STYLE}>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 border-b border-border/50 pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Address Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={`${FIELD_GROUP_CLASS} md:col-span-2`}>
                <RequiredLabel text="Address" className={FIELD_LABEL_CLASS} />
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="City" className={FIELD_LABEL_CLASS} />
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="State" className={FIELD_LABEL_CLASS} />
                <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="Enter state" className={FIELD_CLASS} required />
              </div>
              <div className={FIELD_GROUP_CLASS}>
                <RequiredLabel text="Country" className={FIELD_LABEL_CLASS} />
                <Combobox
                  options={countries}
                  value={country}
                  onValueChange={(v) => typeof v === "string" && setCountry(v)}
                  placeholder="Select country"
                  searchPlaceholder="Search country..."
                  className={FIELD_CLASS}
                  matchTriggerWidth
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-0 z-10 border-t border-border/60 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="h-10 rounded-xl px-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Company"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
