"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function CustomerDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCustomer() {
      if (!id) return
      try {
        setLoading(true)
        const res = await fetch(`/api/onboarding/customers/${id}`, { credentials: "include" })
        const json = await res.json()
        if (json.status) {
          setData(json.data)
        } else {
          setError(json.message || "Failed to fetch customer")
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch customer")
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [id])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!data) return <div className="p-6">No data found</div>

  const isCorporate = data.customer_type === "corporate"
  const corp = data.corporate_detail
  const indiv = data.individual_detail

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Customer Details</h1>
        <div className="flex gap-2">
          <Button variant="outline">Edit User</Button>
          <Button variant="outline">Download Details</Button>
        </div>
      </div>

      <Tabs defaultValue="company-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company-info">Company Info</TabsTrigger>
          <TabsTrigger value="license-info">License Info</TabsTrigger>
          <TabsTrigger value="business-details">Business Details</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="risk-details">Risk Details</TabsTrigger>
          <TabsTrigger value="sanction-details">Sanction Details</TabsTrigger>
        </TabsList>

        <TabsContent value="company-info">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Company Name:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (corp?.company_name || data.name || "-") : (indiv ? `${indiv.first_name} ${indiv.last_name}` : data.name || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (data.email || "-") : (indiv?.email || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Company Address:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (corp?.company_address || "-") : (indiv?.address || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">City:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (corp?.city || "-") : (indiv?.city || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Country of Incorporation:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (corp?.country_incorporated || "-") : (indiv?.country || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">PO Box No:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (corp?.po_box || "-") : "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Contact Office No:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (data.contact_office_number || "-") : (indiv?.contact_no || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Contact Mobile No:</div>
                <div className="mt-1 p-2 border rounded">{isCorporate ? (data.contact_mobile_number || "-") : (indiv?.contact_no || "-")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Corporate Status:</div>
                <div className="mt-1 p-2 border rounded">{data.status || "Onboarded"}</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="license-info">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">License Information</h3>
            {isCorporate ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Trade License/CR No:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.trade_license_no || "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Issued At:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.trade_license_issued_at || "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Issued By:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.trade_license_issued_by || "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Issue Date:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.license_issue_date || "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expiry Date:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.license_expiry_date || "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">VAT Registration No:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.vat_registration_no || "-"}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No license info for individual customers.</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="business-details">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Business Details</h3>
            {isCorporate ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Entity Type:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.entity_type || "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Business Activity:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.business_activity || "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Countries of Operation:</div>
                  <div className="mt-1 p-2 border rounded">{Array.isArray(data.country_operations) && data.country_operations.length > 0 ? data.country_operations.join(", ") : "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Account Holding Bank Name:</div>
                  <div className="mt-1 p-2 border rounded">{corp?.account_holding_bank_name || "-"}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No business details for individual customers.</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="partners">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Partners / UBOs</h3>
            {Array.isArray(data.corporate_related_persons) && data.corporate_related_persons.length > 0 ? (
              <div className="space-y-4">
                {data.corporate_related_persons.map((p: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-2 gap-4 border rounded p-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="mt-1 p-2 border rounded">{p.type || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="mt-1 p-2 border rounded">{p.name || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Nationality</div>
                      <div className="mt-1 p-2 border rounded">{p.nationality || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Role</div>
                      <div className="mt-1 p-2 border rounded">{p.role || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ownership %</div>
                      <div className="mt-1 p-2 border rounded">{p.ownership_percentage ?? "-"}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No partners/UBOs available.</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Documents</h3>
            {Array.isArray(data.documents) && data.documents.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {data.documents.map((doc: any) => (
                  <div key={doc.id} className="border rounded p-3">
                    <div className="text-sm font-medium mb-2">{doc.file_name}</div>
                    <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">View</a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No documents uploaded.</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="risk-details">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Risk Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <div className="mt-1 p-2 border rounded">{data.risk_level ?? "-"}</div>
              </div>
              {/* <div>
                <div className="text-sm text-muted-foreground">Screening Fuzziness</div>
                <div className="mt-1 p-2 border rounded">{data.screening_fuzziness || "-"}</div>
              </div> */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sanction-details">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Sanction Details</h3>
            <div className="text-sm text-muted-foreground">No sanction details available.</div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
