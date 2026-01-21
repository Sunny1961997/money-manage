"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, Hash, FileText, Home, Phone, Globe, CreditCard } from "lucide-react"

type ProfileData = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  company_users: Array<{
    company_information: {
      id: number
      name: string
      email: string | null
      creation_date: string
      expiration_date: string
      total_screenings: number
      remaining_screenings: number
      trade_license_number: string
      reporting_entry_id: string
      dob: string
      passport_number: string
      passport_country: string
      nationality: string
      contact_type: string
      communication_type: string
      phone_number: string
      address: string
      city: string
      state: string
      country: string
    }
  }>
}

type CompanyUserRow = {
  id: number
  user_id: number
  company_information_id: number
  created_at: string | null
  updated_at: string | null
  user: {
    id: number
    name: string
    email: string
    phone: string
    role: string
    email_verified_at?: string | null
    created_at?: string
    updated_at?: string
  }
}

type ProfileApiResponse = {
  status: string | boolean
  message?: string
  data: {
    "0"?: ProfileData
    company_users?: CompanyUserRow[]
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [companyUsers, setCompanyUsers] = useState<CompanyUserRow[]>([])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        })

        const data = (await res.json()) as ProfileApiResponse

        if (data?.status === "success" || data?.status === true) {
          const mainProfile = (data.data as any)?.["0"] as ProfileData | undefined
          setProfile(mainProfile ?? null)
        } else {
          setError((data as any)?.message || "Failed to load profile")
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    async function fetchUsersOnly() {
      try {
        const res = await fetch("/api/profile", { method: "GET", credentials: "include" })
        const data = (await res.json()) as ProfileApiResponse
        if (data?.status === "success" || data?.status === true) {
          setCompanyUsers(data.data?.company_users || [])
        }
      } catch {
        // ignore
      }
    }
    fetchUsersOnly()
  }, [])

  const company = profile?.company_users?.[0]?.company_information

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="text-center py-12">Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="text-center py-12 text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Profile Information</h1>
      </div>

      {/* Company Name Banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">{company?.name || "Not Available"}</h2>
          </div>
        </CardContent>
      </Card>

      {/* General Information */}
      <Card>
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="text-base font-medium">• General Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Phone className="w-3 h-3" />
                EMAIL
              </div>
              <div className="font-medium">{company?.email || profile?.email || "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                CREATED DATE
              </div>
              <div className="font-medium">{company?.creation_date ? new Date(company.creation_date).toLocaleDateString() : "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                EXPIRY DATE
              </div>
              <div className="font-medium">{company?.expiration_date ? new Date(company.expiration_date).toLocaleDateString() : "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Hash className="w-3 h-3" />
                REMAINING SCREENING COUNT
              </div>
              <div className="font-medium">{company?.remaining_screenings ?? "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Hash className="w-3 h-3" />
                TOTAL SCREENING COUNT
              </div>
              <div className="font-medium">{company?.total_screenings ?? "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <FileText className="w-3 h-3" />
                TRADE LICENSE NUMBER
              </div>
              <div className="font-medium">{company?.trade_license_number || "Not Available"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="text-base font-medium">• Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <User className="w-3 h-3" />
                NAME
              </div>
              <div className="font-medium">{profile?.name || "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <FileText className="w-3 h-3" />
                REPORTING ENTITY ID
              </div>
              <div className="font-medium">{company?.reporting_entry_id || "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                BIRTHDATE
              </div>
              <div className="font-medium">{company?.dob ? new Date(company.dob).toLocaleDateString() : "Not Available"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passport Information */}
      <Card>
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="text-base font-medium">• Passport Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <CreditCard className="w-3 h-3" />
                PASSPORT NUMBER
              </div>
              <div className="font-medium">{company?.passport_number || "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Globe className="w-3 h-3" />
                PASSPORT COUNTRY
              </div>
              <div className="font-medium">{company?.passport_country || "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Globe className="w-3 h-3" />
                NATIONALITY
              </div>
              <div className="font-medium">{company?.nationality || "Not Available"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="text-base font-medium">• Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Phone className="w-3 h-3" />
                CONTACT TYPE
              </div>
              <div className="font-medium">{company?.contact_type || "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Phone className="w-3 h-3" />
                COMMUNICATION TYPE
              </div>
              <div className="font-medium">{company?.communication_type || "Not Available"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Phone className="w-3 h-3" />
                PHONE NUMBER
              </div>
              <div className="font-medium">{company?.phone_number || profile?.phone || "Not Available"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="text-base font-medium">• Address Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="font-semibold mb-4">Address</div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">{company?.address || "Not Available"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">City</div>
                    <div className="font-medium">{company?.city || "Not Available"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Country</div>
                    <div className="font-medium">{company?.country || "Not Available"}</div>
                  </div>
                  <div className="space-y-2 col-span-3">
                    <div className="text-sm text-muted-foreground">State</div>
                    <div className="font-medium">{company?.state || "Not Available"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="bg-blue-50/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle className="text-base font-medium">Users</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Name</th>
                  <th className="text-left p-4 font-medium text-sm">Email</th>
                  <th className="text-left p-4 font-medium text-sm">Role</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {companyUsers.length === 0 ? (
                  <tr>
                    <td className="p-4 text-sm text-muted-foreground" colSpan={4}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  companyUsers.map((cu) => (
                    <tr key={cu.id} className="border-b last:border-b-0">
                      <td className="p-4">{cu.user?.name || "-"}</td>
                      <td className="p-4">{cu.user?.email || "-"}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cu.user?.role || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Active
                        </span>
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
