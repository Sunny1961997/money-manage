"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddPackagePage() {
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
  const router = useRouter()

  useEffect(() => {
    fetch("/api/countries", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched countries for currencies:", data)
        // Assume data.data is an array of countries with currency
        const uniqueCurrencies = Array.from(new Set((data?.data?.countries || []).map((c: any) => String(c.currency)).filter(Boolean)))
        setCurrencies(uniqueCurrencies as string[])
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, price, currency, isDefault, trialDays, screeningLimit, kycLimit, duration, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to create package")
      router.push("/dashboard/admin/packages")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold">Add New Package</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-base font-medium">Package Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter package name" required />
              </div>
              <div className="space-y-2">
                <Label>Price *</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter price" required />
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
                <Input
                  type="number"
                  value={trialDays === 0 ? "" : String(trialDays)}
                  onChange={e => {
                    const val = e.target.value.replace(/^0+/, "")
                    setTrialDays(val === "" ? 0 : Number(val))
                  }}
                  placeholder="Enter trial days"
                />
              </div>
              <div className="space-y-2">
                <Label>Screening Limit</Label>
                <Input
                  type="number"
                  value={screeningLimit === 0 ? "" : String(screeningLimit)}
                  onChange={e => {
                    const val = e.target.value.replace(/^0+/, "")
                    setScreeningLimit(val === "" ? 0 : Number(val))
                  }}
                  placeholder="Enter screening limit"
                />
              </div>
              <div className="space-y-2">
                <Label>KYC Limit</Label>
                <Input
                  type="number"
                  value={kycLimit === 0 ? "" : String(kycLimit)}
                  onChange={e => {
                    const val = e.target.value.replace(/^0+/, "")
                    setKycLimit(val === "" ? 0 : Number(val))
                  }}
                  placeholder="Enter KYC limit"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input
                  type="number"
                  value={duration === 0 ? "" : String(duration)}
                  onChange={e => {
                    const val = e.target.value.replace(/^0+/, "")
                    setDuration(val === "" ? 0 : Number(val))
                  }}
                  placeholder="Enter duration"
                />
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
            {loading ? "Saving..." : "Save Package"}
          </Button>
        </div>
      </form>
    </div>
  )
}
