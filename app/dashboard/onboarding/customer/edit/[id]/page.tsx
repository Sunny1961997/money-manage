"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  User,
  Building2,
  MapPin,
  Phone,
  Globe,
  Award as IdCard,
  Briefcase,
  DollarSign,
  FileText,
  Upload,
  UsersIcon,
  Plus,
  Trash2,
  FileCheck,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CustomerType = "individual" | "corporate"

const occupations = [
  { value: "Employed", label: "Employed" },
  { value: "Self-employed", label: "Self Employed" },
  { value: "Business", label: "Business" },
  { value: "Retired", label: "Retired" },
]
const sourceOfIncome = [
  { value: "Salary", label: "Salary" },
  { value: "Business", label: "Business" },
  { value: "Investment", label: "Investment" },
  { value: "Other", label: "Other" },
]

const idTypes = [
  { value: "Passport", label: "Passport" },
  { value: "EID", label: "EID" },
  { value: "GCC ID", label: "GCC ID" },
  { value: "Govt. Issued ID", label: "Govt. Issued ID" },
  { value: "Commercial License", label: "Commercial License" },
]

const purposes = [
  { value: "Personal Use", label: "Personal Use" },
  { value: "Gift", label: "Gift" },
  { value: "Investment", label: "Investment" },
  { value: "Other", label: "Other" },
]
const paymentMethods = [
  { value: "Cash", label: "Cash" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "Other", label: "Other" },
]
const modeOfApproach = [
  { value: "Walk-In Customer", label: "Walk-In Customer" },
  { value: "Non Face to Face", label: "Non Face to Face" },
  { value: "Other", label: "Other" },
]

const screeningFuzziness = [
  { value: "OFF", label: "OFF" },
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
]

export default function EditCustomerPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const { toast } = useToast()

  const [customerType, setCustomerType] = useState<CustomerType>("individual")
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([])
  const [countryCodes, setCountryCodes] = useState<Array<{ value: string; label: string }>>([])
  const [products, setProducts] = useState<Array<{ value: string; label: string }>>([])
  const [loading, setLoading] = useState(true)
  const [customerData, setCustomerData] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch meta data
        const metaRes = await fetch("/api/onboarding/meta", { credentials: "include" })
        const metaJson = await metaRes.json()
        
        const countryList = metaJson.data.countries.countries.map((c: any) => ({
          value: c.name,
          label: c.name,
          code: c.sortname,
          phoneCode: c.phoneCode,
        }))
        setCountries(countryList)
        setCountryCodes(
          countryList
            .filter((c: any) => c.phoneCode && c.phoneCode !== "+0")
            .map((c: any) => ({
              value: `${c.phoneCode}|${c.code}`,
              label: `${c.phoneCode} (${c.label})`
            }))
        )
        setProducts(
          (metaJson.data.products || []).map((p: any) => ({ value: p.id.toString(), label: p.name }))
        )

        // Fetch customer data
        const customerRes = await fetch(`/api/onboarding/customers/${id}`, { credentials: "include" })
        const customerJson = await customerRes.json()
        
        if (customerJson.status) {
          const customer = customerJson.data
          setCustomerData(customer)
          setCustomerType(customer.customer_type)
        } else {
          toast({
            title: "Error",
            description: "Failed to load customer data",
            // variant: "destructive",
          })
        }
      } catch (e) {
        console.error("Failed to fetch data:", e)
        toast({
          title: "Error",
          description: "Failed to load customer data",
        //   variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchData()
    }
  }, [id])

  if (loading) return <div className="max-w-5xl mx-auto p-6">Loading...</div>

  if (!customerData) return <div className="max-w-5xl mx-auto p-6">Customer not found</div>

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <UsersIcon className="w-5 h-5" />
          <h1 className="text-2xl font-semibold">Edit Customer</h1>
        </div>
      </div>

      {/* Customer Type Display (non-editable) */}
      <div className="mb-8">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-muted-foreground mb-2">Customer Type:</p>
          <div className="flex items-center gap-2">
            {customerType === "individual" ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            <span className="font-semibold">{customerType === "individual" ? "Individual" : "Corporate"}</span>
          </div>
        </div>
      </div>

      {/* Forms */}
      {customerType === "individual" ? (
        <IndividualEditForm 
          countries={countries} 
          countryCodes={countryCodes} 
          occupations={occupations} 
          idTypes={idTypes} 
          products={products} 
          sourceOfIncome={sourceOfIncome}
          customerData={customerData}
          customerId={id}
        />
      ) : (
        <CorporateEditForm 
          countries={countries} 
          countryCodes={countryCodes} 
          occupations={occupations} 
          idTypes={idTypes} 
          products={products}
          customerData={customerData}
          customerId={id}
        />
      )}
    </div>
  )
}

// Individual Edit Form Component (similar to create form but with pre-filled data)
function IndividualEditForm({
  countries,
  countryCodes,
  products,
  occupations,
  sourceOfIncome,
  idTypes,
  customerData,
  customerId,
}: {
  countries: Array<{ value: string; label: string }>
  countryCodes: Array<{ value: string; label: string }>
  products: Array<{ value: string; label: string }>
  occupations: Array<{ value: string; label: string }>
  sourceOfIncome: Array<{ value: string; label: string }>
  idTypes: Array<{ value: string; label: string }>
  customerData: any
  customerId: string
}) {
  const router = useRouter()
  const { toast } = useToast()

  const ind = customerData.individual_detail || {}
  
  // Pre-fill form fields from customerData
  const [firstName, setFirstName] = useState(ind.first_name || "")
  const [lastName, setLastName] = useState(ind.last_name || "")
  const [dob, setDob] = useState(ind.dob || "")
  const [residentialStatus, setResidentialStatus] = useState(ind.residential_status || "resident")
  const [address, setAddress] = useState(ind.address || "")
  const [city, setCity] = useState(ind.city || "")
  const [country, setCountry] = useState(ind.country || "")
  const [nationality, setNationality] = useState(ind.nationality || "")
  const [countryCode, setCountryCode] = useState(ind.country_code || "")
  const [contactNo, setContactNo] = useState(ind.contact_no || "")
  const [email, setEmail] = useState(ind.email || "")
  const [placeOfBirth, setPlaceOfBirth] = useState(ind.place_of_birth || "")
  const [countryOfResidence, setCountryOfResidence] = useState(ind.country_of_residence || "")
  const [dualNationality, setDualNationality] = useState(!!ind.dual_nationality)
  const [adverseNews, setAdverseNews] = useState(!!ind.adverse_news)
  const [gender, setGender] = useState(ind.gender || "")
  const [isPep, setIsPep] = useState(!!ind.is_pep)
  const [occupation, setOccupation] = useState(ind.occupation || "")
  const [sourceIncome, setSourceIncome] = useState(ind.source_of_income || "")
  const [purpose, setPurpose] = useState(ind.purpose_of_onboarding || "")
  const [paymentMethod, setPaymentMethod] = useState(ind.payment_mode || "")
  const [idType, setIdType] = useState(ind.id_type || "")
  const [idNo, setIdNo] = useState(ind.id_no || "")
  const [issuingAuthority, setIssuingAuthority] = useState(ind.issuing_authority || "")
  const [idIssueAtCountry, setIdIssueAtCountry] = useState(ind.issuing_country || "")
  const [idIssueDate, setIdIssueDate] = useState(ind.id_issue_date || "")
  const [idExpiryDate, setIdExpiryDate] = useState(ind.id_expiry_date || "")
  const [productTypes, setProductTypes] = useState<string[]>(
    (customerData.products || []).map((p: any) => p.id.toString())
  )
  const [operationCountries, setOperationCountries] = useState<string[]>(
    (customerData.country_operations || []).map((c: any) => c.country)
  )
  const [approach, setApproach] = useState(ind.mode_of_approach || "")
  const [expectedNoOfTransactions, setExpectedNoOfTransactions] = useState(ind.expected_no_of_transactions?.toString() || "")
  const [expectedVolume, setExpectedVolume] = useState(ind.expected_volume?.toString() || "")
  const [fuzziness, setFuzziness] = useState(customerData.screening_fuzziness || "")
  const [remarks, setRemarks] = useState(customerData.remarks || "")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  const [activeTab, setActiveTab] = useState("personal")

  const handleSingleSelect = (setter: (v: string) => void) => (value: string | string[]) => {
    if (typeof value === "string") setter(value)
  }
  const handleMultiSelect = (setter: (v: string[]) => void) => (value: string | string[]) => {
    if (Array.isArray(value)) setter(value)
  }

  const handleBooleanRadio = (setter: (v: boolean) => void) => (value: string) => {
    setter(value === "yes")
  }

  const handleGenderRadio = (value: string) => setGender(value)
  const handlePepRadio = (value: string) => setIsPep(value === "yes")
  const handleOccupation = handleSingleSelect(setOccupation)
  const handleSourceIncome = handleSingleSelect(setSourceIncome)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const valid = selected.filter(f => f.size <= 2 * 1024 * 1024).slice(0, 5)
    setFiles(valid)
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      customer_type: "individual",
      onboarding_type: "full",
      screening_fuzziness: fuzziness,
      remarks,
      individual_details: {
        first_name: firstName,
        last_name: lastName,
        dob,
        residential_status: residentialStatus,
        address,
        city,
        country,
        nationality,
        country_code: countryCode,
        contact_no: contactNo,
        email,
        place_of_birth: placeOfBirth,
        country_of_residence: countryOfResidence,
        dual_nationality: dualNationality,
        adverse_news: adverseNews,
        gender,
        is_pep: isPep,
        occupation,
        source_of_income: sourceIncome,
        purpose_of_onboarding: purpose,
        payment_mode: paymentMethod,
        mode_of_approach: approach,
        expected_no_of_transactions: expectedNoOfTransactions ? Number(expectedNoOfTransactions) : null,
        expected_volume: expectedVolume ? Number(expectedVolume) : null,
        id_type: idType,
        id_no: idNo,
        issuing_authority: issuingAuthority,
        issuing_country: idIssueAtCountry,
        id_issue_date: idIssueDate,
        id_expiry_date: idExpiryDate,
      },
      products: productTypes,
      country_operations: operationCountries,
    }
    
    console.log("Individual Update Payload:", payload)
    
    const formData = new FormData()
    formData.append("data", JSON.stringify(payload))
    files.forEach((file) => {
      formData.append("documents[]", file)
    })
    
    console.log("FormData entries:", Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name}` : value]))
    
    try {
      const res = await fetch(`/api/onboarding/customers/${customerId}`, {
        method: "POST", // Use POST with _method=PUT for FormData
        credentials: "include",
        body: formData,
      })
      const data = await res.json().catch(async () => ({ message: await res.text() }))

      if (res.ok) {
        const msg = data?.message || "Customer updated successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        const details = data?.errors ? (Object.values(data.errors as Record<string, string[]>).flat().join("; ")) : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({ title: "Update failed", description: errText })
      }
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message || "Network error" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Individual</span>
        <h3 className="text-lg font-semibold">Edit Individual Customer</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur py-3 border-b mb-4">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="personal" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="address" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Address Information
            </TabsTrigger>
            <TabsTrigger value="contact" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Contact Information
            </TabsTrigger>
            <TabsTrigger value="gender-pep" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Gender and PEP Status
            </TabsTrigger>
            <TabsTrigger value="occupation" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Occupation and Income
            </TabsTrigger>
            <TabsTrigger value="financial" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Financial Details
            </TabsTrigger>
            <TabsTrigger value="transactions" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Transactions and ID Details
            </TabsTrigger>
            <TabsTrigger value="identification" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Identification Details
            </TabsTrigger>
            <TabsTrigger value="additional-info" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Additional Information
            </TabsTrigger>
            <TabsTrigger value="documents" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Upload Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Personal Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" placeholder="mm/dd/yyyy" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Residential Status *</Label>
                  <RadioGroup value={residentialStatus} onValueChange={setResidentialStatus} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="resident" id="resident" />
                      <Label htmlFor="resident">Resident</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-resident" id="non-resident" />
                      <Label htmlFor="non-resident">Non-Resident</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Address Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Address *</Label>
                  <Input placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input placeholder="Enter city" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Combobox
                    options={countries}
                    value={country}
                    onValueChange={handleSingleSelect(setCountry)}
                    placeholder="Select a country"
                    searchPlaceholder="Search country..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nationality *</Label>
                  <Combobox
                    options={countries}
                    value={nationality}
                    onValueChange={handleSingleSelect(setNationality)}
                    placeholder="Select a nationality"
                    searchPlaceholder="Search nationality..."
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Contact Information</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Country Code *</Label>
                  <Combobox
                    options={countryCodes}
                    value={countryCode}
                    onValueChange={handleSingleSelect(setCountryCode)}
                    placeholder="Select"
                    searchPlaceholder="Search code..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact No *</Label>
                  <Input placeholder="Enter contact number" value={contactNo} onChange={e => setContactNo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gender-pep" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Gender and PEP Status</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup value={gender} onValueChange={handleGenderRadio} className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Politically Exposed Person (PEP)? *</Label>
                  <RadioGroup value={isPep ? "yes" : "no"} onValueChange={handlePepRadio} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pep-yes" />
                      <Label htmlFor="pep-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pep-no" />
                      <Label htmlFor="pep-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="occupation" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Occupation and Income</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Occupation *</Label>
                  <Combobox
                    options={occupations}
                    value={occupation}
                    onValueChange={handleOccupation}
                    placeholder="Select an occupation"
                    searchPlaceholder="Search occupation..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source of Income *</Label>
                  <Combobox
                    options={sourceOfIncome}
                    value={sourceIncome}
                    onValueChange={handleSourceIncome}
                    placeholder="Select a source"
                    searchPlaceholder="Search source..."
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Financial Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purpose *</Label>
                  <Combobox
                    options={purposes}
                    value={purpose}
                    onValueChange={handleSingleSelect(setPurpose)}
                    placeholder="Select a purpose"
                    searchPlaceholder="Search purpose..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Mode *</Label>
                  <Combobox
                    options={paymentMethods}
                    value={paymentMethod}
                    onValueChange={handleSingleSelect(setPaymentMethod)}
                    placeholder="Select a payment mode"
                    searchPlaceholder="Search mode..."
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Transactions and ID Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Type *</Label>
                  <Combobox
                    options={products}
                    value={productTypes}
                    onValueChange={handleMultiSelect(setProductTypes)}
                    multiple
                    placeholder="Select product type"
                    searchPlaceholder="Search type..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mode of Approach *</Label>
                  <Combobox
                    options={modeOfApproach}
                    value={approach}
                    onValueChange={handleSingleSelect(setApproach)}
                    placeholder="Select mode of approach"
                    searchPlaceholder="Search approach..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected No of Transactions</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={expectedNoOfTransactions}
                    onChange={(e) => setExpectedNoOfTransactions(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Volume</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="identification" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <IdCard className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Identification Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID Type *</Label>
                  <Combobox
                    options={idTypes}
                    value={idType}
                    onValueChange={handleSingleSelect(setIdType)}
                    placeholder="Select an ID type"
                    searchPlaceholder="Search type..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID No*</Label>
                  <Input placeholder="Enter ID number" value={idNo} onChange={e => setIdNo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>ID Issued By *</Label>
                  <Input placeholder="Enter issuing authority" value={issuingAuthority} onChange={e => setIssuingAuthority(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>ID Issued At *</Label>
                  <Combobox
                    options={countries}
                    value={idIssueAtCountry}
                    onValueChange={handleSingleSelect(setIdIssueAtCountry)}
                    placeholder="Select a country"
                    searchPlaceholder="Search country..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID Issued Date *</Label>
                  <Input type="date" placeholder="mm/dd/yyyy" value={idIssueDate} onChange={e => setIdIssueDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>ID Expiry Date *</Label>
                  <Input type="date" placeholder="mm/dd/yyyy" value={idExpiryDate} onChange={e => setIdExpiryDate(e.target.value)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="additional-info" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Additional Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Place of Birth *</Label>
                  <Combobox
                    options={countries}
                    value={placeOfBirth}
                    onValueChange={handleSingleSelect(setPlaceOfBirth)}
                    placeholder="Select a country"
                    searchPlaceholder="Search country..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country of Residence *</Label>
                  <Combobox
                    options={countries}
                    value={countryOfResidence}
                    onValueChange={handleSingleSelect(setCountryOfResidence)}
                    placeholder="Select a country"
                    searchPlaceholder="Search country..."
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Dual Nationality *</Label>
                  <RadioGroup value={dualNationality ? "yes" : "no"} onValueChange={handleBooleanRadio(setDualNationality)} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="dual-yes" />
                      <Label htmlFor="dual-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="dual-no" />
                      <Label htmlFor="dual-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Is Customer Facing any adverse event? *</Label>
                  <p className="text-xs text-blue-600 mb-2">We don't Check adverse news feed</p>
                  <RadioGroup value={adverseNews ? "yes" : "no"} onValueChange={handleBooleanRadio(setAdverseNews)} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="adverse-yes" />
                      <Label htmlFor="adverse-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="adverse-no" />
                      <Label htmlFor="adverse-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Screening Fuzziness *</Label>
                  <Combobox
                    options={screeningFuzziness}
                    value={fuzziness}
                    onValueChange={handleSingleSelect(setFuzziness)}
                    placeholder="Select fuzziness level"
                    searchPlaceholder="Search fuzziness..."
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Remarks</Label>
                  <Textarea placeholder="Enter any remarks" rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Upload Documents</h4>
              </div>
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer"
                onClick={openFilePicker}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-blue-600 mb-1">Add Documents</p>
                <p className="text-xs text-muted-foreground">Max 5 files, each up to 2MB (Images, PDFs, Docs)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,.txt,.gif,.bmp,.tiff,.svg,.webp,.heic"
                  onChange={handleFileChange}
                  className="mt-2 hidden"
                />
                <div className="mt-2 flex flex-col items-center gap-1">
                  {files.map((file, idx) => (
                    <span key={idx} className="text-xs text-gray-700">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur py-4 border-t mt-6">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">Update Customer</Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}

// Corporate Edit Form Component (similar structure)
function CorporateEditForm({
  countries,
  countryCodes,
  products,
  occupations,
  idTypes,
  customerData,
  customerId,
}: {
  countries: Array<{ value: string; label: string }>
  countryCodes: Array<{ value: string; label: string }>
  products: Array<{ value: string; label: string }>
  occupations: Array<{ value: string; label: string }>
  idTypes: Array<{ value: string; label: string }>
  customerData: any
  customerId: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  
  const corp = customerData.corporate_detail || {}
  
  // Pre-fill corporate fields
  const [companyName, setCompanyName] = useState(corp.company_name || "")
  const [companyAddress, setCompanyAddress] = useState(corp.company_address || "")
  const [city, setCity] = useState(corp.city || "")
  const [countryIncorporated, setCountryIncorporated] = useState(corp.country_incorporated || "")
  const [poBox, setPoBox] = useState(corp.po_box || "")
  const [customerType, setCustomerType] = useState(corp.customer_type || "")
  const [officeCountryCode, setOfficeCountryCode] = useState(corp.office_country_code || "")
  const [officeNo, setOfficeNo] = useState(corp.office_no || "")
  const [mobileCountryCode, setMobileCountryCode] = useState(corp.mobile_country_code || "")
  const [mobileNo, setMobileNo] = useState(corp.mobile_no || "")
  const [email, setEmail] = useState(corp.email || "")
  const [tradeLicenseNo, setTradeLicenseNo] = useState(corp.trade_license_no || "")
  const [tradeLicenseIssuedAt, setTradeLicenseIssuedAt] = useState(corp.trade_license_issued_at || "")
  const [tradeLicenseIssuedBy, setTradeLicenseIssuedBy] = useState(corp.trade_license_issued_by || "")
  const [licenseIssueDate, setLicenseIssueDate] = useState(corp.license_issue_date || "")
  const [licenseExpiryDate, setLicenseExpiryDate] = useState(corp.license_expiry_date || "")
  const [vatRegistrationNo, setVatRegistrationNo] = useState(corp.vat_registration_no || "")
  const [tenancyContractExpiryDate, setTenancyContractExpiryDate] = useState(corp.tenancy_contract_expiry_date || "")
  const [entityType, setEntityType] = useState(corp.entity_type || "")
  const [countriesOfOperation, setCountriesOfOperation] = useState<string[]>(
    (customerData.country_operations || []).map((c: any) => c.country)
  )
  const [businessActivity, setBusinessActivity] = useState(corp.business_activity || "")
  const [isImportExport, setIsImportExport] = useState(!!corp.is_entity_dealting_with_import_export)
  const [hasSisterConcern, setHasSisterConcern] = useState(!!corp.has_sister_concern)
  const [accountHoldingBankName, setAccountHoldingBankName] = useState(corp.account_holding_bank_name || "")
  
  const [productSource, setProductSource] = useState(corp.product_source || "")
  const [paymentMode, setPaymentMode] = useState(corp.payment_mode || "")
  const [deliveryChannel, setDeliveryChannel] = useState(corp.delivery_channel || "")
  const [expectedNoOfTransactions, setExpectedNoOfTransactions] = useState(corp.expected_no_of_transactions?.toString() || "")
  const [expectedVolume, setExpectedVolume] = useState(corp.expected_volume?.toString() || "")
  const [dualUseGoods, setDualUseGoods] = useState(!!corp.dual_use_goods)
  const [kycDocumentsCollected, setKycDocumentsCollected] = useState(!!corp.kyc_documents_collected_with_form)
  const [isRegisteredInGoaml, setIsRegisteredInGoaml] = useState(!!corp.is_entity_registered_in_GOAML)
  const [hasAdverseNews, setHasAdverseNews] = useState(!!corp.is_entity_having_adverse_news)
  
  // Dropdown options matching create form
  const entity_types = [
    { value: "LLC", label: "LLC" },
    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "Govt. Entity", label: "Govt. Entity" },
    { value: "FZE", label: "FZE" },
    { value: "FZCO", label: "FZCO" },
    { value: "Private Limited", label: "Private Limited" },
    { value: "Public Limited", label: "Public Limited" },
  ]
  const business_activities = [
    { value: "Accounting/Auditing Firm", label: "Accounting/Auditing Firm" },
    { value: "Bank/Financial Institute", label: "Bank/Financial Institute" },
    { value: "DPMS - Retail Store", label: "DPMS - Retail Store" },
    { value: "DPMS - Bullion Wholesale", label: "DPMS - Bullion Wholesale" },
    { value: "DPMS - Mining, Refining", label: "DPMS - Mining, Refining" },
    { value: "DPMS- Factory, Workshop, Goldsmith", label: "DPMS- Factory, Workshop, Goldsmith" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "General Trading", label: "General Trading" },
    { value: "Education", label: "Education" },
    { value: "Other", label: "Other" },
  ]
  const product_sources = [
    { value: "B2B - Inside UAE", label: "B2B - Inside UAE" },
    { value: "B2C - Inside UAE", label: "B2C - Inside UAE" },
    { value: "B2B - Outside UAE", label: "B2B - Outside UAE" },
    { value: "Individual HRC", label: "Individual HRC" },
    { value: "Individual Non-HRC", label: "Individual Non-HRC" },
    { value: "B2B - Outside & Outside UAE", label: "B2B - Outside & Outside UAE" },
  ]
  const payment_modes = [
    { value: "Cash", label: "Cash" },
    { value: "Debit/Credit Card-Cardholder name verified", label: "Debit/Credit Card-Cardholder name verified" },
    { value: "Bank Transfer-Inside UAE", label: "Bank Transfer-Inside UAE" },
    { value: "Bank Transfer-Outisde UAE", label: "Bank Transfer-Outisde UAE" },
    { value: "Parial Cash/Card/Online trs", label: "Parial Cash/Card/Online trs" },
    { value: "Old Gold Exchange", label: "Old Gold Exchange" },
    { value: "Cross Border Payment From HRC", label: "Cross Border Payment From HRC" },
    { value: "Others", label: "Others" },
  ]
  const delivery_channels = [
    { value: "Face to Face", label: "Face to Face" },
    { value: "Non Face to Face", label: "Non Face to Face" },
  ]
  const roles = [
    { value: "UBO", label: "UBO" },
    { value: "SHARE HOLDER", label: "SHARE HOLDER" },
    { value: "PARTNER", label: "PARTNER" },
    { value: "DIRECTOR", label: "DIRECTOR" },
    { value: "MANAGER", label: "MANAGER" },
    { value: "REPRESENTATIVE", label: "REPRESENTATIVE" },
  ]
  
  const [productTypes, setProductTypes] = useState<string[]>(
    (customerData.products || []).map((p: any) => p.id.toString())
  )
  const [operationCountries, setOperationCountries] = useState<string[]>(
    (customerData.country_operations || []).map((c: any) => c.country)
  )
  const [fuzziness, setFuzziness] = useState(customerData.screening_fuzziness || "")
  const [remarks, setRemarks] = useState(customerData.remarks || "")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Related persons
  const [relatedPersons, setRelatedPersons] = useState<any[]>(
    (corp.related_persons || []).map((rp: any) => ({
      type: rp.type || "individual",
      name: rp.name || "",
      is_pep: !!rp.is_pep,
      nationality: rp.nationality || "",
      id_type: rp.id_type || "",
      id_no: rp.id_no || "",
      id_issue_date: rp.id_issue_date || "",
      id_expiry_date: rp.id_expiry_date || "",
      dob: rp.dob || "",
      role: rp.role || "",
      ownership_percentage: rp.ownership_percentage || "",
    }))
  )
  
  const [activeTab, setActiveTab] = useState("company")

  const handleSingleSelect = (setter: (v: string) => void) => (value: string | string[]) => {
    if (typeof value === "string") setter(value)
  }
  const handleMultiSelect = (setter: (v: string[]) => void) => (value: string | string[]) => {
    if (Array.isArray(value)) setter(value)
  }

  const handleBooleanRadio = (setter: (v: boolean) => void) => (value: string) => {
    setter(value === "yes")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const valid = selected.filter(f => f.size <= 2 * 1024 * 1024).slice(0, 5)
    setFiles(valid)
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const addRelatedPerson = () => {
    setRelatedPersons([
      ...relatedPersons,
      {
        type: "individual",
        name: "",
        is_pep: false,
        nationality: "",
        id_type: "",
        id_no: "",
        id_issue_date: "",
        id_expiry_date: "",
        dob: "",
        role: "",
        ownership_percentage: "",
      },
    ])
  }

  const removeRelatedPerson = (index: number) => {
    setRelatedPersons(relatedPersons.filter((_, i) => i !== index))
  }

  const updateRelatedPerson = (index: number, field: string, value: any) => {
    const updated = [...relatedPersons]
    updated[index] = { ...updated[index], [field]: value }
    setRelatedPersons(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      customer_type: "corporate",
      onboarding_type: "full",
      screening_fuzziness: fuzziness,
      remarks,
      corporate_details: {
        company_name: companyName,
        company_address: companyAddress,
        city,
        country_incorporated: countryIncorporated,
        po_box: poBox,
        customer_type: customerType,
        office_country_code: officeCountryCode,
        office_no: officeNo,
        mobile_country_code: mobileCountryCode,
        mobile_no: mobileNo,
        email,
        trade_license_no: tradeLicenseNo,
        trade_license_issued_at: tradeLicenseIssuedAt,
        trade_license_issued_by: tradeLicenseIssuedBy,
        license_issue_date: licenseIssueDate,
        license_expiry_date: licenseExpiryDate,
        vat_registration_no: vatRegistrationNo,
        tenancy_contract_expiry_date: tenancyContractExpiryDate,
        entity_type: entityType,
        business_activity: businessActivity,
        is_entity_dealting_with_import_export: isImportExport,
        has_sister_concern: hasSisterConcern,
        account_holding_bank_name: accountHoldingBankName,
        product_source: productSource,
        payment_mode: paymentMode,
        delivery_channel: deliveryChannel,
        expected_no_of_transactions: expectedNoOfTransactions ? Number(expectedNoOfTransactions) : null,
        expected_volume: expectedVolume ? Number(expectedVolume) : null,
        dual_use_goods: dualUseGoods,
        kyc_documents_collected_with_form: kycDocumentsCollected,
        is_entity_registered_in_GOAML: isRegisteredInGoaml,
        is_entity_having_adverse_news: hasAdverseNews,
      },
      corporate_related_persons: relatedPersons,
      products: productTypes,
      country_operations: operationCountries,
    }
    
    console.log("Corporate Update Payload:", payload)
    
    const formData = new FormData()
    formData.append("data", JSON.stringify(payload))
    files.forEach((file) => {
      formData.append("documents[]", file)
    })
    
    console.log("FormData entries:", Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name}` : value]))
    
    try {
      const res = await fetch(`/api/onboarding/customers/${customerId}`, {
        method: "POST", // Use POST with _method=PUT for FormData
        credentials: "include",
        body: formData,
      })
      const data = await res.json().catch(async () => ({ message: await res.text() }))

      if (res.ok) {
        const msg = data?.message || "Customer updated successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        const details = data?.errors ? (Object.values(data.errors as Record<string, string[]>).flat().join("; ")) : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({ title: "Update failed", description: errText })
      }
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message || "Network error" })
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Corporate</span>
        <h3 className="text-lg font-semibold">Edit Corporate Customer</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur py-3 border-b mb-4">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="company" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Company Information
            </TabsTrigger>
            <TabsTrigger value="contact" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Contact Information
            </TabsTrigger>
            <TabsTrigger value="identity" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Identity Information
            </TabsTrigger>
            <TabsTrigger value="operations" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Operations Information
            </TabsTrigger>
            <TabsTrigger value="product" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Product Details
            </TabsTrigger>
            <TabsTrigger value="aml" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              AML Compliance
            </TabsTrigger>
            <TabsTrigger value="related" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Partner/Representative
            </TabsTrigger>
            <TabsTrigger value="documents" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Upload Documents
            </TabsTrigger>
            <TabsTrigger value="additional" className="px-4 py-2 rounded-md border-2xl bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Additional Information
            </TabsTrigger>
          </TabsList>
        </div>

        <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>

          {/* Company Info Tab */}
          <TabsContent value="company" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="companyAddress">Company Address *</Label>
                  <Input
                    id="companyAddress"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Enter company address"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="countryIncorporated">Country Incorporated *</Label>
                  <Combobox
                    options={countries}
                    value={countryIncorporated}
                    onValueChange={handleSingleSelect(setCountryIncorporated)}
                    placeholder="Select country"
                    searchPlaceholder="Search country..."
                  />
                </div>
                <div>
                  <Label htmlFor="poBox">P.O. Box</Label>
                  <Input
                    id="poBox"
                    value={poBox}
                    onChange={(e) => setPoBox(e.target.value)}
                    placeholder="Enter P.O. Box"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="customerType">Customer Type</Label>
                  <Input
                    id="customerType"
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    placeholder="Enter customer type"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="officeCountryCode">Office Country Code</Label>
                  <Combobox
                    options={countryCodes}
                    value={officeCountryCode}
                    onValueChange={handleSingleSelect(setOfficeCountryCode)}
                    placeholder="Select code"
                    searchPlaceholder="Search code..."
                  />
                </div>
                <div>
                  <Label htmlFor="officeNo">Office Number</Label>
                  <Input
                    id="officeNo"
                    value={officeNo}
                    onChange={(e) => setOfficeNo(e.target.value)}
                    placeholder="Enter office number"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="mobileCountryCode">Mobile Country Code</Label>
                  <Combobox
                    options={countryCodes}
                    value={mobileCountryCode}
                    onValueChange={handleSingleSelect(setMobileCountryCode)}
                    placeholder="Select code"
                    searchPlaceholder="Search code..."
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNo">Mobile Number</Label>
                  <Input
                    id="mobileNo"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="Enter mobile number"
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Identity Information Tab */}
          <TabsContent value="identity" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tradeLicenseNo">Trade License Number</Label>
                  <Input
                    id="tradeLicenseNo"
                    value={tradeLicenseNo}
                    onChange={(e) => setTradeLicenseNo(e.target.value)}
                    placeholder="Enter trade license number"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="tradeLicenseIssuedAt">Trade License Issued At</Label>
                  <Input
                    id="tradeLicenseIssuedAt"
                    value={tradeLicenseIssuedAt}
                    onChange={(e) => setTradeLicenseIssuedAt(e.target.value)}
                    placeholder="Enter issuing location"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="tradeLicenseIssuedBy">Trade License Issued By</Label>
                  <Input
                    id="tradeLicenseIssuedBy"
                    value={tradeLicenseIssuedBy}
                    onChange={(e) => setTradeLicenseIssuedBy(e.target.value)}
                    placeholder="Enter issuing authority"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseIssueDate">License Issue Date</Label>
                  <Input
                    id="licenseIssueDate"
                    type="date"
                    value={licenseIssueDate}
                    onChange={(e) => setLicenseIssueDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                  <Input
                    id="licenseExpiryDate"
                    type="date"
                    value={licenseExpiryDate}
                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="vatRegistrationNo">VAT Registration Number</Label>
                  <Input
                    id="vatRegistrationNo"
                    value={vatRegistrationNo}
                    onChange={(e) => setVatRegistrationNo(e.target.value)}
                    placeholder="Enter VAT registration number"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="tenancyContractExpiryDate">Tenancy Contract Expiry Date</Label>
                  <Input
                    id="tenancyContractExpiryDate"
                    type="date"
                    value={tenancyContractExpiryDate}
                    onChange={(e) => setTenancyContractExpiryDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Operations Information Tab */}
          <TabsContent value="operations" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entityType">Entity Type *</Label>
                  <Combobox
                    options={entity_types}
                    value={entityType}
                    onValueChange={handleSingleSelect(setEntityType)}
                    placeholder="Select entity type"
                    searchPlaceholder="Search type..."
                  />
                </div>
                <div>
                  <Label htmlFor="countriesOfOperation">Countries of Operation *</Label>
                  <Combobox
                    options={countries}
                    value={operationCountries}
                    onValueChange={handleMultiSelect(setOperationCountries)}
                    multiple
                    placeholder="Select a country"
                    searchPlaceholder="Search country..."
                  />
                </div>
                <div>
                  <Label htmlFor="businessActivity">Business Activity *</Label>
                  <Combobox
                    options={business_activities}
                    value={businessActivity}
                    onValueChange={handleSingleSelect(setBusinessActivity)}
                    placeholder="Select business activity"
                    searchPlaceholder="Search business activity..."
                  />
                </div>
                <div>
                  <Label>Is entity dealing with Import/Export? *</Label>
                  <RadioGroup value={isImportExport ? "yes" : "no"} onValueChange={handleBooleanRadio(setIsImportExport)} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="import-yes" />
                      <Label htmlFor="import-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="import-no" />
                      <Label htmlFor="import-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="col-span-2">
                  <Label>Any other sister concern/branch? *</Label>
                  <RadioGroup value={hasSisterConcern ? "yes" : "no"} onValueChange={handleBooleanRadio(setHasSisterConcern)} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sister-yes" />
                      <Label htmlFor="sister-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sister-no" />
                      <Label htmlFor="sister-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="accountHoldingBankName">Account Holding Bank Name *</Label>
                  <Input
                    id="accountHoldingBankName"
                    value={accountHoldingBankName}
                    onChange={(e) => setAccountHoldingBankName(e.target.value)}
                    placeholder="Enter bank name (max 50 characters)"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Product Details Tab */}
          <TabsContent value="product" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productTypes">Product Type *</Label>
                  <Combobox
                    options={products}
                    value={productTypes}
                    onValueChange={handleMultiSelect(setProductTypes)}
                    multiple
                    placeholder="Select Product Type"
                    searchPlaceholder="Search type..."
                  />
                </div>
                <div>
                  <Label htmlFor="productSource">Product Source *</Label>
                  <Combobox
                    options={product_sources}
                    value={productSource}
                    onValueChange={handleSingleSelect(setProductSource)}
                    placeholder="Select product source"
                    searchPlaceholder="Search source..."
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMode">Payment Mode *</Label>
                  <Combobox
                    options={payment_modes}
                    value={paymentMode}
                    onValueChange={handleSingleSelect(setPaymentMode)}
                    placeholder="Select payment mode"
                    searchPlaceholder="Search mode..."
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryChannel">Delivery Channel *</Label>
                  <Combobox
                    options={delivery_channels}
                    value={deliveryChannel}
                    onValueChange={handleSingleSelect(setDeliveryChannel)}
                    placeholder="Select delivery channel"
                    searchPlaceholder="Search channel..."
                  />
                </div>
                <div>
                  <Label htmlFor="expectedNoOfTransactions">Expected No of Transactions</Label>
                  <Input
                    id="expectedNoOfTransactions"
                    type="number"
                    placeholder="0"
                    value={expectedNoOfTransactions}
                    onChange={(e) => setExpectedNoOfTransactions(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="expectedVolume">Expected Volume</Label>
                  <Input
                    id="expectedVolume"
                    type="number"
                    placeholder="0"
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Deal with Goods? *</Label>
                  <RadioGroup value={dualUseGoods ? "yes" : "no"} onValueChange={handleBooleanRadio(setDualUseGoods)} className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="goods-yes" />
                      <Label htmlFor="goods-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="goods-no" />
                      <Label htmlFor="goods-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* AML Compliance Tab */}
          <TabsContent value="aml" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>KYC Documents Collected</Label>
                  <RadioGroup value={kycDocumentsCollected ? "yes" : "no"} onValueChange={handleBooleanRadio(setKycDocumentsCollected)} className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="kyc-yes" />
                      <Label htmlFor="kyc-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="kyc-no" />
                      <Label htmlFor="kyc-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Registered in GOAML</Label>
                  <RadioGroup value={isRegisteredInGoaml ? "yes" : "no"} onValueChange={handleBooleanRadio(setIsRegisteredInGoaml)} className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="goaml-yes" />
                      <Label htmlFor="goaml-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="goaml-no" />
                      <Label htmlFor="goaml-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Adverse News</Label>
                  <RadioGroup value={hasAdverseNews ? "yes" : "no"} onValueChange={handleBooleanRadio(setHasAdverseNews)} className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="adverse-yes" />
                      <Label htmlFor="adverse-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="adverse-no" />
                      <Label htmlFor="adverse-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Partner/Representative Tab */}
          <TabsContent value="related" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Label>Partner/Representative/Authorized Person Details</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRelatedPerson}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Representative
                </Button>
              </div>
              
              {relatedPersons.map((person, index) => (
                <Card key={index} className="p-4 mb-4 bg-slate-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      UBO {index + 1}
                    </h4>
                    {relatedPersons.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRelatedPerson(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Type *</Label>
                      <Combobox
                        options={[
                          { value: "Individual", label: "Individual" },
                          { value: "Entity", label: "Entity" },
                        ]}
                        value={person.type}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "type", v)}
                        placeholder="Select type"
                        searchPlaceholder="Search type..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Name *</Label>
                      <Input
                        value={person.name}
                        onChange={(e) => updateRelatedPerson(index, "name", e.target.value)}
                        placeholder="Enter Name"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Previously Exposed Person (PEP)? *</Label>
                      <RadioGroup 
                        value={person.is_pep ? "yes" : "no"} 
                        onValueChange={(v) => updateRelatedPerson(index, "is_pep", v === "yes")} 
                        className="flex gap-6 mt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`pep-yes-${index}`} />
                          <Label htmlFor={`pep-yes-${index}`} className="font-normal cursor-pointer text-xs">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`pep-no-${index}`} />
                          <Label htmlFor={`pep-no-${index}`} className="font-normal cursor-pointer text-xs">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-xs">Nationality</Label>
                      <Combobox
                        options={countries}
                        value={person.nationality}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "nationality", v)}
                        placeholder="Select nationality"
                        searchPlaceholder="Search nationality..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">ID Type *</Label>
                      <Combobox
                        options={idTypes}
                        value={person.id_type}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "id_type", v)}
                        placeholder="Passport"
                        searchPlaceholder="Search type..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">ID No/License No *</Label>
                      <Input
                        value={person.id_no}
                        onChange={(e) => updateRelatedPerson(index, "id_no", e.target.value)}
                        placeholder="Enter ID License No"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">ID Issue Date *</Label>
                      <Input
                        type="date"
                        placeholder="mm/dd/yyyy"
                        value={person.id_issue_date}
                        onChange={(e) => updateRelatedPerson(index, "id_issue_date", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">ID Expiry Date *</Label>
                      <Input
                        type="date"
                        placeholder="mm/dd/yyyy"
                        value={person.id_expiry_date}
                        onChange={(e) => updateRelatedPerson(index, "id_expiry_date", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Date of Birth *</Label>
                      <Input
                        type="date"
                        placeholder="mm/dd/yyyy"
                        value={person.dob}
                        onChange={(e) => updateRelatedPerson(index, "dob", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Role *</Label>
                      <Combobox
                        options={roles}
                        value={person.role}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "role", v)}
                        placeholder="UBO"
                        searchPlaceholder="Search role..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Percentage of Share *</Label>
                      <Input
                        value={person.ownership_percentage}
                        onChange={(e) => updateRelatedPerson(index, "ownership_percentage", e.target.value)}
                        placeholder="Enter Percentage (0-100)"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </Card>
          </TabsContent>

          {/* Additional Information Tab */}
          <TabsContent value="additional" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuzziness">Screening Fuzziness</Label>
                  <Combobox
                    options={screeningFuzziness}
                    value={fuzziness}
                    onValueChange={handleSingleSelect(setFuzziness)}
                    placeholder="Select fuzziness"
                    searchPlaceholder="Search fuzziness..."
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter any additional remarks"
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <Label>Upload Documents</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <Button type="button" variant="outline" onClick={openFilePicker} className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((f, i) => (
                        <div key={i} className="text-sm text-muted-foreground">{f.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur py-4 border-t mt-6">
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push("/dashboard/customers")}
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" type="submit">
                Update Customer
              </Button>
            </div>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
