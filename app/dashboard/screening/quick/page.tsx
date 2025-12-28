"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Users, Building2, Globe, Calendar } from "lucide-react" // Import missing icons

export default function QuickScreeningPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Search className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Screening</h1>
      </div>

      <Card>
        <CardHeader className="bg-blue-50/50 border-b">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-medium">Screening</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Customer Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-5 h-5 flex items-center justify-center">↔</div>
              Customer Type
            </div>
            <Select defaultValue="individual">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Individual
                  </div>
                </SelectItem>
                <SelectItem value="corporate">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Corporate
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Name
            </Label>
            <Input placeholder="Enter name" />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </Label>
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gender
            </Label>
            <Input placeholder="Enter gender" />
          </div>

          {/* Fuzzy Search */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-5 h-5 flex items-center justify-center">↔</div>
              Fuzzy Search
            </div>
            <Select defaultValue="level2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="level1">Level I</SelectItem>
                <SelectItem value="level2">Level II</SelectItem>
                <SelectItem value="level3">Level III</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Nationality
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ae">United Arab Emirates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button className="w-full" size="lg">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
