import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Users } from "lucide-react"

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"

export default function AdminUsersPage() {
  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">User Management</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the admin user modules below to manage company users and related accounts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className={`${CARD_STYLE} hover:border-primary/40`}>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Company Users</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add, review, and update users assigned to client companies.
                </p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <Button asChild className="mt-5 h-10 rounded-xl px-4">
              <Link href="/dashboard/admin/company-users">
                Open Company Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className={`${CARD_STYLE} hover:border-primary/40`}>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Companies</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage company records and account-level subscription details.
                </p>
              </div>
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <Button asChild variant="outline" className="mt-5 h-10 rounded-xl px-4">
              <Link href="/dashboard/admin/companies">
                Open Companies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
