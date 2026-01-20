"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Customer {
  id: number
  name: string
  customer_type: string
  contact_office_number?: string
  company_address?: string
  individual_detail?: {
    id: number
    customer_id: number
    first_name: string
    last_name: string
  }
  corporate_detail?: {
    id: number
    customer_id: number
    company_name: string
    trade_license_number: string
    company_address: string
  }
}

interface Country {
  id: number
  name: string
  currency: string
}

export default function EditGoamlReportPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerType, setCustomerType] = useState("all")
  const [formData, setFormData] = useState({
    customer_id: "",
    entity_reference: "",
    transaction_type: "",
    comments: "",
    item_type: "",
    item_make: "",
    description: "",
    disposed_value: "",
    status_comments: "",
    estimated_value: "",
    currency_code: "",
  })

  // Fetch existing report data
  useEffect(() => {
    if (!id) return

    async function fetchReport() {
      try {
        const res = await fetch(`/api/goaml/reports/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await res.json()
        console.log("Fetched GOAML Report:", json)

        if (json?.status) {
          const report = json.data.report
          setFormData({
            customer_id: report.customer_id?.toString() || "",
            entity_reference: report.entity_reference || "",
            transaction_type: report.transaction_type || "",
            comments: report.comments || "",
            item_type: report.item_type || "",
            item_make: report.item_make || "",
            description: report.description || "",
            disposed_value: report.disposed_value || "",
            status_comments: report.status_comments || "",
            estimated_value: report.estimated_value || "",
            currency_code: report.currency_code || "",
          })

          // Fetch customer details
          if (report.customer_id) {
            fetchCustomerDetails(report.customer_id)
          }
        } else {
          toast({
            title: "Error",
            description: json?.message || "Failed to load report",
            // variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch report", error)
        toast({
          title: "Error",
          description: "Failed to load report",
        //   variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [id])

  // Fetch metadata (countries)
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await fetch("/api/goaml/meta", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await res.json()
        if (json?.status) {
          setCountries(json.data?.countries?.countries || [])
        }
      } catch (error) {
        console.error("Failed to fetch metadata", error)
      }
    }
    fetchMetadata()
  }, [])

  // Fetch customers list
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch(`/api/onboarding/short-data-customers?customer_type=${customerType}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        const json = await res.json()
        if (json?.status) {
          setCustomers(json.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch customers", error)
      }
    }
    fetchCustomers()
  }, [customerType])

  // Fetch customer details
  const fetchCustomerDetails = async (customerId: number) => {
    try {
      const res = await fetch(`/api/onboarding/customers/${customerId}`)
      const json = await res.json()
      if (json?.status) {
        const customerData = json.data
        if (!customerData.id) {
          customerData.id = customerId
        }
        setSelectedCustomer(customerData)
      }
    } catch (error) {
      console.error("Failed to fetch customer details", error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.customer_id) {
      toast({
        title: "Required fields missing",
        description: "Please select a customer",
      })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        customer_id: Number(formData.customer_id),
        entity_reference: formData.entity_reference,
        transaction_type: formData.transaction_type,
        comments: formData.comments,
        item_type: formData.item_type,
        item_make: formData.item_make,
        description: formData.description,
        disposed_value: formData.disposed_value,
        status_comments: formData.status_comments,
        estimated_value: formData.estimated_value,
        currency_code: formData.currency_code,
      }
      console.log("Updating payload:", payload)

      const res = await fetch(`/api/goaml/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json?.status) {
        toast({
          title: "Success",
          description: json.message || "Report updated successfully",
        })
        router.push("/dashboard/goaml-reporting")
      } else {
        toast({
          title: "Error",
          description: json?.message || "Failed to update report",
        //   variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update report", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the report",
        // variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit GOAML Report</h2>

      {/* Customer Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Customer Type</label>
          <select
            className="border p-2 rounded w-full"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Pick Customer</label>
          <select
            className="border p-2 rounded w-full"
            value={formData.customer_id}
            onChange={async (e) => {
              const customerId = e.target.value
              setFormData({ ...formData, customer_id: customerId })
              if (!customerId) {
                setSelectedCustomer(null)
                return
              }
              await fetchCustomerDetails(parseInt(customerId))
            }}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Customer Details */}
      {selectedCustomer && (
        <div className="mb-4 border p-3 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border">
                {selectedCustomer.corporate_detail?.company_name || selectedCustomer.name || "-"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trade License Number</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border">
                {selectedCustomer.corporate_detail?.trade_license_number || "-"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Office Number</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border">
                {selectedCustomer.contact_office_number || "-"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Address</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border">
                {selectedCustomer.corporate_detail?.company_address || selectedCustomer.company_address || "-"}
              </div>
            </div>
          </div>

          {selectedCustomer.individual_detail && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {selectedCustomer.individual_detail.first_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {selectedCustomer.individual_detail.last_name}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GOAML Report Details */}
      <div className="mb-4 border p-3 rounded">
        <h3 className="font-semibold mb-4">GOAML Report Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Reference</label>
            <input
              className="border p-2 rounded w-full"
              value={formData.entity_reference}
              onChange={(e) => setFormData({ ...formData, entity_reference: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              className="border p-2 rounded w-full"
              value={formData.transaction_type}
              onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
            >
              <option value="">Select a transaction type</option>
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
          <input
            className="border p-2 rounded w-full"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Make</label>
            <input
              className="border p-2 rounded w-full"
              value={formData.item_make}
              onChange={(e) => setFormData({ ...formData, item_make: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
            <select
              className="border p-2 rounded w-full"
              value={formData.item_type}
              onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
            >
              <option value="">Select an item type</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="border p-2 rounded w-full"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disposed Value</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={formData.disposed_value}
              onChange={(e) => setFormData({ ...formData, disposed_value: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Comments</label>
            <input
              className="border p-2 rounded w-full"
              value={formData.status_comments}
              onChange={(e) => setFormData({ ...formData, status_comments: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={formData.estimated_value}
              onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
            <select
              className="border p-2 rounded w-full"
              value={formData.currency_code}
              onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}
            >
              <option value="">Select currency code...</option>
              {countries.map((country) => (
                <option key={country.id} value={country.currency}>
                  {country.currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Updating..." : "Update Report"}
        </button>
        <button
          className="px-3 py-2 rounded border text-sm"
          onClick={() => router.push("/dashboard/goaml-reporting")}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
