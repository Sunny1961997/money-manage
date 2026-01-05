"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Download, Search, Eye, Building2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true)
      const res = await fetch(`/api/onboarding/customers?limit=${limit}&offset=${offset}`, { credentials: "include" })
      const json = await res.json()
      if (json.status && json.data) {
        setCustomers(json.data.items)
        setTotal(json.data.total)
      }
      setLoading(false)
    }
    fetchCustomers()
  }, [limit, offset])

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Onboarded Customers</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                All Users
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9 w-80" />
              </div>
              <Select defaultValue="10">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Name</th>
                    <th className="text-left p-4 font-medium text-sm">Country</th>
                    <th className="text-left p-4 font-medium text-sm">Email</th>
                    <th className="text-left p-4 font-medium text-sm">Customer Type</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Created Date</th>
                    <th className="text-left p-4 font-medium text-sm">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    // const detail = customer.customer_type === "individual" ? customer.individual_detail : customer.corporate_detail
                    return (
                      <tr key={customer.id} className="border-b hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{customer.name || "-"}</span>
                          </div>
                        </td>
                        <td className="p-4">{customer.country || "-"}</td>
                        <td className="p-4 text-muted-foreground">{customer.email || "-"}</td>
                        <td className="p-4 text-muted-foreground">{customer.customer_type === "individual" ? "Individual" : "Corporate"}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {customer.status || "Onboarded"}
                          </span>
                        </td>
                        <td className="p-4">{new Date(customer.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {customer.risk_level ? `${customer.risk_level} - Medium Risk` : "-"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {offset} to {Math.min(offset + limit - 1, total)} of {total} customers
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={offset === 1} onClick={() => setOffset(Math.max(1, offset - limit))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={offset + limit > total} onClick={() => setOffset(offset + limit)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
