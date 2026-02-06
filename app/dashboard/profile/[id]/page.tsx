"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { ArrowLeft, Building2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Country = { 
  id: number; name: 
  string; sortname?: string; 
  phoneCode?: string; 
  currency?: string 
}
type ComboboxOption = { value: string; label: string }
function toMessage(e: unknown) {
  if (e instanceof Error) return e.message
  return typeof e === "string" ? e : "Unknown error"
}
export default function EditCompanyPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const companyId = params?.id as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [countries, setCountries] = React.useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = React.useState(false)

  useEffect(() => {
    if (!companyId) return
    setLoading(true)
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/profile/${companyId}`, { credentials: "include" })
        const json = await res.json()
        if (json.status && json.data) setForm(json.data)
        else setError(json.message || "Failed to load company info")
      } catch {
        setError("Failed to load company info")
      } finally {
        setLoading(false)
      }
    }
    const fetchCountries = async () => {
      try{
        setCountriesLoading(true)
        const res = await fetch ("/api/countries", { method: "GET", credentials: "include" });
        const payload = await res.json().catch(async () => { message: await res.text() })
        if(!res.ok) throw Error(payload.message || "Failed to fetch countries")
        const list: Country[] = payload?.data?.countries || []
        setCountries(list)
      }
      catch(e:any){
        toast({ title: "Countries load failed", description: toMessage(e) })
      }
      finally {
        setCountriesLoading(false)
      }
    }
    fetchData()
    // fetchCountries()
  }, [companyId])

  // useEffect(() => {
  //   async function fetchCountries() {
  //     try {
  //       const res = await fetch("/api/countries", { credentials: "include" })
  //       const json = await res.json()
  //       console.log("Fetched countries:", json.data.countries)
  //       console.log("Fetched status:", json)
  //       if (Array.isArray(json)) {
  //         console.log("Fetched Entering:")
  //         setCountries(json.map((c: any) => ({ value: c.name, label: c.name })))
  //       }
  //     } catch (e) {
  //       toast({ title: "Countries load failed", description: toMessage(e) })
  //     }
  //   }
  //   fetchCountries()
  // }, [])
  React.useEffect(() => {
      let cancelled = false
      ;(async () => {
        setCountriesLoading(true)
        try {
          const res = await fetch("/api/countries", { method: "GET", credentials: "include" })
          const payload = await res.json().catch(async () => ({ message: await res.text() }))
          if (!res.ok) throw new Error(payload?.message || "Failed to load countries")
  
          const list: Country[] = payload?.data?.countries || []
          if (!cancelled) setCountries(list)
        } catch (e) {
          toast({ title: "Countries load failed", description: toMessage(e)})
        } finally {
          if (!cancelled) setCountriesLoading(false)
        }
      })()
      return () => {
        cancelled = true
      }
    }, [toast])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/profile/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      })
      const json = await res.json()
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

  const countryOptions: ComboboxOption[] = React.useMemo(
    () => countries.map((c) => ({ value: c.name, label: c.name })),
    [countries]
  )
  console.log("countryOptions", countryOptions)
  const CountrySelect = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string
    onChange: (v: string) => void
    placeholder: string
  }) => (
    <Combobox
      options={countryOptions}
      value={value}
      onValueChange={(v) => typeof v === "string" && onChange(v)}
      placeholder={countriesLoading ? "Loading..." : placeholder}
      searchPlaceholder="Search country..."
    />
  )

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Edit Company</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input name="name" type="text" value={form.name || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Company Email *</Label>
                <Input name="email" type="email" value={form.email || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date *</Label>
                <Input name="expiration_date" type="date" value={form.expiration_date || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Total Screenings *</Label>
                <Input name="total_screenings" type="number" value={form.total_screenings || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Trade License Number *</Label>
                <Input name="trade_license_number" value={form.trade_license_number || ""} onChange={handleChange} required />
              </div>
              {/* <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input name="dob" type="date" value={form.dob || ""} onChange={handleChange} required />
              </div> */}
              <div className="space-y-2">
                <Label>Passport Number *</Label>
                <Input name="passport_number" value={form.passport_number || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Passport Country *</Label>
                <CountrySelect  value={form.passport_country || ""} onChange={v => setForm((f: any) => ({ ...f, passport_country: v }))} placeholder="Select passport country" />
              </div>
              <div className="space-y-2">
                <Label>Nationality *</Label>
                <CountrySelect value={form.nationality || ""} onChange={v => setForm((f: any) => ({ ...f, nationality: v }))} placeholder="Select nationality" />
              </div>
              <div className="space-y-2">
                <Label>Contact Type *</Label>
                <Combobox
                  options={contactTypes}
                  value={form.contact_type || ""}
                  onValueChange={(v) => typeof v === "string" && setForm((f: any) => ({ ...f, contact_type: v }))}
                  placeholder="Select contact type"
                  searchPlaceholder="Search contact type..."
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input name="phone_number" value={form.phone_number || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Communication Type *</Label>
                <Combobox
                  options={communicationTypes}
                  value={form.communication_type || ""}
                  onValueChange={(v) => typeof v === "string" && setForm((f: any) => ({ ...f, communication_type: v }))}
                  placeholder="Select communication type"
                  searchPlaceholder="Search communication type..."
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Address *</Label>
                <Input name="address" value={form.address || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input name="city" value={form.city || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input name="state" value={form.state || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <CountrySelect value={form.country || ""} onChange={v => setForm((f: any) => ({ ...f, country: v }))} placeholder="Select country" />
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Updating..." : "Update Information"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/profile")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
