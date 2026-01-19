"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Search, Plus, Eye, Edit, Trash2 } from "lucide-react"

type Company = {
  id: number
  name: string
  email: string | null
  creation_date: string
  expiration_date: string
  total_screenings: number
  remaining_screenings: number
  trade_license_number: string
  phone_number: string
  city: string
  country: string
  created_at: string | null
  updated_at: string | null
}

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies", {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        
        if (data.status === "success" || data.status) {
          // Extract unique companies from users' company_users array
          const companiesMap = new Map<number, Company>()
          
          const users = data.data || []
          users.forEach((user: any) => {
            if (user.company_users && Array.isArray(user.company_users)) {
              user.company_users.forEach((cu: any) => {
                const companyInfo = cu.company_information
                if (companyInfo && !companiesMap.has(companyInfo.id)) {
                  companiesMap.set(companyInfo.id, companyInfo)
                }
              })
            }
          })
          
          setCompanies(Array.from(companiesMap.values()))
        } else {
          setError(data.message || "Failed to load companies")
        }
      } catch (err: any) {
        setError(err.message || "Failed to load companies")
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.trade_license_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Loading companies...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Companies</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dashboard/admin/companies/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-sm text-muted-foreground">Total Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {companies.filter(c => new Date(c.expiration_date) > new Date()).length}
            </div>
            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.remaining_screenings, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Remaining Screenings</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name, email, or license number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Company Name</th>
                  <th className="text-left p-4 font-medium text-sm">Email</th>
                  <th className="text-left p-4 font-medium text-sm">License Number</th>
                  <th className="text-left p-4 font-medium text-sm">Location</th>
                  <th className="text-left p-4 font-medium text-sm">Screenings</th>
                  <th className="text-left p-4 font-medium text-sm">Expiry Date</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td className="p-4 text-sm text-muted-foreground text-center" colSpan={8}>
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => {
                    const isActive = new Date(company.expiration_date) > new Date()
                    const screeningPercentage = company.total_screenings > 0 
                      ? Math.round((company.remaining_screenings / company.total_screenings) * 100)
                      : 0

                    return (
                      <tr key={company.id} className="border-b last:border-b-0 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{company.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{company.email || "-"}</td>
                        <td className="p-4 text-sm">{company.trade_license_number}</td>
                        <td className="p-4 text-sm">
                          {company.city}, {company.country}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex flex-col gap-1">
                            <span>{company.remaining_screenings} / {company.total_screenings}</span>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${screeningPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(company.expiration_date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isActive ? "Active" : "Expired"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
