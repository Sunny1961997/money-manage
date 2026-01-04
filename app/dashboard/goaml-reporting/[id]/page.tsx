"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ViewGoamlReportPage() {
  const params = useParams()
  const id = params?.id as string
  const [report, setReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Missing report id")
      setLoading(false)
      return
    }
    async function fetchReport() {
      try {
        setLoading(true)
        const res = await fetch(`/api/goaml/reports/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await res.json()
        console.log("Fetched GOAML Report:", json)
        if (json?.status) {
          setReport(json.data.report)
        } else {
          setError(json?.message || "Failed to load report")
        }
      } catch (e: any) {
        setError(e.message || "Failed to load report")
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [id])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }
  if (!report) {
    return <div className="p-6">No report found.</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">View GOAML Report</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border text-sm">Generate XML</button>
          <button className="px-3 py-2 rounded border text-sm">Edit</button>
          <button className="px-3 py-2 rounded border text-sm">Delete</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600">Report ID: {report.id}</div>
        <div className="text-sm text-gray-600">Created: {report.created_at ? new Date(report.created_at).toLocaleDateString() : "-"}</div>
      </div>

      <div className="mb-4 border p-3 rounded">
        <h3 className="font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Customer Type</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.customer_type || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Customer Name</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer_name || report.customer?.name || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Customer ID</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer_id || report.customer?.id || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Contact Office Number</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.contact_office_number || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Company Address</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.corporate_detail?.company_address || report.customer?.company_address || "-"}</div>
          </div>
        </div>
      </div>

      <div className="mb-4 border p-3 rounded">
        <h3 className="font-semibold mb-2">Personal Information (Tenant Details)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">First Name</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.individual_detail?.first_name || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Last Name</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.individual_detail?.last_name || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Passport Country</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.individual_detail?.passport_country || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Nationality</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.individual_detail?.nationality || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Phone Number</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.individual_detail?.phone_number || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Address</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.individual_detail?.address || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Country Code</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.individual_detail?.country_code || "-"}</div>
          </div>
        </div>
      </div>

      <div className="mb-4 border p-3 rounded">
        <h3 className="font-semibold mb-2">Report Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Entity Reference</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.entity_reference || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Transaction Type</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.transaction_type || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Comments</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.comments || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Item Type</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.item_type || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Item Make</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.item_make || "-"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-600">Description</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.description || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Disposed Value</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.disposed_value || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Status Comments</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.status_comments || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Estimated Value</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.estimated_value || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Currency Code</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.currency_code || "-"}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/dashboard/goaml-reporting" className="px-3 py-2 rounded border text-sm">Back to list</Link>
      </div>
    </div>
  )
}
