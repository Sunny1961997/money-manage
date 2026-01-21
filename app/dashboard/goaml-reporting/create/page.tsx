// app/dashboard/goaml-reporting/create.tsx
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

export default function CreateGoamlReportPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerType, setCustomerType] = useState("all")
  const [formData, setFormData] = useState({
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
  const { toast } = useToast()

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

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      // alert("Please select a customer")
      toast({
        title: "Required fields missing",
        description: `Please select a customer`,
      })
      return
    }

    if (!selectedCustomer.id) {
      toast({
        title: "Error",
        description: "Customer ID is missing. Please re-select the customer.",
      })
      return
    }

    try {
      const payload = {
        customer_id: Number(selectedCustomer.id),
        ...formData,
      }
      console.log("Submitting payload:", payload)

      const res = await fetch("/api/goaml/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      
      if (json?.status) {
        router.refresh()
        router.push("/dashboard/goaml-reporting")
      } else {
        const errorDetails = JSON.parse(json.error);
        console.log("GOAML Report Creation Response:", errorDetails.message);
        toast({
          title: errorDetails.message,
          description: errorDetails.error || "Failed to create report",
        })
      }
    } catch (error) {
      console.error("Failed to submit report", error)
      toast({
        title: "Error",
        description: "An error occurred while submitting the report",
      })
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create GOAML Report</h2>

      {/* Customer Selection */}
      {/* <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="mb-4">
          <label>Customer Type</label>
          <select
            className="border p-2 rounded w-full"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </select>

          <label>Pick Customer</label>
          <select
            className="border p-2 rounded w-full"
            onChange={async (e) => {
              const id = e.target.value
              console.log("Selected customer ID:", id)
              if (!id) {
                setSelectedCustomer(null)
                return
              }
              try {
                const res = await fetch(`/api/onboarding/customers/${id}`)
                const json = await res.json()
                if (json?.status) {
                  const customerData = json.data
                  // Ensure id is present in the customer data
                  if (!customerData.id) {
                    customerData.id = parseInt(id)
                  }
                  setSelectedCustomer(customerData)
                }
              } catch (error) {
                console.error("Failed to fetch customer details", error)
              }
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
      </div> */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* First Column: Customer Type */}
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

        {/* Second Column: Pick Customer */}
        <div>
          <label className="block mb-1">Pick Customer</label>
          <select
            className="border p-2 rounded w-full"
            onChange={async (e) => {
              const id = e.target.value;
              if (!id) {
                setSelectedCustomer(null);
                return;
              }
              try {
                const res = await fetch(`/api/onboarding/customers/${id}`);
                const json = await res.json();
                if (json?.status) {
                  const customerData = json.data;
                  if (!customerData.id) {
                    customerData.id = parseInt(id);
                  }
                  setSelectedCustomer(customerData);
                }
              } catch (error) {
                console.error("Failed to fetch customer details", error);
              }
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
              <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedCustomer.corporate_detail?.company_name || selectedCustomer.name || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trade License Number</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedCustomer.corporate_detail?.trade_license_number || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Office Number</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedCustomer.contact_office_number || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Address</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedCustomer.corporate_detail?.company_address || selectedCustomer.company_address || "-"}</div>
            </div>
          </div>
          
          {selectedCustomer.individual_detail && (
             <div className="mt-4">
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedCustomer.individual_detail.first_name}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedCustomer.individual_detail.last_name}</div>
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
                <input className="border p-2 rounded w-full" value={formData.entity_reference} onChange={(e) => setFormData({ ...formData, entity_reference: e.target.value })} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select className="border p-2 rounded w-full" value={formData.transaction_type} onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}>
                    <option value="">Select a transaction type</option>
                    <option value="sale">Sale</option>
                    <option value="purchase">Purchase</option>
                </select>
            </div>
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <input className="border p-2 rounded w-full" value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Make</label>
                <input className="border p-2 rounded w-full" value={formData.item_make} onChange={(e) => setFormData({ ...formData, item_make: e.target.value })} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                <select className="border p-2 rounded w-full" value={formData.item_type} onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}>
                    <option value="">Select an item type</option>
                    <option value="new">New</option>
                    <option value="old">Old</option>
                </select>
            </div>
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="border p-2 rounded w-full" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disposed Value</label>
                <input type="number" className="border p-2 rounded w-full" value={formData.disposed_value} onChange={(e) => setFormData({ ...formData, disposed_value: e.target.value })} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Comments</label>
                <input className="border p-2 rounded w-full" value={formData.status_comments} onChange={(e) => setFormData({ ...formData, status_comments: e.target.value })} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                <input type="number" className="border p-2 rounded w-full" value={formData.estimated_value} onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                <select className="border p-2 rounded w-full" value={formData.currency_code} onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}>
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

      <button className="px-3 py-2 rounded bg-blue-600 text-white text-sm" onClick={handleSubmit}>Submit</button>
    </div>
  )
}