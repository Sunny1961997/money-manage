"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RequiredLabel } from "@/components/ui/required-label"
import { Users, Search, Plus, Building2, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Combobox } from "@/components/ui/combobox"
import { formatDate } from "@/lib/date-format"
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
  { value: "MLRO", label: "MLRO" },
  { value: "Analyst", label: "Analyst" },
]

const PAGE_CLASS = "space-y-8 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const FIELD_LABEL_CLASS = "block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_GROUP_CLASS = "space-y-2"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20"

export default function CompanyUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<CompanyUser[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
      company_information_id: parseInt(companyId, 10),
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

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Company user created successfully",
        })
        setIsDialogOpen(false)
        resetForm()
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
        })
      }
    } catch (err: any) {
      toast({
        title: "Failed to create user",
        description: err?.message || "Network error",
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

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  )

  const companyOptions = companies.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }))

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="relative z-10 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={PAGE_CLASS}>
        <Card className={CARD_STYLE}>
          <CardContent className="p-10 text-center text-sm text-destructive">{error}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Company Users</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create and manage users assigned to each client company.
                  </p>
                </div>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 rounded-xl px-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Company User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border/70 p-0">
                <div className="border-b border-border/60 px-6 py-4">
                  <DialogHeader>
                    <DialogTitle>Add New Company User</DialogTitle>
                    <DialogDescription>
                      Create a new user and assign them to a company with the correct role.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className={FIELD_GROUP_CLASS}>
                      <RequiredLabel htmlFor="name" text="Name" className={FIELD_LABEL_CLASS} />
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" className={FIELD_CLASS} required />
                    </div>
                    <div className={FIELD_GROUP_CLASS}>
                      <RequiredLabel htmlFor="email" text="Email" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className={FIELD_CLASS}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className={FIELD_GROUP_CLASS}>
                      <RequiredLabel htmlFor="password" text="Password" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (min 8 characters)"
                        className={FIELD_CLASS}
                        required
                      />
                    </div>
                    <div className={FIELD_GROUP_CLASS}>
                      <RequiredLabel htmlFor="passwordConfirmation" text="Confirm Password" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Confirm password"
                        className={FIELD_CLASS}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className={FIELD_GROUP_CLASS}>
                      <Label htmlFor="phone" className={FIELD_LABEL_CLASS}>
                        Phone
                      </Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className={FIELD_CLASS} />
                    </div>
                    <div className={FIELD_GROUP_CLASS}>
                      <RequiredLabel htmlFor="company" text="Company" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={companyOptions}
                        value={companyId}
                        onValueChange={(v) => typeof v === "string" && setCompanyId(v)}
                        placeholder="Select company"
                        searchPlaceholder="Search company..."
                        className={FIELD_CLASS}
                        matchTriggerWidth
                      />
                    </div>
                  </div>

                  <div className={FIELD_GROUP_CLASS}>
                    <RequiredLabel htmlFor="role" text="Role" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={userRoles}
                      value={role}
                      onValueChange={(v) => typeof v === "string" && setRole(v)}
                      placeholder="Select role"
                      searchPlaceholder="Search role..."
                      className={FIELD_CLASS}
                      matchTriggerWidth
                    />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-xl"
                      onClick={() => {
                        setIsDialogOpen(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="h-10 rounded-xl px-4" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={FIELD_LABEL_CLASS}>Total Users</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{users.length}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={FIELD_LABEL_CLASS}>Companies</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{companies.length}</p>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={FIELD_LABEL_CLASS}>User Roles</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{new Set(users.map((u) => u.role)).size}</p>
          </CardContent>
        </Card>
      </div>

      <Card className={CARD_STYLE}>
        <CardContent className="p-0">
          <div className="border-b border-border/60 p-5 sm:p-6">
            <div className={FIELD_GROUP_CLASS}>
              <p className={FIELD_LABEL_CLASS}>Search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, company, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${FIELD_CLASS} pl-10`}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="border-b border-border/70 bg-muted/30">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">User Name</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={6}>
                      No company users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((companyUser) => (
                    <tr key={companyUser.id} className="border-b border-border/60 transition hover:bg-muted/20">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                            <span className="text-sm font-semibold text-primary">
                              {companyUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{companyUser.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{companyUser.email}</td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{companyUser.phone || "-"}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span>{companyUser.company_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {companyUser.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">
                        {companyUser.created_at ? formatDate(companyUser.created_at) : "-"}
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
