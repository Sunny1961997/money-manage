"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditPackagePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  console.log("Editing package with ID:", id)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("AED")
  const [isDefault, setIsDefault] = useState(false)
  const [trialDays, setTrialDays] = useState(0)
  const [screeningLimit, setScreeningLimit] = useState(0)
  const [kycLimit, setKycLimit] = useState(0)
  const [duration, setDuration] = useState(0)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currencies, setCurrencies] = useState<string[]>([])

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const res = await fetch(`/api/admin/packages/${id}`)
        const data = await res.json()
        console.log("Fetched package data:", data)
        if (data.status === true || data.status === "success") {
          const pkg = data.data
          setName(pkg.name || "")
          setPrice(pkg.price ? String(pkg.price) : "")
          setCurrency(pkg.currency || "AED")
          setIsDefault(!!pkg.is_default)
          setTrialDays(pkg.trial_days || 0)
          setScreeningLimit(pkg.screening_limit || 0)
          setKycLimit(pkg.kyc_limit || 0)
          setDuration(pkg.duration || 0)
          setDescription(pkg.description || "")
        } else {
          // Optionally use a toast here
        //   router.push("/dashboard/admin/packages")
        }
      } catch (err) {
        // Optionally use a toast here
      } finally {
        setLoading(false)
      }
    }
    const fetchCurrencies = async () => {
      const res = await fetch("/api/countries", { credentials: "include" })
      const data = await res.json()
      const uniqueCurrencies = Array.from(new Set((data?.data?.countries || []).map((c: any) => String(c.currency)).filter(Boolean)))
      setCurrencies(uniqueCurrencies as string[])
    }
    if (id) fetchPackageData()
    fetchCurrencies()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // Update package via proxy API
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          price,
          currency,
          is_default: isDefault,
          trial_days: trialDays,
          screening_limit: screeningLimit,
          kyc_limit: kycLimit,
          duration,
          description,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to update package")
      router.push("/dashboard/admin/packages")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium">Edit Package</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter package name" required />
              </div>
              <div className="space-y-2">
                <Label>Price *</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value.replace(/^0+/, ""))} placeholder="Enter price" required />
              </div>
              <div className="space-y-2">
                <Label>Currency *</Label>
                <select
                  className="border px-3 py-2 rounded w-full"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  required
                >
                  <option value="">Select currency</option>
                  {currencies.map(cur => (
                    <option key={cur} value={cur}>{cur}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Is Default</Label>
                <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} />
              </div>
              <div className="space-y-2">
                <Label>Trial Days</Label>
                <Input type="number" value={trialDays === 0 ? "" : String(trialDays)} onChange={e => { const val = e.target.value.replace(/^0+/, ""); setTrialDays(val === "" ? 0 : Number(val)) }} placeholder="Enter trial days" />
              </div>
              <div className="space-y-2">
                <Label>Screening Limit</Label>
                <Input type="number" value={screeningLimit === 0 ? "" : String(screeningLimit)} onChange={e => { const val = e.target.value.replace(/^0+/, ""); setScreeningLimit(val === "" ? 0 : Number(val)) }} placeholder="Enter screening limit" />
              </div>
              <div className="space-y-2">
                <Label>KYC Limit</Label>
                <Input type="number" value={kycLimit === 0 ? "" : String(kycLimit)} onChange={e => { const val = e.target.value.replace(/^0+/, ""); setKycLimit(val === "" ? 0 : Number(val)) }} placeholder="Enter KYC limit" />
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input type="number" value={duration === 0 ? "" : String(duration)} onChange={e => { const val = e.target.value.replace(/^0+/, ""); setDuration(val === "" ? 0 : Number(val)) }} placeholder="Enter duration" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <textarea className="border px-3 py-2 rounded w-full" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter description" />
              </div>
            </div>
          </CardContent>
        </Card>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}