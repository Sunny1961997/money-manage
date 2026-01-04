"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, AlertTriangle, Users, Building2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccountStatsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Account Statistics</h1>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Total Onboarded Users</div>
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mb-1">1</div>
            <div className="text-xs text-muted-foreground">0 individual, 1 corporate</div>
            <Button variant="link" className="text-xs p-0 h-auto mt-2">
              View details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Ongoing Monitoring</div>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-xs text-muted-foreground">0% of total users</div>
            <Button variant="link" className="text-xs p-0 h-auto mt-2">
              View details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Onboarded Status</div>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mb-1">1</div>
            <div className="text-xs text-muted-foreground">100% successful onboardings</div>
            <Button variant="link" className="text-xs p-0 h-auto mt-2">
              View details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">High Risk Users</div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-xs text-muted-foreground">0% of total users</div>
            <Button variant="link" className="text-xs p-0 h-auto mt-2">
              View details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Type Distribution</CardTitle>
            <CardDescription>Breakdown of individual vs corporate users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Level Distribution</CardTitle>
            <CardDescription>Breakdown of users by risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboarding Status</CardTitle>
            <CardDescription>Current status of all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-around gap-2 p-4">
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-teal-600 rounded-t" style={{ height: "100%" }}></div>
                <div className="text-xs text-muted-foreground">Onboarded</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-200 rounded-t" style={{ height: "20%" }}></div>
                <div className="text-xs text-muted-foreground">In Review</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-200 rounded-t" style={{ height: "20%" }}></div>
                <div className="text-xs text-muted-foreground">False Match</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-200 rounded-t" style={{ height: "20%" }}></div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-200 rounded-t" style={{ height: "20%" }}></div>
                <div className="text-xs text-muted-foreground">Alerted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Risk Assessment</CardTitle>
            <CardDescription>Summary of risk levels across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { level: "High Risk (≥ 4)", count: 0, color: "bg-red-500" },
                { level: "Medium High (≥ 3)", count: 0, color: "bg-orange-500" },
                { level: "Medium Risk (≥ 2)", count: 1, color: "bg-yellow-500" },
                { level: "Low Risk (1 to < 2)", count: 0, color: "bg-green-500" },
              ].map((item) => (
                <div key={item.level} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <div className="flex-1 text-sm">{item.level}</div>
                  <div className="w-1/2 bg-gray-100 rounded-full h-2 overflow-hidden">
                    {item.count > 0 && (
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 1) * 100}%` }}></div>
                    )}
                  </div>
                  <div className="w-12 text-right text-sm font-medium">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ongoing Monitoring Requirements</CardTitle>
            <CardDescription>Users requiring special ongoing monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <div className="text-sm font-medium mb-1">Ongoing Monitoring</div>
              <div className="text-3xl font-bold mb-2">0</div>
              <div className="text-xs text-muted-foreground">0 individual, 0 corporate</div>
              <div className="mt-6 space-y-3 w-full">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Individual Users</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Corporate Users</span>
                  </div>
                  <span className="font-bold">1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* License Warning */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-orange-900 mb-1">ID/License Already Expired</div>
              <div className="text-sm text-orange-700 mb-3">
                Users with ID, trade license, partner ID, or tenancy contract already expired
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                <div className="flex items-center gap-2 text-orange-900">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">1 corporate license / tenancy contract</span>
                </div>
                <Button variant="link" className="text-orange-700 text-sm">
                  View details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
