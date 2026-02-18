"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, CreditCard, FileText, Home, Loader2, Phone, ShieldCheck, User, Users } from "lucide-react"
import { formatDate } from "@/lib/date-format"

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

type InfoItem = {
  label: string
  value: ReactNode
}

const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all hover:shadow-[0_28px_70px_-34px_oklch(0.28_0.06_260/0.6)]"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [companyUsers, setCompanyUsers] = useState<CompanyUserRow[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchProfile() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        })

        const data = (await res.json()) as ProfileApiResponse

        if (cancelled) return

        if (data?.status === "success" || data?.status === true) {
          const payload = data.data || {}
          const mainProfile = (payload as any)?.["0"] as ProfileData | undefined
          setProfile(mainProfile ?? null)
          setCompanyUsers(payload.company_users || [])
        } else {
          setError(data?.message || "Failed to load profile")
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to load profile")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const company = profile?.company_users?.[0]?.company_information

  const screeningMetrics = useMemo(() => {
    const total = Number(company?.total_screenings || 0)
    const remainingRaw = Number(company?.remaining_screenings || 0)
    if (!Number.isFinite(total) || total <= 0) {
      return {
        hasData: false,
        total: 0,
        remaining: 0,
        used: 0,
        usedPercent: 0,
      }
    }

    const remaining = Math.min(Math.max(remainingRaw, 0), total)
    const used = total - remaining
    const usedPercent = Math.round((used / total) * 100)

    return {
      hasData: true,
      total,
      remaining,
      used,
      usedPercent,
    }
  }, [company?.remaining_screenings, company?.total_screenings])

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className={CARD_STYLE}>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setRefreshKey((value) => value + 1)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const personalInfo: InfoItem[] = [
    { label: "Name", value: profile?.name || "Not Available" },
    { label: "Reporting Entity ID", value: company?.reporting_entry_id || "Not Available" },
    { label: "Birthdate", value: formatDate(company?.dob, "Not Available") },
  ]

  const passportInfo: InfoItem[] = [
    { label: "Passport Number", value: company?.passport_number || "Not Available" },
    { label: "Passport Country", value: company?.passport_country || "Not Available" },
    { label: "Nationality", value: company?.nationality || "Not Available" },
  ]

  const addressInfo: InfoItem[] = [
    { label: "Address", value: company?.address || "Not Available" },
    { label: "City", value: company?.city || "Not Available" },
    { label: "State", value: company?.state || "Not Available" },
    { label: "Country", value: company?.country || "Not Available" },
  ]

  const companyContactInfo: InfoItem[] = [
    { label: "Email", value: company?.email || profile?.email || "Not Available" },
    { label: "Phone Number", value: company?.phone_number || profile?.phone || "Not Available" },
    { label: "Contact Type", value: company?.contact_type || "Not Available" },
    { label: "Communication Type", value: company?.communication_type || "Not Available" },
    { label: "Created Date", value: formatDate(company?.creation_date, "Not Available") },
  ]

  const scrollToCompanyUsers = () => {
    const usersTable = document.getElementById("company-users-table")
    usersTable?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-4 lg:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0 flex items-start gap-3">
              <div className="mt-0.5 h-10 w-10 shrink-0 rounded-xl border border-primary/20 bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {profile?.name ? (
                    <span className="text-xs font-medium text-muted-foreground">Owner: {profile.name}</span>
                  ) : null}
                  {company?.reporting_entry_id ? (
                    <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      ID: {company.reporting_entry_id}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-1 text-xl font-semibold leading-snug tracking-tight text-foreground break-words lg:text-[1.65rem]">
                  {company?.name || "Not Available"}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="rounded-full h-6 px-2.5">{profile?.role || "User"}</Badge>
                  <Badge className="rounded-full h-6 px-2.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center lg:justify-end">
              {company?.id ? (
                <Button asChild className="h-9 rounded-lg px-4">
                  <Link href={`/dashboard/profile/${company.id}`}>Edit Profile</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={CARD_STYLE}>
          <CardContent className="p-0">
            <button
              type="button"
              onClick={scrollToCompanyUsers}
              className="w-full rounded-3xl p-5 text-left transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Jump to company users table"
            >
              <p className={SECONDARY_LABEL_CLASS}>Company Users</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{companyUsers.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">View Table</p>
            </button>
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={SECONDARY_LABEL_CLASS}>Screening Capacity</p>
            {screeningMetrics.hasData ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-bold tracking-tight">{screeningMetrics.remaining}</p>
                    <p className="text-xs text-muted-foreground">Remaining of {screeningMetrics.total}</p>
                  </div>
                  <p className="text-sm font-semibold">{screeningMetrics.used} used</p>
                </div>
                <Progress value={screeningMetrics.usedPercent} className="h-2.5" />
                <p className="text-[11px] text-muted-foreground">{screeningMetrics.usedPercent}% utilized</p>
              </div>
            ) : (
              <p className="mt-2 text-lg font-semibold tracking-tight">Not Available</p>
            )}
          </CardContent>
        </Card>
        <Card className={CARD_STYLE}>
          <CardContent className="p-5">
            <p className={SECONDARY_LABEL_CLASS}>License And Expiry</p>
            <div className="mt-2 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Trade License</p>
                <p className="mt-1 text-sm font-semibold break-words">{company?.trade_license_number || "Not Available"}</p>
              </div>
              <div className="border-t border-border/50 pt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Expiry</span>
                <span className="text-sm font-semibold">{formatDate(company?.expiration_date, "Not Available")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className={CARD_STYLE}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold tracking-tight">Company And Contact</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {companyContactInfo.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/50 bg-background/70 p-4">
                  <p className={SECONDARY_LABEL_CLASS}>{item.label}</p>
                  <p className="mt-2 text-sm font-semibold break-words">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-border/50 pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold tracking-tight">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {personalInfo.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/50 bg-background/70 p-4">
                  <p className={SECONDARY_LABEL_CLASS}>{item.label}</p>
                  <p className="mt-2 text-sm font-semibold break-words">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-border/50 pt-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold tracking-tight">Passport Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {passportInfo.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/50 bg-background/70 p-4">
                  <p className={SECONDARY_LABEL_CLASS}>{item.label}</p>
                  <p className="mt-2 text-sm font-semibold break-words">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-border/50 pt-6">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold tracking-tight">Address Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {addressInfo.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/50 bg-background/70 p-4">
                  <p className={SECONDARY_LABEL_CLASS}>{item.label}</p>
                  <p className="mt-2 text-sm font-semibold break-words">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      <Card id="company-users-table" className={`${CARD_STYLE} scroll-mt-24`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Company Users
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="w-full">
              <thead className="bg-muted/40 border-b border-border/50">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Name</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Email</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Role</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Created</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {companyUsers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-sm text-muted-foreground" colSpan={5}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  companyUsers.map((cu) => (
                    <tr key={cu.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium">{cu.user?.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{cu.user?.email || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary">
                          {cu.user?.role || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(cu.created_at, "-")}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
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
