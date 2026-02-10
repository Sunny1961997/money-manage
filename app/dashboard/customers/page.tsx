"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Download, Search, Eye, Building2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState, Fragment } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/store"
import { generateCustomerPDF } from "@/lib/pdf-generator"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [detailsById, setDetailsById] = useState<Record<number, any>>({})
  const { user } = useAuthStore();
  const getRisk = (val: any) => {
  const s = Number(val);
  
  // Handle empty, null, or invalid numbers
  if (val === null || val === undefined || isNaN(s) || s < 1) return { label: "-", color: "bg-gray-100 text-gray-600 border-gray-200" };

  if (s >= 4.0) return { label: "High Risk", color: "bg-red-100 text-red-700 border-red-200" };

  if (s >= 3.0) return { label: "Medium High", color: "bg-orange-100 text-orange-700 border-orange-200" };

  if (s >= 2.0) return { label: "Medium Risk", color: "bg-amber-100 text-amber-700 border-amber-200" };

  if (s >= 1.5) return { label: "Low Medium", color: "bg-blue-100 text-blue-700 border-blue-200" };
  return { label: "Low Risk", color: "bg-green-100 text-green-700 border-green-200" };
};

  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!detailsById[id]) {
      try {
        const res = await fetch(`/api/onboarding/customers/${id}`, { credentials: "include" })
        const json = await res.json()
        if (json.status) {
          setDetailsById(prev => ({ ...prev, [id]: json.data }));
          console.log("[CustomersPage] Fetched details for customer:", json.data);
        }
      } catch {}
    }
  }

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true)
      const res = await fetch(`/api/onboarding/customers?limit=${limit}&offset=${offset}`, { credentials: "include" })
      const json = await res.json()
      if (json.status && json.data) {
        setCustomers(json.data.items)
        setTotal(json.data.total)
      }
      setLoading(false)
    }
    fetchCustomers()
  }, [limit, offset])

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Onboarded Customers</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                All Users
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9 w-80" />
              </div>
              <Select defaultValue="10">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Name</th>
                    <th className="text-left p-4 font-medium text-sm">Country</th>
                    <th className="text-left p-4 font-medium text-sm">Email</th>
                    <th className="text-left p-4 font-medium text-sm">Customer Type</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Created Date</th>
                    <th className="text-left p-4 font-medium text-sm">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    return (
                      <Fragment key={customer.id}>
                        <tr className="border-b hover:bg-slate-50">
                          <td className="p-4">
                            <button className="flex items-center gap-2" type="button" onClick={() => toggleExpand(customer.id)}>
                              <Building2 className="w-4 h-4 text-muted-foreground cursor-pointer" />
                              <span className="font-medium">{customer.name || "-"}</span>
                            </button>
                          </td>
                          <td className="p-4">{customer.country || "-"}</td>
                          <td className="p-4 text-muted-foreground">{customer.email || "-"}</td>
                          <td className="p-4 text-muted-foreground">{customer.customer_type === "individual" ? "Individual" : "Corporate"}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {customer.status}
                            </span>
                          </td>
                          <td className="p-4">{new Date(customer.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {customer.risk_level ? `${customer.risk_level} - Medium Risk` : "-"}
                            </span> */}
                            {customer.risk_level && (
                              <span className={`px-2 py-1 rounded border text-xs font-bold ${getRisk(customer.risk_level).color}`}>
                                {Number(customer.risk_level).toFixed(2)} - {getRisk(customer.risk_level).label} Risk
                              </span>
                            )}
                          </td>
                        </tr>
                        {expandedId === customer.id && (
                          <tr className="bg-white">
                            <td colSpan={7} className="p-4">
                              {detailsById[customer.id] ? (
                                (() => {
                                  const data = detailsById[customer.id]
                                  const isCorporate = data.customer_type === "corporate"
                                  const corp = data.corporate_detail
                                  const indiv = data.individual_detail;
                                  // Aggregate partners/UBOs from multiple possible API keys and flatten
                                  const possiblePersonsArrays = [
                                    data.corporate_detail?.related_persons,
                                    data.corporate_related_persons,
                                    data.corporate_detail?.partners,
                                    data.related_persons,
                                    data.partners,
                                    data.corporate_detail?.ubo_partners,
                                  ].filter((arr: any) => Array.isArray(arr));
                                  const partners = possiblePersonsArrays.reduce((acc: any[], arr: any[]) => acc.concat(arr), [] as any[]);
                                  const partnersCount = partners.length;
                                  const questionAnswers: any[] = Array.isArray(corp?.question_answers) ? corp.question_answers : []
                                  const groupedQA = questionAnswers.reduce((acc: Record<string, any[]>, qa: any) => {
                                    const cat = qa?.question?.category || "Other"
                                    if (!acc[cat]) acc[cat] = []
                                    acc[cat].push(qa)
                                    return acc
                                  }, {})
                                  return (
                                    <div className="border rounded-lg">
                                      <div className="flex items-center justify-end gap-2 p-2">
                                        {user?.role !== "Analyst" && (
                                          <Link href={`/dashboard/onboarding/customer/edit/${customer.id}`}>
                                            <Button variant="outline" size="sm">Edit Information</Button>
                                          </Link>
                                        )}

                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => generateCustomerPDF(data)}
                                        >
                                          Download
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setExpandedId(null)}>Close</Button>
                                      </div>
                                      {isCorporate ? (
                                        <Tabs defaultValue="company-info" className="p-4">
                                          <TabsList>
                                            <TabsTrigger value="company-info">Company Info</TabsTrigger>
                                            <TabsTrigger value="license-info">License Info</TabsTrigger>
                                            <TabsTrigger value="business-details">Business Details</TabsTrigger>
                                            <TabsTrigger value="partners">Partners{partnersCount ? ` (${partnersCount})` : ""}</TabsTrigger>
                                            <TabsTrigger value="documents">Documents</TabsTrigger>
                                            <TabsTrigger value="risk-details">Risk Details</TabsTrigger>
                                            {/* <TabsTrigger value="aml-questionnaires">AML Questionnaires</TabsTrigger> */}
                                            <TabsTrigger value="aml-questionnaire-answers">Compliance questionnaire</TabsTrigger>
                                          </TabsList>
                                          <TabsContent value="company-info">
                                            <div className="grid grid-cols-2 gap-4 mt-4">
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
                                          </TabsContent>
                                          <TabsContent value="license-info">
                                            {isCorporate ? (
                                              <div className="grid grid-cols-2 gap-4 mt-4">
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
                                              <div className="text-sm text-muted-foreground mt-4">No license info for individual customers.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="business-details">
                                            {isCorporate ? (
                                              <div className="grid grid-cols-2 gap-4 mt-4">
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
                                              <div className="text-sm text-muted-foreground mt-4">No business details for individual customers.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="partners">
                                            {Array.isArray(partners) && partners.length > 0 ? (
                                              <div className="space-y-4 mt-4">
                                                {partners.map((p: any, idx: number) => {
                                                  const displayType = p.type || p.person_type || p.entity_type || (p.is_entity ? "Entity" : p.is_individual ? "Individual" : "-");
                                                  const displayName = p.name || [p.first_name, p.last_name].filter(Boolean).join(" ") || p.entity_name || "-";
                                                  const displayNationality = p.nationality || p.country || p.country_of_residence || "-";
                                                  const displayRole = p.role || p.designation || p.relationship || p.position || "-";
                                                  const displayOwnership = (p.ownership_percentage ?? p.share_percentage ?? p.ownership ?? "-");
                                                  const idType = p.id_type || p.identification_type || p.document_type || "-";
                                                  const idNumber = p.id_number || p.id_no || p.identification_number || p.document_number || "-";
                                                  const pepRaw = (p.is_pep ?? p.pep ?? p.politically_exposed_person);
                                                  let displayPep: string | number = pepRaw;
                                                  if (typeof pepRaw === "boolean") {
                                                    displayPep = pepRaw ? "Yes" : "No";
                                                  } else if (typeof pepRaw === "number") {
                                                    displayPep = pepRaw === 1 ? "Yes" : "No";
                                                  } else if (typeof pepRaw === "string") {
                                                    const v = pepRaw.toLowerCase();
                                                    displayPep = ["1", "true", "yes", "y"].includes(v)
                                                      ? "Yes"
                                                      : (["0", "false", "no", "n"].includes(v) ? "No" : pepRaw);
                                                  }
                                                  const dob = p.dob || p.date_of_birth || "-";
                                                  const idIssue = p.id_issue || p.id_issued || p.issue_date || "-";
                                                  const idExpiry = p.id_expiry || p.expiry_date || "-";
                                                  const key = p.id ?? `${displayName}-${displayNationality}-${idx}`;
                                                  return (
                                                    <div key={key} className="grid grid-cols-2 gap-4 border rounded p-3">
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Type</div>
                                                        <div className="mt-1 p-2 border rounded">{displayType}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Name</div>
                                                        <div className="mt-1 p-2 border rounded">{displayName}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Nationality</div>
                                                        <div className="mt-1 p-2 border rounded">{displayNationality}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Role</div>
                                                        <div className="mt-1 p-2 border rounded">{displayRole}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">Ownership %</div>
                                                        <div className="mt-1 p-2 border rounded">{displayOwnership}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Type</div>
                                                        <div className="mt-1 p-2 border rounded">{idType}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Number</div>
                                                        <div className="mt-1 p-2 border rounded">{idNumber}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">PEP</div>
                                                        <div className="mt-1 p-2 border rounded">{displayPep}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">DOB</div>
                                                        <div className="mt-1 p-2 border rounded">{dob}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Issue</div>
                                                        <div className="mt-1 p-2 border rounded">{idIssue}</div>
                                                      </div>
                                                      <div>
                                                        <div className="text-sm text-muted-foreground">ID Expiry</div>
                                                        <div className="mt-1 p-2 border rounded">{idExpiry}</div>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No partners/UBOs available.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="documents">
                                            {Array.isArray(data.documents) && data.documents.length > 0 ? (
                                              <div className="grid grid-cols-2 gap-4 mt-4">
                                                {data.documents.map((doc: any) => (
                                                  <div key={doc.id} className="border rounded p-3">
                                                    <div className="text-sm font-medium mb-2">{doc.file_name}</div>
                                                    <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">View</a>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No documents uploaded.</div>
                                            )}
                                          </TabsContent>
                                          <TabsContent value="risk-details">
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                              <div>
                                                <div className="text-sm text-muted-foreground">Risk Level</div>
                                                <div className="mt-1 p-2 border rounded">{data.risk_level != null ? Number(data.risk_level).toFixed(2) : "-"}</div>
                                              </div>
                                            </div>
                                          </TabsContent>
                                          {/* <TabsContent value="aml-questionnaires">
                                            {questionAnswers.length > 0 ? (
                                              <div className="space-y-4 mt-4">
                                                {Object.entries(groupedQA).map(([category, items]) => (
                                                  <div key={category} className="border rounded p-3">
                                                    <div className="font-medium mb-2">{category}</div>
                                                    <div className="space-y-2">
                                                      {(items as any[])
                                                        .slice()
                                                        .sort((a, b) => (Number(a?.question?.order || 0) - Number(b?.question?.order || 0)))
                                                        .map((qa) => {
                                                          const ans = qa?.answer
                                                          const yesNo = typeof ans === "boolean" ? (ans ? "Yes" : "No") : ans === 1 ? "Yes" : ans === 0 ? "No" : (ans ?? "-")
                                                          const qText = qa?.question?.question || "-"
                                                          return (
                                                            <div key={qa.id || `${qa.compliance_question_id}-${qText}`} className="grid grid-cols-12 gap-3 border rounded p-2">
                                                              <div className="col-span-10 text-sm">{qText}</div>
                                                              <div className="col-span-2 text-sm font-semibold text-right">{yesNo}</div>
                                                            </div>
                                                          )
                                                        })}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No Compliance questionnaire available.</div>
                                            )}
                                          </TabsContent> */}
                                          <TabsContent value="aml-questionnaire-answers">
                                            {Array.isArray(corp?.question_answers) && corp.question_answers.length > 0 ? (
                                              <div className="space-y-4 mt-4">
                                                {Object.entries(
                                                  (corp.question_answers as any[]).reduce((acc: Record<string, any[]>, qa: any) => {
                                                    const cat = qa?.question?.category || "Other"
                                                    if (!acc[cat]) acc[cat] = []
                                                    acc[cat].push(qa)
                                                    return acc
                                                  }, {})
                                                ).map(([category, items]) => (
                                                  <div key={category} className="border rounded p-3">
                                                    <div className="font-medium mb-2">{category}</div>
                                                    <div className="space-y-2">
                                                      {(items as any[])
                                                        .slice()
                                                        .sort((a, b) => Number(a?.question?.order || 0) - Number(b?.question?.order || 0))
                                                        .map((qa) => {
                                                          const ans = qa?.answer
                                                          const yesNo = typeof ans === "boolean" ? (ans ? "Yes" : "No") : ans === 1 ? "Yes" : ans === 0 ? "No" : ans ?? "-"
                                                          const qText = qa?.question?.question || "-"
                                                          return (
                                                            <div key={qa.id || `${qa.compliance_question_id}-${qText}`} className="grid grid-cols-12 gap-3 border rounded p-2">
                                                              <div className="col-span-10 text-sm">{qText}</div>
                                                              <div className="col-span-2 text-sm font-semibold text-right">{yesNo}</div>
                                                            </div>
                                                          )
                                                        })}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground mt-4">No Compliance questionnaire available.</div>
                                            )}
                                          </TabsContent>
                                        </Tabs>
                                      ) : (
                                        <Tabs defaultValue="personal-info" className="p-4">
                                          <TabsList>
                                            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                                            <TabsTrigger value="transaction-details">Transaction Details</TabsTrigger>
                                            <TabsTrigger value="identification-details">Identification Details</TabsTrigger>
                                            <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
                                            <TabsTrigger value="risk-details">Risk Details</TabsTrigger>
                                          </TabsList>
                                          <TabsContent value="personal-info">
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                              <div>
                                                <div className="text-sm text-muted-foreground">Full Name:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv ? `${indiv.first_name} ${indiv.last_name}` : data.name || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Email:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.email || data.email || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Date of Birth:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.dob || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Gender:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.gender || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Nationality:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.nationality || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Country of Residence:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.country_of_residence || indiv?.country || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Address:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.address || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">City:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.city || "-"}</div>
                                              </div>
                                            </div>
                                          </TabsContent>
                                          <TabsContent value="transaction-details">
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                              <div>
                                                <div className="text-sm text-muted-foreground">Occupation:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.occupation || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Source of Income:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.source_of_income || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Purpose of Onboarding:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.purpose_of_onboarding || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Payment Mode:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.payment_mode || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Expected Transactions:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.expected_no_of_transactions || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Expected Volume:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.expected_volume || "-"}</div>
                                              </div>
                                            </div>
                                          </TabsContent>
                                          <TabsContent value="identification-details">
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                              <div>
                                                <div className="text-sm text-muted-foreground">ID Type:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.id_type || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">ID Number:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.id_no || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Issuing Authority:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.issuing_authority || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Issuing Country:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.issuing_country || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Issue Date:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.id_issue_date || "-"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Expiry Date:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.id_expiry_date || "-"}</div>
                                              </div>
                                            </div>
                                          </TabsContent>
                                          <TabsContent value="additional-info">
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                              <div>
                                                <div className="text-sm text-muted-foreground">PEP:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.is_pep ? "Yes" : "No"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Dual Nationality:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.dual_nationality ? "Yes" : "No"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Adverse News:</div>
                                                <div className="mt-1 p-2 border rounded">{indiv?.adverse_news ? "Yes" : "No"}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-muted-foreground">Screening Fuzziness:</div>
                                                <div className="mt-1 p-2 border rounded">{data.screening_fuzziness || "-"}</div>
                                              </div>
                                            </div>
                                          </TabsContent>
                                          <TabsContent value="risk-details">
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                              <div>
                                                <div className="text-sm text-muted-foreground">Risk Level</div>
                                                <div className="mt-1 p-2 border rounded">{data.risk_level != null ? Number(data.risk_level).toFixed(2) : "-"}</div>
                                              </div>
                                            </div>
                                          </TabsContent>
                                        </Tabs>
                                      )}
                                    </div>
                                  )
                                })()
                              ) : (
                                <div className="p-4 text-sm text-muted-foreground">Loading details...</div>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {offset} to {Math.min(offset + limit - 1, total)} of {total} customers
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={offset === 1} onClick={() => setOffset(Math.max(1, offset - limit))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={offset + limit > total} onClick={() => setOffset(offset + limit)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
