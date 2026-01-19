"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, FileCheck, Shield } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const adminCards = [
    {
      title: "Companies",
      description: "Manage company accounts and subscriptions",
      icon: Building2,
      href: "/dashboard/admin/companies",
      count: "-",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Users",
      description: "Manage system users and permissions",
      icon: Users,
      href: "/dashboard/admin/users",
      count: "-",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Shield,
      href: "/dashboard/admin/settings",
      count: "-",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Audit Logs",
      description: "View system activity and audit trails",
      icon: FileCheck,
      href: "/dashboard/admin/audit-logs",
      count: "-",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                      {card.count && (
                        <div className="text-2xl font-bold">{card.count}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <div className="text-sm text-muted-foreground">Total Companies</div>
              <div className="text-2xl font-bold">-</div>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-2xl font-bold">-</div>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <div className="text-sm text-muted-foreground">Total Screenings</div>
              <div className="text-2xl font-bold">-</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}