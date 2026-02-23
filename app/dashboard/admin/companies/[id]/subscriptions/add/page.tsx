"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast";

export default function AddSubscriptionPage() {
  const { toast } = useToast();
  const params = useParams()
  const router = useRouter()
  const companyId = params?.id as string
  const [packages, setPackages] = useState<any[]>([])
  const [packageId, setPackageId] = useState("")
//   const [currency, setCurrency] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [status, setStatus] = useState("Paid")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/admin/packages", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setPackages(data.data || [])
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          package_id: packageId,
          company_information_id: companyId,
        //   currency,
          transaction_id: transactionId,
          status,
        }),
      })
      const data = await res.json()
      console.log("Subscription creation response:", data.message)
      if (!res.ok || !data.status) 
      {
        toast({
          title: "Submission Failed",
          description: String(data.message || "Failed to subscribe"),
          variant: "destructive",
        });
        return;
      }
      router.push(`/dashboard/admin/companies/${companyId}/subscriptions`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-6">Add Subscription</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Package *</label>
              <select
                className="border px-3 py-2 rounded w-full"
                value={packageId}
                onChange={e => setPackageId(e.target.value)}
                required
              >
                <option value="">Select package</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block mb-1 font-medium">Currency *</label>
              <Input value={currency} onChange={e => setCurrency(e.target.value)} required />
            </div> */}
            <div>
              <label className="block mb-1 font-medium">Transaction ID</label>
              <Input value={transactionId} onChange={e => setTransactionId(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                className="border px-3 py-2 rounded w-full"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Not Paid">Not Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Saving..." : "Add Subscription"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
