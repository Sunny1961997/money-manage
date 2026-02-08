"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { buildGoamlXml, downloadXml, buildGoamlXmlFilename } from "./goamlXml"
import { useAuthStore } from "@/lib/store"

export default function ViewGoamlReportPage() {
  const params = useParams()
  const id = params?.id as string
  const [report, setReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [xmlBusy, setXmlBusy] = useState(false)
  const { user } = useAuthStore()

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

  const xmlFilename = useMemo(() => {
    return buildGoamlXmlFilename(report, id)
  }, [report, id])

  const onGenerateXml = () => {
    if (!report) return
    setXmlBusy(true)
    try {
      const xml = buildGoamlXml(report)
      downloadXml(xmlFilename, xml)
    } finally {
      setXmlBusy(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }
  if (!report) {
    return <div className="p-6">No report found.</div>
  }

  const customerType = report.customer?.customer_type
  const isCorporate = customerType === "corporate"
  const isIndividual = customerType === "individual"
  const indiv = report.customer?.individual_detail
  const corp = report.customer?.corporate_detail
  const products = Array.isArray(report.customer?.products) ? report.customer.products : []

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">View GOAML Report</h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded border text-sm disabled:opacity-60"
            onClick={onGenerateXml}
            disabled={xmlBusy}
          >
            {xmlBusy ? "Generating..." : "Generate XML"}
          </button>
          {user?.role !== "Analyst" && (
            <>
              <Link href={`/dashboard/goaml-reporting/edit/${id}`}>
                <button className="px-3 py-2 rounded border text-sm">Edit</button>
              </Link>
              <button className="px-3 py-2 rounded border text-sm text-red-600">Delete</button>
            </>
          )}
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
            <div className="mt-1 p-2 bg-gray-50 rounded border">{customerType || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Customer Name</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">
              {report.customer_name || (isCorporate ? corp?.company_name : `${indiv?.first_name || ""} ${indiv?.last_name || ""}`.trim()) || report.customer?.name || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Customer ID</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer_id || report.customer?.id || "-"}</div>
          </div>
          {/* <div>
            <div className="text-sm text-gray-600">Contact Office Number</div>
            <div className="mt-1 p-2 bg-gray-50 rounded border">{report.customer?.contact_office_number || "-"}</div>
          </div> */}

          {isCorporate && (
            <>
              <div>
                <div className="text-sm text-gray-600">Company Address</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.company_address || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Company Email</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.email || report.customer?.email || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">City</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.city || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Country of Incorporation</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.country_incorporated || "-"}</div>
              </div>
            </>
          )}

          {isIndividual && (
            <>
              <div>
                <div className="text-sm text-gray-600">Contact Number</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">
                  {indiv?.contact_no ? `${indiv?.country_code || ""} ${indiv?.contact_no}`.trim() : "-"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.email || report.customer?.email || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.address || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Country of Residence</div>
                <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.country_of_residence || "-"}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 border p-3 rounded">
        <h3 className="font-semibold mb-2">Products</h3>
        {products.length > 0 ? (
          <div className="space-y-2">
            {products.map((p: any) => (
              <div key={p.id || p.sku || p.name} className="p-2 bg-gray-50 rounded border">
                <div className="font-medium text-sm">{p?.name || "-"}</div>
                <div className="text-xs text-gray-600">SKU: {p?.sku || "-"}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No products found.</div>
        )}
      </div>

      {isIndividual && (
        <div className="mb-4 border p-3 rounded">
          <h3 className="font-semibold mb-2">Personal Information (Tenant Details)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">First Name</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.first_name || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Last Name</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.last_name || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Date of Birth</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.dob || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Gender</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.gender || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Residential Status</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.residential_status || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Nationality</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.nationality || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Place of Birth</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.place_of_birth || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Country of Residence</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.country_of_residence || "-"}</div>
            </div>

            <div className="col-span-2">
              <div className="text-sm text-gray-600">Address</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.address || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">City</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.city || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Country</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.country || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Contact Number</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">
                {indiv?.contact_no ? `${indiv?.country_code || ""} ${indiv?.contact_no}`.trim() : "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.email || report.customer?.email || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Dual Nationality</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.dual_nationality ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Adverse News</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.adverse_news ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">PEP</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.is_pep ? "Yes" : "No"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Occupation</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.occupation || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Source of Income</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.source_of_income || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Purpose of Onboarding</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.purpose_of_onboarding || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Payment Mode</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.payment_mode || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Expected No. of Transactions</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.expected_no_of_transactions ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Expected Volume</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.expected_volume ?? "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Mode of Approach</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.mode_of_approach || "-"}</div>
            </div>
          </div>
        </div>
      )}

      {isIndividual && (
        <div className="mb-4 border p-3 rounded">
          <h3 className="font-semibold mb-2">Identification Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">ID Type</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.id_type || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">ID Number</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.id_no || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Issuing Authority</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.issuing_authority || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Issuing Country</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.issuing_country || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">ID Issue Date</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.id_issue_date || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">ID Expiry Date</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{indiv?.id_expiry_date || "-"}</div>
            </div>
          </div>
        </div>
      )}

      {isCorporate && (
        <div className="mb-4 border p-3 rounded">
          <h3 className="font-semibold mb-2">Company Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Company Name</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.company_name || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Entity Type</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.entity_type || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Customer Type</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.customer_type || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Business Activity</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.business_activity || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Company Address</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.company_address || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">PO Box</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.po_box || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">City</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.city || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Country of Incorporation</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.country_incorporated || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.email || report.customer?.email || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Office Contact</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">
                {corp?.office_no ? `${corp?.office_country_code || ""} ${corp?.office_no}`.trim() : "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Mobile Contact</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">
                {corp?.mobile_no ? `${corp?.mobile_country_code || ""} ${corp?.mobile_no}`.trim() : "-"}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Trade License No</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.trade_license_no || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Trade License Issued At</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.trade_license_issued_at || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Trade License Issued By</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.trade_license_issued_by || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">License Issue Date</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.license_issue_date || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">License Expiry Date</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.license_expiry_date || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">VAT Registration No</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.vat_registration_no || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Tenancy Contract Expiry</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.tenancy_contract_expiry_date || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Account Holding Bank Name</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.account_holding_bank_name || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Product Source</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.product_source || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Payment Mode</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.payment_mode || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Delivery Channel</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.delivery_channel || "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Expected No. of Transactions</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.expected_no_of_transactions ?? "-"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Expected Volume</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.expected_volume ?? "-"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Import/Export</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.is_entity_dealting_with_import_export ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Has Sister Concern</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.has_sister_concern ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Dual Use Goods</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.dual_use_goods ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">KYC Documents Collected With Form</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.kyc_documents_collected_with_form ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Registered in GOAML</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.is_entity_registered_in_GOAML ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Adverse News</div>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{corp?.is_entity_having_adverse_news ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      )}

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