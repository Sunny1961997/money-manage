"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileCheck, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"

type ScreeningLog = {
  id: number
  user_id: number
  search_string: string
  screening_type: string
  is_match: boolean
  screening_date: string
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

type ScreeningLogsResponse = {
  status: boolean
  message: string
  data: {
    items: ScreeningLog[]
    total: number
    limit: number
    offset: number
  }
}

export default function ScreeningLogsPage() {
  const [logs, setLogs] = useState<ScreeningLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(15)

  useEffect(() => {
    fetchLogs()
  }, [currentPage])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/screening-logs?limit=${limit}&offset=${currentPage}`, {
        method: "GET",
        credentials: "include",
      })
      const data: ScreeningLogsResponse = await res.json()

      if (data.status) {
        setLogs(data.data.items || [])
        setTotal(data.data.total || 0)
      } else {
        setError(data.message || "Failed to load screening logs")
      }
    } catch (err: any) {
      setError(err.message || "Failed to load screening logs")
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.search_string.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.screening_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(total / limit)

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Loading screening logs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCheck className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Screening Logs</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-sm text-muted-foreground">Total Screenings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {logs.filter((l) => l.is_match).length}
            </div>
            <p className="text-sm text-muted-foreground">Matches Found</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {logs.filter((l) => !l.is_match).length}
            </div>
            <p className="text-sm text-muted-foreground">No Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {new Set(logs.map((l) => l.screening_type)).size}
            </div>
            <p className="text-sm text-muted-foreground">Screening Types</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, search string, or screening type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Date & Time</th>
                  <th className="text-left p-4 font-medium text-sm">User</th>
                  <th className="text-left p-4 font-medium text-sm">Search String</th>
                  <th className="text-left p-4 font-medium text-sm">Screening Type</th>
                  <th className="text-left p-4 font-medium text-sm">Match Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td className="p-4 text-sm text-muted-foreground text-center" colSpan={5}>
                      No screening logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b last:border-b-0 hover:bg-slate-50">
                      <td className="p-4 text-sm">
                        {new Date(log.screening_date).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{log.user?.name || "N/A"}</span>
                          <span className="text-xs text-muted-foreground">{log.user?.email || ""}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium">{log.search_string}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {log.screening_type}
                        </span>
                      </td>
                      <td className="p-4">
                        {log.is_match ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Match Found</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">No Match</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
