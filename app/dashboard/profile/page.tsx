"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, Hash, FileText, Home, Phone, Globe, CreditCard } from "lucide-react"

export default function ProfilePage() {
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
            <h2 className="text-xl font-semibold">ALHAZ ALSAATIE GOLD AND JEWELRY TRADING LLC</h2>
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
              <div className="font-medium">daweihuang100@gmail.com</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                CREATED DATE
              </div>
              <div className="font-medium">8/18/2025</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                EXPIRY DATE
              </div>
              <div className="font-medium">8/18/2026</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Hash className="w-3 h-3" />
                REMAINING SCREENING COUNT
              </div>
              <div className="font-medium">488</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Hash className="w-3 h-3" />
                TOTAL SCREENING COUNT
              </div>
              <div className="font-medium">500</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <FileText className="w-3 h-3" />
                TRADE LICENSE NUMBER
              </div>
              <div className="font-medium">1403345</div>
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
                FIRST NAME
              </div>
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <User className="w-3 h-3" />
                LAST NAME
              </div>
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <FileText className="w-3 h-3" />
                REPORTING ENTITY ID
              </div>
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                BIRTHDATE
              </div>
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Hash className="w-3 h-3" />
                ID NUMBER
              </div>
              <div className="font-medium">Not Available</div>
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
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Globe className="w-3 h-3" />
                PASSPORT COUNTRY
              </div>
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Globe className="w-3 h-3" />
                NATIONALITY
              </div>
              <div className="font-medium">Not Available</div>
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
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Phone className="w-3 h-3" />
                COMMUNICATION TYPE
              </div>
              <div className="font-medium">Not Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                <Phone className="w-3 h-3" />
                PHONE NUMBER
              </div>
              <div className="font-medium">Not Available</div>
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
              <Home className="w-5 h-5 text-red-500 mt-1" />
              <div className="flex-1">
                <div className="font-semibold mb-4">Address</div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">Off no 406 Deira Waterfront Market Dubai UAE</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">City</div>
                    <div className="font-medium">Not Available</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Country</div>
                    <div className="font-medium">Not Available</div>
                  </div>
                  <div className="space-y-2 col-span-3">
                    <div className="text-sm text-muted-foreground">State</div>
                    <div className="font-medium">Not Available</div>
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
                <tr className="border-b">
                  <td className="p-4">ALHAZMILRO</td>
                  <td className="p-4">alhazmilro@winnowms.com</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ML.RO
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">ALHAZFLA</td>
                  <td className="p-4">alhazfla@winnowms.com</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      FLA
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
