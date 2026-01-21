"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, FileCheck, Shield } from "lucide-react"
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface AccountStats {
  company_count: number,
  system_users: number,
  screening_logs: number,
  active_users: number
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [stats, setStats] = useState<AccountStats | null>(null)
  const adminCards = [
    {
      title: "Companies",
      description: "Manage company accounts and subscriptions",
      icon: Building2,
      href: "/dashboard/admin/companies",
      count: `${stats?.company_count}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Users",
      description: "Manage system users and permissions",
      icon: Users,
      href: "/dashboard/admin/users",
      count: `${stats?.system_users}`,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    // {
    //   title: "System Settings",
    //   description: "Configure system-wide settings",
    //   icon: Shield,
    //   href: "/dashboard/admin/settings",
    //   count: "-",
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-50",
    // },
    {
      title: "Audit Logs",
      description: "View system activity and audit trails",
      icon: FileCheck,
      href: "/dashboard/admin/audit-logs",
      count: `${stats?.screening_logs}`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  useEffect(() => {
      fetchStats()
    }, [])
  
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", {
          credentials: "include",
        })
  
        const data = await res.json();
  
        if (res.ok && data.status) {
          setStats(data.data)
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch account statistics",
            // variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An error occurred",
          // variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

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
              <div className="text-2xl font-bold">{stats?.company_count}</div>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <div className="text-sm text-muted-foreground">Active Users</div>
              <div className="text-2xl font-bold">{stats?.active_users}</div>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <div className="text-sm text-muted-foreground">Total Screenings</div>
              <div className="text-2xl font-bold">{stats?.screening_logs}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}