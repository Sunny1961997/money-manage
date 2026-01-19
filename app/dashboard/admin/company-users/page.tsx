"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Search, Plus, X, Building2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type CompanyUser = {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  company_name: string
}

type Company = {
  id: number
  name: string
}

const userRoles = [
  { value: "Company Admin", label: "Company Admin" },
//   { value: "Author", label: "Author" },
  { value: "MLRO", label: "MLRO" },
  { value: "Analyst", label: "Analyst" },
]

export default function CompanyUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<CompanyUser[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")
  const [companyId, setCompanyId] = useState("")

  useEffect(() => {
    fetchUsers()
    fetchCompanies()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/company-users", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      console.log("Fetched company users:", data)

      if (data.status === "success" || data.status) {
        setUsers(data.data || [])
      } else {
        setError(data.message || "Failed to load company users")
      }
    } catch (err: any) {
      setError(err.message || "Failed to load company users")
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()

      if (data.status === "success" || data.status) {
        // Extract unique companies from users' company_users array
        const companiesMap = new Map<number, Company>()

        const usersData = data.data || []
        usersData.forEach((user: any) => {
          if (user.company_users && Array.isArray(user.company_users)) {
            user.company_users.forEach((cu: any) => {
              const companyInfo = cu.company_information
              if (companyInfo && !companiesMap.has(companyInfo.id)) {
                companiesMap.set(companyInfo.id, {
                  id: companyInfo.id,
                  name: companyInfo.name,
                })
              }
            })
          }
        })

        setCompanies(Array.from(companiesMap.values()))
      }
    } catch (err: any) {
      console.error("Failed to fetch companies:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      phone,
      role,
      company_information_id: parseInt(companyId),
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log("[Company Users] Create response:", data)

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Company user created successfully",
        })
        setIsDialogOpen(false)
        resetForm()
        // Reload the users list
        await fetchUsers()
      } else {
        const details = data?.errors
          ? Object.values(data.errors as Record<string, string[]>)
              .flat()
              .join("; ")
          : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({
          title: "Failed to create user",
          description: errText,
        //   variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "Failed to create user",
        description: err?.message || "Network error",
        // variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setPasswordConfirmation("")
    setPhone("")
    setRole("")
    setCompanyId("")
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const companyOptions = companies.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Loading company users...</div>
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
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Company Users</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Company User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Company User</DialogTitle>
              <DialogDescription>
                Create a new user and assign them to a company with a specific role.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 8 characters)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">Confirm Password *</Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Combobox
                    options={companyOptions}
                    value={companyId}
                    onValueChange={(v) => typeof v === "string" && setCompanyId(v)}
                    placeholder="Select company"
                    searchPlaceholder="Search company..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Combobox
                    options={userRoles}
                    value={role}
                    onValueChange={(v) => typeof v === "string" && setRole(v)}
                    placeholder="Select role"
                    searchPlaceholder="Search role..."
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                  {submitting ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-sm text-muted-foreground">Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {new Set(users.map((u) => u.role)).size}
            </div>
            <p className="text-sm text-muted-foreground">User Roles</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">User Name</th>
                  <th className="text-left p-4 font-medium text-sm">Email</th>
                  <th className="text-left p-4 font-medium text-sm">Phone</th>
                  <th className="text-left p-4 font-medium text-sm">Company</th>
                  <th className="text-left p-4 font-medium text-sm">Role</th>
                  <th className="text-left p-4 font-medium text-sm">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td className="p-4 text-sm text-muted-foreground text-center" colSpan={6}>
                      No company users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((companyUser) => (
                    <tr key={companyUser.id} className="border-b last:border-b-0 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {companyUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{companyUser.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{companyUser.email}</td>
                      <td className="p-4 text-sm">{companyUser.phone || "-"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{companyUser.company_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {companyUser.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {companyUser.created_at
                          ? new Date(companyUser.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
