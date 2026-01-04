"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function GoamlReportingPage() {
  const [reports, setReports] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchReports() {
      const res = await fetch(`/api/goaml/reports?limit=10&offset=${page}` , {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const json = await res.json()
      console.log("Fetched GOAML Reports:", json)
      if (json?.status) {
        setReports(json.data?.reports || [])
        setTotal(json.data?.total || 0)
      }
    }
    fetchReports()
  }, [page])

  return (
    <div className="p-6">
      {/* Notice banner */}
      <div className="mb-4 rounded border border-orange-300 bg-orange-50 text-orange-800 p-3">
        <b>Notice !</b> Please update the identification issue details for all existing corporate customers' UBO, Partner, or Authorised Person to facilitate a seamless GOAML process.
      </div>

      {/* Header actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">GOAML Reporting</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border text-sm" onClick={() => setPage(1)}>Refresh</button>
          <Link href="/dashboard/goaml-reporting/create" className="px-3 py-2 rounded bg-blue-600 text-white text-sm">+ Create New Report</Link>
          <button className="px-3 py-2 rounded border text-sm">Validate XML File</button>
        </div>
      </div>

      {/* Card container */}
      <div className="rounded border bg-white">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search by customer name, ID, type, entity reference, or amount..."
            className="p-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3 border-b">Sl No.</th>
                <th className="p-3 border-b">Entity Reference No</th>
                <th className="p-3 border-b">Customer Name</th>
                <th className="p-3 border-b">Customer ID</th>
                <th className="p-3 border-b">Customer Type</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Created Date</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r: any, idx: number) => (
                <tr key={r.id || idx} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{(page - 1) * 10 + idx + 1}</td>
                  <td className="p-3 border-b">{r.entity_reference || r.entityRefNo || "-"}</td>
                  <td className="p-3 border-b">{r.customer_name || r.customerName || "-"}</td>
                  <td className="p-3 border-b">{r.customer_id || r.customerId || "-"}</td>
                  <td className="p-3 border-b">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {r.customer.customer_type || r.customer.customer_type || "-"}
                    </span>
                  </td>
                  <td className="p-3 border-b">{r.estimated_value ?? "-"}</td>
                  <td className="p-3 border-b">{r.created_at ? new Date(r.created_at).toLocaleDateString() : r.createdDate || "-"}</td>
                  <td className="p-3 border-b">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded border text-xs">✏️</button>
                      <button className="px-2 py-1 rounded border text-xs">🗑️</button>
                      <Link href={`/dashboard/goaml-reporting/${r.id}`} className="px-2 py-1 rounded border text-xs">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-sm text-gray-500" colSpan={8}>No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Footer with pagination */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} entries</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded border text-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt;</button>
            {/* simple numbered pages mimic */}
            <span className="px-2 py-1 rounded bg-blue-600 text-white text-sm">{page}</span>
            <button className="px-2 py-1 rounded border text-sm" disabled={reports.length < 10} onClick={() => setPage(page + 1)}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  )
}