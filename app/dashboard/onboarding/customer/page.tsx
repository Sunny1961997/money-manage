"use client"

import { useState, useEffect, useRef } from "react"
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
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

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

export default function CustomerOnboardingPage() {
  const [customerType, setCustomerType] = useState<CustomerType>("individual")
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([])
  const [countryCodes, setCountryCodes] = useState<Array<{ value: string; label: string }>>([])
  const [products, setProducts] = useState<Array<{ value: string; label: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("/api/onboarding/meta", { credentials: "include" })
        const json = await res.json()
        console.log("Onboarding meta data:", json);
        const countryList = json.data.countries.countries.map((c: any) => ({
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
          (json.data.products || []).map((p: any) => ({ value: p.id.toString(), label: p.name }))
        )
      } catch (e) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchMeta()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <UsersIcon className="w-5 h-5" />
          <h1 className="text-2xl font-semibold">Customer Onboarding</h1>
        </div>
      </div>

      {/* Choose Customer Type */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center mb-2">Choose Customer Type</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Selected: {customerType === "individual" ? "Individual" : "Corporate"}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          <button
            onClick={() => setCustomerType("individual")}
            className={`p-6 rounded-lg border-2 transition-all ${
              customerType === "individual" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <User className="w-6 h-6 mb-2" />
            <div className="font-semibold">Individual</div>
            <div className="text-sm text-muted-foreground">For personal customers or sole proprietors.</div>
          </button>

          <button
            onClick={() => setCustomerType("corporate")}
            className={`p-6 rounded-lg border-2 transition-all ${
              customerType === "corporate" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Building2 className="w-6 h-6 mb-2" />
            <div className="font-semibold">Corporate</div>
            <div className="text-sm text-muted-foreground">For businesses, organizations, or entities.</div>
          </button>
        </div>
      </div>

      {/* Forms */}
      {customerType === "individual" ? (
        <IndividualForm countries={countries} countryCodes={countryCodes} occupations={occupations} idTypes={idTypes} products={products} sourceOfIncome={sourceOfIncome} />
      ) : (
        <CorporateForm countries={countries} countryCodes={countryCodes} occupations={occupations} idTypes={idTypes} products={products} />
      )}
    </div>
  )
}

function IndividualForm({
  countries,
  countryCodes,
  products,
  occupations,
  sourceOfIncome,
  idTypes,
}: {
  countries: Array<{ value: string; label: string }>
  countryCodes: Array<{ value: string; label: string }>
  products: Array<{ value: string; label: string }>
  occupations: Array<{ value: string; label: string }>
  sourceOfIncome: Array<{ value: string; label: string }>
  idTypes: Array<{ value: string; label: string }>
}) {
  // Main fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dob, setDob] = useState("")
  const [residentialStatus, setResidentialStatus] = useState("resident")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [nationality, setNationality] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [email, setEmail] = useState("")
  // Additional
  const [placeOfBirth, setPlaceOfBirth] = useState("")
  const [countryOfResidence, setCountryOfResidence] = useState("")
  const [dualNationality, setDualNationality] = useState(false)
  const [adverseNews, setAdverseNews] = useState(false)
  const [gender, setGender] = useState("")
  const [isPep, setIsPep] = useState(false)
  // Occupation & Financial
  const [occupation, setOccupation] = useState("")
  const [sourceIncome, setSourceIncome] = useState("")
  const [purpose, setPurpose] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  // ID Details
  const [idType, setIdType] = useState("")
  const [idNo, setIdNo] = useState("")
  const [issuingAuthority, setIssuingAuthority] = useState("")
  const [idIssueAtCountry, setIdIssueAtCountry] = useState("")
  const [idIssueDate, setIdIssueDate] = useState("")
  const [idExpiryDate, setIdExpiryDate] = useState("")
  // Product/Operations
  const [productTypes, setProductTypes] = useState<string[]>([])
  const [operationCountries, setOperationCountries] = useState<string[]>([])
  const [approach, setApproach] = useState("")
  // Screening & remarks
  const [fuzziness, setFuzziness] = useState("")
  const [remarks, setRemarks] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  // Handlers for single/multi select
  const handleSingleSelect = (setter: (v: string) => void) => (value: string | string[]) => {
    if (typeof value === "string") setter(value)
  }
  const handleMultiSelect = (setter: (v: string[]) => void) => (value: string | string[]) => {
    if (Array.isArray(value)) setter(value)
  }

  // Handler for boolean radio
  const handleBooleanRadio = (setter: (v: boolean) => void) => (value: string) => {
    setter(value === "yes")
  }

  // Handler for gender radio
  const handleGenderRadio = (value: string) => setGender(value)

  // Handler for PEP radio
  const handlePepRadio = (value: string) => setIsPep(value === "yes")

  // Handler for occupation/source combobox
  const handleOccupation = handleSingleSelect(setOccupation)
  const handleSourceIncome = handleSingleSelect(setSourceIncome)

  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    // Only allow up to 5 files, each max 2MB
    const valid = selected.filter(f => f.size <= 2 * 1024 * 1024).slice(0, 5)
    setFiles(valid)
  }

  const openFilePicker = () => fileInputRef.current?.click()

  // Submit handler
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
    const formData = new FormData()
    formData.append("data", JSON.stringify(payload))
    files.forEach((file, idx) => {
      formData.append("documents[]", file)
    })
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await res.json().catch(async () => ({ message: await res.text() }))
      if (res.ok) {
        const msg = data?.message || "Onboarding submitted successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        const details = data?.errors ? (Object.values(data.errors as Record<string, string[]>).flat().join("; ")) : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({ title: "Onboarding failed", description: errText, variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "Onboarding failed", description: err?.message || "Network error", variant: "destructive" })
    }
  }

  return (
    <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Individual</span>
        <h3 className="text-lg font-semibold">New Individual Registration</h3>
      </div>

      {/* Personal Information */}
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

      {/* Address Information */}
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

      {/* Contact Information */}
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
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Additional Information */}
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
        </div>
      </Card>

      {/* Gender and PEP Status */}
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

      {/* Occupation and Income */}
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

      {/* Financial Details */}
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

      {/* Transactions and ID Details */}
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
            <Input type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Expected Volume</Label>
            <Input type="number" placeholder="0" />
          </div>
        </div>
      </Card>

      {/* Identification Details */}
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

      {/* Additional Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Additional Information</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Screening Fuzziness *</Label>
            <Combobox
              options={screeningFuzziness}
              value={fuzziness}
              onValueChange={handleSingleSelect(setFuzziness)}
              placeholder="Select fuzziness level"
              searchPlaceholder="Search fuzziness..."
            />
          </div>
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Enter any remarks" rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Upload Documents */}
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
            data-testid="file-input"
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">Submit Registration</Button>
    </form>
  )
}

function CorporateForm({
  countries,
  countryCodes,
  products,
  occupations,
  idTypes,
}: {
  countries: Array<{ value: string; label: string }>
  countryCodes: Array<{ value: string; label: string }>
  products: Array<{ value: string; label: string }>
  occupations: Array<{ value: string; label: string }>
  idTypes: Array<{ value: string; label: string }>
}) {
  const [ubos, setUbos] = useState([
    { id: 1, idType: "", role: "", type: "", name: "", isPep: false, nationality: "", idNo: "", idIssue: "", idExpiry: "", dob: "", ownershipPercentage: "" }
  ])
  const [corpFiles, setCorpFiles] = useState<File[]>([])
  const corpFileInputRef = useRef<HTMLInputElement | null>(null)

  const addUBO = () => {
    setUbos([...ubos, { id: ubos.length + 1, idType: "", role: "", type: "", name: "", isPep: false, nationality: "", idNo: "", idIssue: "", idExpiry: "", dob: "", ownershipPercentage: "" }])
  }

  const removeUBO = (id: number) => {
    setUbos(ubos.filter((ubo) => ubo.id !== id))
  }

  const setUboField = (
    id: number,
    field: "idType" | "role" | "type" | "name" | "isPep" | "nationality" | "idNo" | "idIssue" | "idExpiry" | "dob" | "ownershipPercentage",
    value: string | boolean
  ) => {
    setUbos((prev) => prev.map(u => u.id === id ? { ...u, [field]: value } : u))
  }

  const corporate_customer_type = [
    { value: "Supplier", label: "Supplier" },
    { value: "Buyer", label: "Buyer" },
    { value: "Buyer and Supplier", label: "Buyer and Supplier" },
    { value: "Other", label: "Other" },
  ]
  const licance_issue_authorities = [
    { value: "Government of UAE", label: "Government of UAE" },
    { value: "Government Authority", label: "Government Authority" },
    { value: "DED Dubai", label: "DED Dubai" },
    { value: "DED Abu Dhabi", label: "DED Abu Dhabi" },
    { value: "DED Ajman", label: "DED Ajman" },
    { value: "DED Ras Al Khaimah", label: "DED Ras Al Khaimah" },
    { value: "DED Sharjah", label: "DED Sharjah" },
    { value: "DED Umm Al Quwain", label: "DED Umm Al Quwain" },
    { value: "DED Fujairah", label: "DED Fujairah" },
    { value: "DED Al Ain", label: "DED Al Ain" },
    { value: "DMCC", label: "DMCC" },
    { value: "DIFC", label: "DIFC" },
    { value: "JAFZA", label: "JAFZA" },
    { value: "IFZA", label: "IFZA" },
    { value: "Saif Zone", label: "Saif Zone" },
    { value: "Ajman Free Zone", label: "Ajman Free Zone" },
  ]
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
  const screeningFuzziness = [
    { value: "OFF", label: "OFF" },
    { value: "Level 1", label: "Level 1" },
    { value: "Level 2", label: "Level 2" },
  ]

  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [city, setCity] = useState("")
  const [poBox, setPoBox] = useState("")
  const [officeNo, setOfficeNo] = useState("")
  const [mobileNo, setMobileNo] = useState("")
  const [email, setEmail] = useState("")
  const [tradeLicenseNo, setTradeLicenseNo] = useState("")
  const [licenseIssueDate, setLicenseIssueDate] = useState("")
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("")
  const [vatRegistrationNo, setVatRegistrationNo] = useState("")
  const [tenancyContractExpiryDate, setTenancyContractExpiryDate] = useState("")
  const [expectedNoOfTransactions, setExpectedNoOfTransactions] = useState<string>("")
  const [expectedVolume, setExpectedVolume] = useState<string>("")
  const [isImportExport, setIsImportExport] = useState(false)
  const [dealWithGoods, setDealWithGoods] = useState(false)
  const [kycCollected, setKycCollected] = useState(false)
  const [isRegisteredGoAML, setIsRegisteredGoAML] = useState(false)
  const [isAdverseNews, setIsAdverseNews] = useState(false)

  const [companyCountry, setCompanyCountry] = useState("")
  const [corporateCustomerType, setCorporateCustomerType] = useState("")
  const [officeCountryCode, setOfficeCountryCode] = useState("")
  const [mobileCountryCode, setMobileCountryCode] = useState("")
  const [tradeLicenseIssuedAt, setTradeLicenseIssuedAt] = useState("")
  const [tradeLicenseIssuedBy, setTradeLicenseIssuedBy] = useState("")
  const [entityType, setEntityType] = useState("")
  const [countriesOfOperation, setCountriesOfOperation] = useState<string[]>([])
  const [businessActivity, setBusinessActivity] = useState("")
  const [productSource, setProductSource] = useState("")
  const [paymentMode, setPaymentMode] = useState("")
  const [deliveryChannel, setDeliveryChannel] = useState("")
  const [corpFuzziness, setCorpFuzziness] = useState("")
  const [corpRemarks, setCorpRemarks] = useState("")
  const [hasSisterConcern, setHasSisterConcern] = useState(false)
  const [productTypesCorp, setProductTypesCorp] = useState<string[]>([])
  const [accountHoldingBankName, setAccountHoldingBankName] = useState("")

  const handleSingleSelect = (setter: (v: string) => void) => (value: string | string[]) => {
    if (typeof value === "string") setter(value)
  }
  const handleMultiSelect = (setter: (v: string[]) => void) => (value: string | string[]) => {
    if (Array.isArray(value)) setter(value)
  }
  const handleCorpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    // Max 5 files, each up to 5MB
    const valid = selected.filter(f => f.size <= 5 * 1024 * 1024).slice(0, 5)
    setCorpFiles(valid)
  }

  const openCorpFilePicker = () => corpFileInputRef.current?.click()

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = {
      customer_type: "corporate",
      onboarding_type: "full",
      screening_fuzziness: corpFuzziness,
      remarks: corpRemarks,
      corporate_details: {
        company_name: companyName,
        company_address: companyAddress,
        city,
        country_incorporated: companyCountry,
        po_box: poBox,
        customer_type: corporateCustomerType,
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
        dual_use_goods: dealWithGoods,
        kyc_documents_collected_with_form: kycCollected,
        is_entity_registered_in_GOAML: isRegisteredGoAML,
        is_entity_having_adverse_news: isAdverseNews,
      },
      products: productTypesCorp.map(id => Number(id)),
      country_operations: countriesOfOperation,
      corporate_related_persons: ubos.map(u => ({
        type: u.type,
        name: u.name,
        is_pep: !!u.isPep,
        nationality: u.nationality,
        id_type: u.idType,
        id_no: u.idNo,
        id_issue: u.idIssue || null,
        id_expiry: u.idExpiry || null,
        dob: u.dob || null,
        role: u.role,
        ownership_percentage: u.ownershipPercentage ? Number(u.ownershipPercentage) : null,
      })),
    }

    try {
      const formData = new FormData()
      formData.append("data", JSON.stringify(payload))
      corpFiles.forEach((file) => formData.append("documents[]", file))
      const res = await fetch("/api/onboarding", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await res.json().catch(async () => ({ message: await res.text() }))
      console.log("After calling onboarding api response", res.status, data.message)
      // toast({ title: "Onboarding failed", description: data.message })

      if (res.ok) {
        const msg = data?.message || "Onboarding submitted successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        const details = data?.errors ? (Object.values(data.errors as Record<string, string[]>).flat().join("; ")) : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({ title: "Onboarding failed", description: data.message })
      }
    } catch (err: any) {
      toast({ title: "Onboarding failed", description: err?.message || "Network error"})
    }
  }

  return (
    <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Corporate</span>
        <h3 className="text-lg font-semibold">New Corporate Registration</h3>
      </div>

      {/* Company Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Company Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input placeholder="Enter the Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Company Address *</Label>
            <Input placeholder="Enter the Company address" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>City *</Label>
            <Input placeholder="Enter the city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Country of Incorporation *</Label>
            <Combobox
              options={countries}
              value={companyCountry}
              onValueChange={handleSingleSelect(setCompanyCountry)}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>PO Box No *</Label>
            <Input placeholder="Enter the PO Box No" value={poBox} onChange={e => setPoBox(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Customer Type *</Label>
            <Combobox
              options={corporate_customer_type}
              value={corporateCustomerType}
              onValueChange={handleSingleSelect(setCorporateCustomerType)}
              placeholder="Select Customer Type"
              searchPlaceholder="Search type..."
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Contact Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Country Code *</Label>
              <Combobox
                options={countryCodes}
                value={officeCountryCode}
                onValueChange={handleSingleSelect(setOfficeCountryCode)}
                placeholder="Select"
                searchPlaceholder="Search code..."
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Office No</Label>
              <Input placeholder="Enter the Contact Office No" value={officeNo} onChange={e => setOfficeNo(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Country Code *</Label>
              <Combobox
                options={countryCodes}
                value={mobileCountryCode}
                onValueChange={handleSingleSelect(setMobileCountryCode)}
                placeholder="Select"
                searchPlaceholder="Search code..."
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Mobile No *</Label>
              <Input placeholder="Enter the Contact Mobile No" value={mobileNo} onChange={e => setMobileNo(e.target.value)} />
            </div>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email (abc@dom.com)" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Identity Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <IdCard className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Identity Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Trade License/CR No *</Label>
            <Input placeholder="Enter Trade License/CR No" value={tradeLicenseNo} onChange={e => setTradeLicenseNo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Trade License/CR Issued At *</Label>
            <Combobox
              options={countries}
              value={tradeLicenseIssuedAt}
              onValueChange={handleSingleSelect(setTradeLicenseIssuedAt)}
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>Trade License/COI Issued By *</Label>
            <Combobox
              options={licance_issue_authorities}
              value={tradeLicenseIssuedBy}
              onValueChange={handleSingleSelect(setTradeLicenseIssuedBy)}
              placeholder="Select a issuing authority"
              searchPlaceholder="Search issuing authority..."
            />
          </div>
          <div className="space-y-2">
            <Label>Trade License/CR Issued Date *</Label>
            <Input type="date" placeholder="mm/dd/yyyy" value={licenseIssueDate} onChange={e => setLicenseIssueDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Trade License/CR Expiry Date</Label>
            <Input type="date" placeholder="mm/dd/yyyy" value={licenseExpiryDate} onChange={e => setLicenseExpiryDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>VAT Registration Number</Label>
            <Input placeholder="Enter VAT Registration Number" value={vatRegistrationNo} onChange={e => setVatRegistrationNo(e.target.value)} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Tenancy Contract Expiry Date</Label>
            <Input type="date" placeholder="mm/dd/yyyy" value={tenancyContractExpiryDate} onChange={e => setTenancyContractExpiryDate(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Operations Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Operations Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Entity Type *</Label>
            <Combobox
              options={entity_types}
              value={entityType}
              onValueChange={handleSingleSelect(setEntityType)}
              placeholder="Select entity type"
              searchPlaceholder="Search type..."
            />
          </div>
          <div className="space-y-2">
            <Label>Countries of Operation *</Label>
            <Combobox
              options={countries}
              value={countriesOfOperation}
              onValueChange={handleMultiSelect(setCountriesOfOperation)}
              multiple
              placeholder="Select a country"
              searchPlaceholder="Search country..."
            />
          </div>
          <div className="space-y-2">
            <Label>Business Activity *</Label>
            <Combobox
              options={business_activities}
              value={businessActivity}
              onValueChange={handleSingleSelect(setBusinessActivity)}
              placeholder="Select business activity"
              searchPlaceholder="Search business activity..."
            />
          </div>
          <div className="space-y-2">
            <Label>Is entity dealing with Import/Export? *</Label>
            <RadioGroup value={isImportExport ? "yes" : "no"} onValueChange={(v) => setIsImportExport(v === "yes")} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="import-yes" />
                <Label htmlFor="import-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="import-no" />
                <Label htmlFor="import-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Any other sister concern/branch? *</Label>
            <RadioGroup value={hasSisterConcern ? "yes" : "no"} onValueChange={(v) => setHasSisterConcern(v === "yes")} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sister-yes" />
                <Label htmlFor="sister-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sister-no" />
                <Label htmlFor="sister-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Account Holding Bank Name *</Label>
            <Input placeholder="Enter bank name (max 50 characters)" value={accountHoldingBankName} onChange={e => setAccountHoldingBankName(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Product Details */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Product Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product Type *</Label>
            <Combobox
              options={products}
              value={productTypesCorp}
              onValueChange={handleMultiSelect(setProductTypesCorp)}
              multiple
              placeholder="Select Product Type"
              searchPlaceholder="Search type..."
            />
          </div>
          <div className="space-y-2">
            <Label>Product Source *</Label>
            <Combobox
              options={product_sources}
              value={productSource}
              onValueChange={handleSingleSelect(setProductSource)}
              placeholder="Select product source"
              searchPlaceholder="Search source..."
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Mode *</Label>
            <Combobox
              options={payment_modes}
              value={paymentMode}
              onValueChange={handleSingleSelect(setPaymentMode)}
              placeholder="Select payment mode"
              searchPlaceholder="Search mode..."
            />
          </div>
          <div className="space-y-2">
            <Label>Delivery Channel *</Label>
            <Combobox
              options={delivery_channels}
              value={deliveryChannel}
              onValueChange={handleSingleSelect(setDeliveryChannel)}
              placeholder="Select delivery channel"
              searchPlaceholder="Search channel..."
            />
          </div>
          <div className="space-y-2">
            <Label>Expected No of Transactions</Label>
            <Input type="number" placeholder="0" value={expectedNoOfTransactions} onChange={e => setExpectedNoOfTransactions(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Expected Volume</Label>
            <Input type="number" placeholder="0" value={expectedVolume} onChange={e => setExpectedVolume(e.target.value)} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Deal with Goods? *</Label>
            <RadioGroup value={dealWithGoods ? "yes" : "no"} onValueChange={(v) => setDealWithGoods(v === "yes")} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="goods-yes" />
                <Label htmlFor="goods-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="goods-no" />
                <Label htmlFor="goods-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* AML Compliance Questionnaire */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">AML Compliance Questionnaire</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>KYC documents collected with form *</Label>
            <RadioGroup value={kycCollected ? "yes" : "no"} onValueChange={(v) => setKycCollected(v === "yes")} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="kyc-yes" />
                <Label htmlFor="kyc-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="kyc-no" />
                <Label htmlFor="kyc-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Is entity registered in GOAML *</Label>
            <RadioGroup value={isRegisteredGoAML ? "yes" : "no"} onValueChange={(v) => setIsRegisteredGoAML(v === "yes")} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="goaml-yes" />
                <Label htmlFor="goaml-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="goaml-no" />
                <Label htmlFor="goaml-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Is Entity Having Material Match *</Label>
            <p className="text-xs text-blue-600 mb-2">We don't Check adverse news feed</p>
            <RadioGroup value={isAdverseNews ? "yes" : "no"} onValueChange={(v) => setIsAdverseNews(v === "yes")} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="material-yes" />
                <Label htmlFor="material-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="material-no" />
                <Label htmlFor="material-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Partner/Representative/Authorized Person Details */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Partner/Representative/Authorized Person Details</h4>
        </div>
        {ubos.map((ubo, index) => (
          <div key={ubo.id} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                UBO {index + 1}
              </h5>
              {ubos.length > 1 && (
                <Button variant="ghost" size="sm" type="button" onClick={() => removeUBO(ubo.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Combobox
                  options={[
                    { value: "Individual", label: "Individual" },
                    { value: "Entity", label: "Entity" },
                  ]}
                  value={ubo.type}
                  onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "type", v)}
                  placeholder="Select type"
                  searchPlaceholder="Search type..."
                />
              </div>
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input placeholder="Enter Name" value={ubo.name} onChange={e => setUboField(ubo.id, "name", e.target.value)} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Previously Exposed Person (PEP)? *</Label>
                <RadioGroup value={ubo.isPep ? "yes" : "no"} onValueChange={(v) => setUboField(ubo.id, "isPep", v === "yes")} className="flex gap-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`pep-yes-${ubo.id}`} />
                    <Label htmlFor={`pep-yes-${ubo.id}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`pep-no-${ubo.id}`} />
                    <Label htmlFor={`pep-no-${ubo.id}`}>No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Nationality</Label>
                <Combobox
                  options={countries}
                  value={ubo.nationality}
                  onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "nationality", v)}
                  placeholder="Select nationality"
                  searchPlaceholder="Search nationality..."
                />
              </div>
              <div className="space-y-2">
                <Label>ID Type *</Label>
                <Combobox
                  options={idTypes}
                  value={ubo.idType}
                  onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "idType", v)}
                  placeholder="Passport"
                  searchPlaceholder="Search type..."
                />
              </div>
              <div className="space-y-2">
                <Label>ID No/License No  *</Label>
                <Input placeholder="Enter ID License No" value={ubo.idNo} onChange={e => setUboField(ubo.id, "idNo", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ID Issue Date *</Label>
                <Input type="date" placeholder="mm/dd/yyyy" value={ubo.idIssue} onChange={e => setUboField(ubo.id, "idIssue", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ID Expiry Date *</Label>
                <Input type="date" placeholder="mm/dd/yyyy" value={ubo.idExpiry} onChange={e => setUboField(ubo.id, "idExpiry", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input type="date" placeholder="mm/dd/yyyy" value={ubo.dob} onChange={e => setUboField(ubo.id, "dob", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Combobox
                  options={roles}
                  value={ubo.role}
                  onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "role", v)}
                  placeholder="UBO"
                  searchPlaceholder="Search role..."
                />
              </div>
              <div className="space-y-2">
                <Label>Percentage of Share *</Label>
                <Input placeholder="Enter Percentage (0-100)" value={ubo.ownershipPercentage as string} onChange={e => setUboField(ubo.id, "ownershipPercentage", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" type="button" onClick={addUBO} className="w-full bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Representative
        </Button>
      </Card>

      {/* Upload Documents */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Upload Documents</h4>
        </div>
        <div
          className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer"
          onClick={openCorpFilePicker}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-blue-600 mb-1">Add Documents</p>
          <p className="text-xs text-muted-foreground">Max 5 files, each up to 5MB (Images, PDFs, Docs)</p>
          <input
            ref={corpFileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,.txt,.gif,.bmp,.tiff,.svg,.webp,.heic"
            onChange={handleCorpFileChange}
            className="mt-2 hidden"
          />
          <div className="mt-2 flex flex-col items-center gap-1">
            {corpFiles.map((file, idx) => (
              <span key={idx} className="text-xs text-gray-700">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-6 bg-blue-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Additional Information</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Screening Fuzziness *</Label>
            <Combobox
              options={screeningFuzziness}
              value={corpFuzziness}
              onValueChange={handleSingleSelect(setCorpFuzziness)}
              placeholder="OFF"
              searchPlaceholder="Search fuzziness..."
            />
          </div>
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Enter any remarks" rows={3} value={corpRemarks} onChange={e => setCorpRemarks(e.target.value)} />
          </div>
        </div>
      </Card>

      <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">Submit Registration</Button>
    </form>
  )
}
