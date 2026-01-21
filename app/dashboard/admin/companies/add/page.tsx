"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { Building2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AddCompanyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([])

  // User fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [phone, setPhone] = useState("")

  // Company fields
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
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")

  useEffect(() => {
    async function fetchCountries() {
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
      password,
      password_confirmation: passwordConfirmation,
      phone,
      company_name: companyName,
      expiration_date: expirationDate,
      total_screenings: parseInt(totalScreenings),
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
        //   variant: "destructive",
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
    { value: "M", label: "Mail" },
    { value: "E", label: "Email" },
    { value: "P", label: "Phone" },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Add New Company</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium">User Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 8 characters)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Trade License Number *</Label>
                <Input
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  placeholder="Enter trade license number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date *</Label>
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Total Screenings *</Label>
                <Input
                  type="number"
                  value={totalScreenings}
                  onChange={(e) => setTotalScreenings(e.target.value)}
                  placeholder="Enter total screenings"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Passport Number *</Label>
                <Input
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="Enter passport number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Passport Country *</Label>
                <Combobox
                  options={countries}
                  value={passportCountry}
                  onValueChange={(v) => typeof v === "string" && setPassportCountry(v)}
                  placeholder="Select passport country"
                  searchPlaceholder="Search country..."
                />
              </div>
              <div className="space-y-2">
                <Label>Nationality *</Label>
                <Combobox
                  options={countries}
                  value={nationality}
                  onValueChange={(v) => typeof v === "string" && setNationality(v)}
                  placeholder="Select nationality"
                  searchPlaceholder="Search nationality..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Type *</Label>
                <Combobox
                  options={contactTypes}
                  value={contactType}
                  onValueChange={(v) => typeof v === "string" && setContactType(v)}
                  placeholder="Select contact type"
                  searchPlaceholder="Search contact type..."
                />
              </div>
              <div className="space-y-2">
                <Label>Communication Type *</Label>
                <Combobox
                  options={communicationTypes}
                  value={communicationType}
                  onValueChange={(v) => typeof v === "string" && setCommunicationType(v)}
                  placeholder="Select communication type"
                  searchPlaceholder="Search communication type..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Address *</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Combobox
                  options={countries}
                  value={country}
                  onValueChange={(v) => typeof v === "string" && setCountry(v)}
                  placeholder="Select country"
                  searchPlaceholder="Search country..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Creating..." : "Create Company"}
          </Button>
        </div>
      </form>
    </div>
  )
}
