"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const PAGE_CLASS = "space-y-8 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const LABEL_CLASS = "text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"

export default function CompanySubscriptionsPage() {
  const params = useParams()
  const companyId = params?.id as string
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [companyName, setCompanyName] = useState("")

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log(`Fetching subscriptions for company ID: ${companyId} with offset ${(page - 1) * limit} and limit ${limit}`);
        const res = await fetch(`/api/company-subscriptions/${companyId}?offset=${(page - 1) * limit}&limit=${limit}`)
        const data = await res.json()
        console.log("Fetched subscriptions data:", data.data)
        if (data.status) {
          setSubscriptions(data.data.subscriptions || [])
          setCompanyName(data.data.company_name || "");
        } else {
          setError(data.message || "Failed to load subscriptions")
        }
      } catch (err: any) {
        setError(err.message || "Failed to load subscriptions")
      } finally {
        setLoading(false)
      }
    }
    if (companyId) fetchSubscriptions()
  }, [companyId, page, limit])

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" aria-hidden="true" />
          </div>
          <p className="absolute top-full mt-4 text-sm text-muted-foreground animate-pulse whitespace-nowrap">Loading subscriptions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card className={CARD_STYLE}>
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Subscription History for {companyName}</h1>
          <div className="mb-6 flex justify-end">
            <Button
              className="bg-primary hover:bg-primary-700"
              onClick={() => window.location.href = `/dashboard/admin/companies/${companyId}/subscriptions/add`}
            >
              Add Subscription
            </Button>
          </div>
          {error ? (
            <div className="py-10 text-center text-destructive">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead className="border-b border-border/70 bg-muted/30">
                  <tr className="text-left">
                    {/* <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">User ID</th> */}
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Package</th>
                    {/* <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Plan ID</th> */}
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Transaction</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Currency</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Start Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">End Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Trial Ends</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Package Details</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={11}>
                        No subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub: any) => (
                      <tr key={sub.id} className="border-b border-border/60 transition hover:bg-muted/20">
                        {/* <td className="px-4 py-3.5">{sub.user_id}</td> */}
                        <td className="px-4 py-3.5">{sub.package?.name || '-'}</td>
                        {/* <td className="px-4 py-3.5">{sub.package_plan_id}</td> */}
                        <td className="px-4 py-3.5">{sub.transaction_id}</td>
                        <td className="px-4 py-3.5">{sub.package_price}</td>
                        <td className="px-4 py-3.5">{sub.currency}</td>
                        <td className="px-4 py-3.5">{sub.start_date}</td>
                        <td className="px-4 py-3.5">{sub.end_date}</td>
                        <td className="px-4 py-3.5">{sub.trial_ends_at}</td>
                        <td className="px-4 py-3.5">{sub.status}</td>
                        <td className="px-4 py-3.5">
                          {sub.package ? (
                            <div className="text-xs">
                              <div><b>Price:</b> {sub.package.price}</div>
                              <div><b>Currency:</b> {sub.package.currency}</div>
                              <div><b>Trial Days:</b> {sub.package.trial_days}</div>
                              <div><b>Screening Limit:</b> {sub.package.screening_limit}</div>
                              <div><b>KYC Limit:</b> {sub.package.kyc_limit}</div>
                              <div><b>Duration:</b> {sub.package.duration}</div>
                              <div><b>Description:</b> {sub.package.description}</div>
                            </div>
                          ) : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex items-center justify-between gap-4 px-4 py-6">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={subscriptions.length < limit} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Page {page}
                </div>
                <div>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={limit}
                    onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}
                  >
                    {[10, 25, 50, 100].map(opt => (
                      <option key={opt} value={opt}>{opt} / page</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
