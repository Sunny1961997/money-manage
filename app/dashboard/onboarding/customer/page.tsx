"use client"

import { Spinner } from "@/components/ui/spinner"
import { useState, useEffect, useRef } from "react"
import type { KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { RequiredLabel } from "@/components/ui/required-label"
import { Combobox } from "@/components/ui/combobox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatContactNumber } from "@/lib/utils"

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-xs font-extrabold uppercase tracking-[0.14em] text-foreground"
const FIELD_LABEL_CLASS = "mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const TABS_GRID_LIST_CLASS = "grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0 md:grid-cols-3 lg:grid-cols-5"
const TABS_GRID_TRIGGER_CLASS =
  "h-10 w-full rounded-xl px-2 text-center text-sm whitespace-nowrap justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"

const blockExponentInput = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "e" || e.key === "E") {
    e.preventDefault()
  }
}

type CustomerType = "individual" | "corporate"

const occupations = [
  { value: "Accounting", label: "Accounting" },
  { value: "Advocacy Organizations", label: "Self Employed" },
  { value: "Air Couriers and Cargo Services", label: "Air Couriers and Cargo Services" },
  { value: "Advertising, Marketing and PR", label: "Advertising, Marketing and PR" },
  { value: "Banking/Financial Institutions", label: "Banking/Financial Institutions" },
  { value: "Business Services Other", label: "Business Services Other" },
  { value: "Charitable Organizations and Foundations", label: "Charitable Organizations and Foundations" },
  { value: "Consulting/Freelancer", label: "Consulting/Freelancer" },
  { value: "Data Analytics, Management and Internet", label: "Data Analytics, Management and Internet" },
  { value: "Defense", label: "Defense" },
  { value: "Education", label: "Education" },
  { value: "Facilities Management and Maintenance", label: "Facilities Management and Maintenance" },
  { value: "Government Service", label: "Government Service" },
  { value: "HR and Recruiting Services", label: "HR and Recruiting Services" },
  { value: "HealthCare", label: "HealthCare" },
  { value: "IT and Network Services and Support", label: "IT and Network Services and Support" },
  { value: "Jewellery Trading", label: "Jewellery Trading" },
  { value: "Outside UAE", label: "Outside UAE" },
  { value: "Sale and Services", label: "Sale and Services" },
  { value: "Others", label: "Others" },
  { value: "Owner/Partner/Director", label: "Owner/Partner/Director" },
]
const sourceOfIncome = [
  { value: "Salary", label: "Salary" },
  { value: "Perosonal Savings", label: "Perosonal Savings" },
  { value: "Bank - Cash Withdrawal Slip", label: "Bank - Cash Withdrawal Slip" },
  { value: "Funds from Dividend Payouts", label: "Funds from Dividend Payouts" },
  { value: "End of Services Funds", label: "End of Services Funds" },
  { value: "Business Proceeds", label: "Business Proceeds" },
  { value: "Other sources", label: "Other sources" },
  { value: "Gift", label: "Gift" },
  { value: "Loan from Friends and Family", label: "Loan from Friends and Family" },
  { value: "Loans from Bank", label: "Loans from Bank" },
  { value: "Loan from Financial Institutions", label: "Loan from Financial Institutions" },
  { value: "Lottery/Raffles", label: "Lottery/Raffles" },
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
  { value: "Debit/Credit Card", label: "Debit/Credit Card" },
  { value: "Bank Transfer - Inside UAE", label: "Bank Transfer - Inside UAE" },
  { value: "Bank Transfer - Outside UAE", label: "Bank Transfer _ Outside UAE" },
  { value: "Parial Cash/Card/Online trs", label: "Parial Cash/Card/Online trs" },
  { value: "Crypto/Prepaid Cards", label: "Crypto/Prepaid Cards" },
  { value: "Old Gold Exchange", label: "Old Gold Exchange" },
  { value: "Payment from HRC", label: "Payment from HRC" },
  { value: "Others", label: "Others" },
]
const modeOfApproach = [
  { value: "Walk-In Customer", label: "Walk-In Customer" },
  { value: "Non Face to Face", label: "Non Face to Face" },
  { value: "Online/Social Media Portal", label: "Online/Social Media Portal" },
  { value: "Thirdparty Referral", label: "Thirdparty Referral" },
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
  const [questionnaires, setQuestionnaires] = useState<Array<{ id: number; question: string; category?: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("/api/onboarding/meta", { credentials: "include" })
        const json = await res.json()
        console.log("Onboarding meta data:", json)

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
              value: `${c.phoneCode}`,
              label: `${c.phoneCode} (${c.label})`,
            }))
        )
        setProducts((json.data.products || []).map((p: any) => ({ value: p.id.toString(), label: p.name })))

        setQuestionnaires(Array.isArray(json?.data?.questionnaires) ? json.data.questionnaires : [])
      } catch (e) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchMeta()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading form data...</p>
      </div>
    )
  }

  return (
    <div className={PAGE_CLASS}>
      <Card className={`${CARD_STYLE} relative overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-primary/10`}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Customer Onboarding</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Register a new individual or corporate customer into the system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Choose Customer Type */}
      <div className="mb-2">
        <p className={SECONDARY_LABEL_CLASS}>Choose Customer Type</p>
        <p className="mt-1 text-sm text-muted-foreground mb-6">
          Selected: {customerType === "individual" ? "Individual" : "Corporate"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCustomerType("individual")}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${customerType === "individual" ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40 bg-background/80"
              }`}
          >
            <User className={`w-6 h-6 mb-3 ${customerType === "individual" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="font-semibold text-foreground">Individual</div>
            <div className="text-sm text-muted-foreground mt-1">For personal customers or sole proprietors.</div>
          </button>

          <button
            onClick={() => setCustomerType("corporate")}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${customerType === "corporate" ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40 bg-background/80"
              }`}
          >
            <Building2 className={`w-6 h-6 mb-3 ${customerType === "corporate" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="font-semibold text-foreground">Corporate</div>
            <div className="text-sm text-muted-foreground mt-1">For Gold, Jewellery, Real Estate, Agent, Broker, CSP, DNFBP.</div>
          </button>
        </div>
      </div>

      {/* Forms */}
      {customerType === "individual" ? (
        <IndividualForm countries={countries} countryCodes={countryCodes} occupations={occupations} idTypes={idTypes} products={products} sourceOfIncome={sourceOfIncome} />
      ) : (
        <CorporateForm countries={countries} countryCodes={countryCodes} occupations={occupations} idTypes={idTypes} products={products} questionnaires={questionnaires} />
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
  const [expectedNoOfTransactions, setExpectedNoOfTransactions] = useState("")
  const [expectedVolume, setExpectedVolume] = useState("")
  // Screening & remarks
  // const [fuzziness, setFuzziness] = useState("")
  const [remarks, setRemarks] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Validation Checkers
  const isIndividualFormValid = [
    firstName, lastName, dob, address, city, country, nationality, countryCode, contactNo, email, gender, occupation, sourceIncome, purpose, paymentMethod,
    approach, idType, idNo, issuingAuthority, idIssueAtCountry, idIssueDate, idExpiryDate, placeOfBirth, countryOfResidence,
  ].every(Boolean) && productTypes.length > 0

  // Tab state
  const [activeTab, setActiveTab] = useState("personal")
  const [submitting, setSubmitting] = useState(false)

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
    if (submitting) return
    setSubmitting(true)

    // Validation
    const requiredFields = {
      'First Name': firstName,
      'Last Name': lastName,
      'Date of Birth': dob,
      'Address': address,
      'City': city,
      'Country': country,
      'Nationality': nationality,
      'Country Code': countryCode,
      'Contact No': contactNo,
      'Email': email,
      'Gender': gender,
      'Occupation': occupation,
      'Source of Income': sourceIncome,
      'Purpose': purpose,
      'Payment Mode': paymentMethod,
      'Product Type': productTypes.length > 0 ? 'filled' : '',
      'Mode of Approach': approach,
      'ID Type': idType,
      'ID No': idNo,
      'ID Issued By': issuingAuthority,
      'ID Issued At': idIssueAtCountry,
      'ID Issued Date': idIssueDate,
      'ID Expiry Date': idExpiryDate,
      'Place of Birth': placeOfBirth,
      'Country of Residence': countryOfResidence,
      // 'Screening Fuzziness': fuzziness,
    }

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field, _]) => field)

    if (emptyFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in: ${emptyFields.join(', ')}`,
        // variant: "destructive"
      })
      return
    }

    const payload = {
      customer_type: "individual",
      onboarding_type: "full",
      screening_fuzziness: "OFF",
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
      console.log("[Frontend] Onboarding API response:", { status: res.status, data })

      if (res.ok) {
        const msg = data?.message || "Onboarding submitted successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        console.log("[Frontend] Error response data:", data)
        const details = data?.errors ? (Object.values(data.errors as Record<string, string[]>).flat().join("; ")) : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        console.log("[Frontend] Final error text for toast:", errText)
        toast({ title: "Onboarding failed", description: errText })
      }
    } catch (err: any) {
      console.error("[Frontend] Caught error:", err)
      toast({ title: "Onboarding failed", description: err?.message || "Network error" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Individual</span>
        <h3 className="text-lg font-semibold">New Individual Registration</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md py-3 mb-4 rounded-2xl border border-border/50 px-2">
          <TabsList className={TABS_GRID_LIST_CLASS}>
            <TabsTrigger value="personal" className={TABS_GRID_TRIGGER_CLASS}>
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="address" className={TABS_GRID_TRIGGER_CLASS}>
              Address Information
            </TabsTrigger>
            <TabsTrigger value="contact" className={TABS_GRID_TRIGGER_CLASS}>
              Contact Information
            </TabsTrigger>
            <TabsTrigger value="gender-pep" className={TABS_GRID_TRIGGER_CLASS}>
              Gender & PEP
            </TabsTrigger>
            <TabsTrigger value="occupation" className={TABS_GRID_TRIGGER_CLASS}>
              Occupation
            </TabsTrigger>
            <TabsTrigger value="financial" className={TABS_GRID_TRIGGER_CLASS}>
              Financial
            </TabsTrigger>
            <TabsTrigger value="transactions" className={TABS_GRID_TRIGGER_CLASS}>
              Transactions & ID
            </TabsTrigger>
            <TabsTrigger value="identification" className={TABS_GRID_TRIGGER_CLASS}>
              Identification
            </TabsTrigger>
            <TabsTrigger value="additional-info" className={TABS_GRID_TRIGGER_CLASS}>
              Additional Info
            </TabsTrigger>
            <TabsTrigger value="documents" className={TABS_GRID_TRIGGER_CLASS}>
              Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>
          <TabsContent value="personal" className="mt-0">
            {/* Personal Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Personal Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="First Name" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="Last Name" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="Date of Birth" className={FIELD_LABEL_CLASS} />
                    <input type="date" className={FIELD_CLASS} value={dob} onChange={e => setDob(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="Residential Status" className={FIELD_LABEL_CLASS} />
                    <select className={FIELD_CLASS} value={residentialStatus} onChange={e => setResidentialStatus(e.target.value)}>
                      <option value="resident">Resident</option>
                      <option value="non-resident">Non-Resident</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="mt-0">
            {/* Address Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Address Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <RequiredLabel text="Address" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="City" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter city" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="Country" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={country}
                      onValueChange={handleSingleSelect(setCountry)}
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="Nationality" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={nationality}
                      onValueChange={handleSingleSelect(setNationality)}
                      placeholder="Select a nationality"
                      searchPlaceholder="Search nationality..."
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            {/* Contact Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <RequiredLabel text="Country Code" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countryCodes}
                      value={countryCode}
                      onValueChange={handleSingleSelect(setCountryCode)}
                      placeholder="Select"
                      searchPlaceholder="Search code..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="Contact No" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter contact number" value={contactNo} onChange={e => setContactNo(formatContactNumber(e.target.value))} />
                  </div>
                  <div>
                    <RequiredLabel text="Email" className={FIELD_LABEL_CLASS} />
                    <input type="email" className={FIELD_CLASS} placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gender-pep" className="mt-0">
            {/* Gender and PEP Status */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Gender and PEP Status</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="Gender" className={FIELD_LABEL_CLASS} />
                    <select className={FIELD_CLASS} value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <RequiredLabel text="Politically Exposed Person (PEP)?" className={FIELD_LABEL_CLASS} />
                    <select className={FIELD_CLASS} value={isPep ? "yes" : "no"} onChange={e => setIsPep(e.target.value === "yes")}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupation" className="mt-0">
            {/* Occupation and Income */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Occupation and Income</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="Occupation" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={occupations}
                      value={occupation}
                      onValueChange={handleOccupation}
                      placeholder="Select an occupation"
                      searchPlaceholder="Search occupation..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="Source of Income" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={sourceOfIncome}
                      value={sourceIncome}
                      onValueChange={handleSourceIncome}
                      placeholder="Select a source"
                      searchPlaceholder="Search source..."
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-0">
            {/* Financial Details */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Financial Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="Purpose" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={purposes}
                      value={purpose}
                      onValueChange={handleSingleSelect(setPurpose)}
                      placeholder="Select a purpose"
                      searchPlaceholder="Search purpose..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="Payment Mode" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={paymentMethods}
                      value={paymentMethod}
                      onValueChange={handleSingleSelect(setPaymentMethod)}
                      placeholder="Select a payment mode"
                      searchPlaceholder="Search mode..."
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            {/* Transactions and ID Details */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Transactions and ID Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="Product Type" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={products}
                      value={productTypes}
                      onValueChange={handleMultiSelect(setProductTypes)}
                      multiple
                      placeholder="Select product type"
                      searchPlaceholder="Search type..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="Mode of Approach" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={modeOfApproach}
                      value={approach}
                      onValueChange={handleSingleSelect(setApproach)}
                      placeholder="Select mode of approach"
                      searchPlaceholder="Search approach..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASS}>Expected No of Transactions</label>
                    <input
                      type="number"
                      className={FIELD_CLASS}
                      placeholder="0"
                      value={expectedNoOfTransactions}
                      onChange={e => setExpectedNoOfTransactions(e.target.value)}
                      onKeyDown={blockExponentInput}
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASS}>Expected Volume</label>
                    <input
                      type="number"
                      className={FIELD_CLASS}
                      placeholder="0"
                      value={expectedVolume}
                      onChange={e => setExpectedVolume(e.target.value)}
                      onKeyDown={blockExponentInput}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="identification" className="mt-0">
            {/* Identification Details */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Identification Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="ID Type" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={idTypes}
                      value={idType}
                      onValueChange={handleSingleSelect(setIdType)}
                      placeholder="Select an ID type"
                      searchPlaceholder="Search type..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="ID No" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter ID number" value={idNo} onChange={e => setIdNo(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="ID Issued By" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter issuing authority" value={issuingAuthority} onChange={e => setIssuingAuthority(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="ID Issued At" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={idIssueAtCountry}
                      onValueChange={handleSingleSelect(setIdIssueAtCountry)}
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="ID Issued Date" className={FIELD_LABEL_CLASS} />
                    <input type="date" className={FIELD_CLASS} value={idIssueDate} onChange={e => setIdIssueDate(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                    <input type="date" className={FIELD_CLASS} value={idExpiryDate} onChange={e => setIdExpiryDate(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional-info" className="mt-0">
            {/* Additional Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Additional Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="Place of Birth" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={placeOfBirth}
                      onValueChange={handleSingleSelect(setPlaceOfBirth)}
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <RequiredLabel text="Country of Residence" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={countryOfResidence}
                      onValueChange={handleSingleSelect(setCountryOfResidence)}
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <RequiredLabel text="Dual Nationality" className={FIELD_LABEL_CLASS} />
                    <div className="mt-2 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dualNationality" value="yes" checked={dualNationality} onChange={() => setDualNationality(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dualNationality" value="no" checked={!dualNationality} onChange={() => setDualNationality(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <RequiredLabel text="Is Customer Facing any adverse event?" className={FIELD_LABEL_CLASS} />
                    <p className="text-xs text-primary/80 mb-3">We don't Check adverse news feed</p>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="adverseNews" value="yes" checked={adverseNews} onChange={() => setAdverseNews(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="adverseNews" value="no" checked={!adverseNews} onChange={() => setAdverseNews(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={FIELD_LABEL_CLASS}>Remarks</label>
                    <textarea
                      className={TEXTAREA_CLASS}
                      placeholder="Enter any remarks"
                      rows={3}
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            {/* Upload Documents */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Upload Documents</h4>
                </div>

                <div className="space-y-4">
                  <label className={FIELD_LABEL_CLASS}>Attachments</label>
                  <div
                    className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-8 text-center cursor-pointer flex flex-col items-center justify-center"
                    onClick={openFilePicker}
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">Click to Upload Documents</p>
                    <p className="text-xs text-muted-foreground">Max 5 files, each up to 2MB (Images, PDFs, Docs)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,.txt,.gif,.bmp,.tiff,.svg,.webp,.heic"
                      onChange={handleFileChange}
                      className="hidden"
                      data-testid="file-input"
                    />
                  </div>

                  {files.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background/50">
                          <FileCheck className="w-5 h-5 text-primary shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-6 z-10 flex justify-end">
            <Button
              className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              type="submit"
              disabled={submitting || !isIndividualFormValid}
            >
              {submitting ? (
                <>
                  <Spinner className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}

function CorporateForm({
  countries,
  countryCodes,
  products,
  occupations,
  idTypes,
  questionnaires,
}: {
  countries: Array<{ value: string; label: string }>
  countryCodes: Array<{ value: string; label: string }>
  products: Array<{ value: string; label: string }>
  occupations: Array<{ value: string; label: string }>
  idTypes: Array<{ value: string; label: string }>
  questionnaires: Array<{ id: number; question: string; category?: string }>
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
    { value: "IFZA", label: "IFZA" },
    { value: "Meydan", label: "Meydan" },
    { value: "Shams", label: "Shams" },
    { value: "DMCC", label: "DMCC" },
    { value: "MOEDED", label: "MOEDED" },
    { value: "Foreign Entity", label: "Foreign Entity" },
    { value: "Freezone Company", label: "Freezone Company" },
    // { value: "Public Limited", label: "Public Limited" },
  ]
  const business_activities = [
    { value: "Accounting/Auditing Firm", label: "Accounting/Auditing Firm" },
    // { value: "Bank/Financial Institute", label: "Bank/Financial Institute" },
    { value: "DPMS - Retail Store", label: "DPMS - Retail Store" },
    { value: "DPMS - Bullion Wholesale", label: "DPMS - Bullion Wholesale" },
    { value: "DPMS - Mining, Refining", label: "DPMS - Mining, Refining" },
    { value: "DPMS- Factory, Workshop, Goldsmith", label: "DPMS- Factory, Workshop, Goldsmith" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "General Trading", label: "General Trading" },
    { value: "Law Firm", label: "Law Firm" },
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

  // AML questionnaires (answer per question)
  // Stored as: { [question_id]: 1 | 0 }
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<number, 1 | 0 | null>>({})

  const setQuestionnaireAnswer = (questionId: number, value: 1 | 0) => {
    setQuestionnaireAnswers(prev => ({ ...prev, [questionId]: value }))
  }

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
  const [businessActivityOther, setBusinessActivityOther] = useState("")
  const [productSource, setProductSource] = useState("")
  const [paymentMode, setPaymentMode] = useState("")
  const [deliveryChannel, setDeliveryChannel] = useState("")
  // const [corpFuzziness, setCorpFuzziness] = useState("")
  const [corpRemarks, setCorpRemarks] = useState("")
  const [hasSisterConcern, setHasSisterConcern] = useState(false)
  const [productTypesCorp, setProductTypesCorp] = useState<string[]>([])
  const [customProducts, setCustomProducts] = useState<string[]>([])
  const [customProductInput, setCustomProductInput] = useState("")
  const [accountHoldingBankName, setAccountHoldingBankName] = useState("")
  const [purposeOfRelation, setPurposeOfRelation] = useState("")

  // Tab state for corporate
  const [activeTabCorp, setActiveTabCorp] = useState("company")

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

  const isCorporateFormValid = [
    companyName, companyAddress, city, companyCountry, corporateCustomerType, mobileCountryCode, mobileNo, email,
    tradeLicenseNo, tradeLicenseIssuedAt, tradeLicenseIssuedBy, licenseIssueDate, licenseExpiryDate, tenancyContractExpiryDate, entityType,
    businessActivity, purposeOfRelation, productSource, paymentMode, deliveryChannel
  ].every(Boolean) &&
    productTypesCorp.length > 0 &&
    countriesOfOperation.length > 0 &&
    ubos.every(ubo =>
      ubo.type && ubo.name && ubo.idType && ubo.idNo && ubo.idIssue && ubo.idExpiry && ubo.dob && ubo.role && ubo.ownershipPercentage
    ) &&
    (!questionnaires.length || questionnaires.every(q => questionnaireAnswers[q.id] !== undefined && questionnaireAnswers[q.id] !== null))

  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    // Validation - check required fields
    const requiredFields: Record<string, string> = {
      // Company Information
      'Company Name': companyName,
      'Company Address': companyAddress,
      'City': city,
      'Country of Incorporation': companyCountry,
      // 'PO Box No': poBox,
      'Customer Type': corporateCustomerType,
      // Contact Information
      // 'Country Code (Office)': officeCountryCode,
      // 'Contact Office No': officeNo,
      'Country Code (Mobile)': mobileCountryCode,
      'Contact Mobile No': mobileNo,
      'Email': email,
      // Identity Information
      'Trade License/CR No': tradeLicenseNo,
      'Trade License/CR Issued At': tradeLicenseIssuedAt,
      'Trade License/COI Issued By': tradeLicenseIssuedBy,
      'Trade License/CR Issued Date': licenseIssueDate,
      'Trade License/CR Expiry Date': licenseExpiryDate,
      // 'VAT Registration Number': vatRegistrationNo,
      'Tenancy Contract Expiry Date': tenancyContractExpiryDate,
      // Business Information
      'Entity Type': entityType,
      'Countries of Operation': countriesOfOperation.length > 0 ? 'filled' : '',
      'Business Activity': businessActivity === 'Other' ? businessActivityOther : businessActivity,
      // 'Account Holding Bank Name': accountHoldingBankName,
      'Purpose of Relation': purposeOfRelation,
      // Product Details
      'Product Type': productTypesCorp.length > 0 ? 'filled' : '',
      'Product Source': productSource,
      'Payment Mode': paymentMode,
      'Delivery Channel': deliveryChannel,
      'Expected No of Transactions': expectedNoOfTransactions,
      'Expected Volume': expectedVolume,
    }

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field, _]) => field)

    if (emptyFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in: ${emptyFields.join(', ')}`,
        // variant: "destructive"
      })
      return
    }

    // Validate UBO/Related persons
    for (let i = 0; i < ubos.length; i++) {
      const ubo = ubos[i]
      const uboRequiredFields = {
        [`UBO ${i + 1} - Type`]: ubo.type,
        [`UBO ${i + 1} - Name`]: ubo.name,
        [`UBO ${i + 1} - ID Type`]: ubo.idType,
        [`UBO ${i + 1} - ID No`]: ubo.idNo,
        [`UBO ${i + 1} - ID Issue Date`]: ubo.idIssue,
        [`UBO ${i + 1} - ID Expiry Date`]: ubo.idExpiry,
        [`UBO ${i + 1} - Date of Birth`]: ubo.dob,
        [`UBO ${i + 1} - Role`]: ubo.role,
        [`UBO ${i + 1} - Percentage of Share`]: ubo.ownershipPercentage,
      }

      const uboEmptyFields = Object.entries(uboRequiredFields)
        .filter(([_, value]) => !value)
        .map(([field, _]) => field)

      if (uboEmptyFields.length > 0) {
        toast({
          title: "Required fields missing",
          description: `Please fill in: ${uboEmptyFields.join(', ')}`,
          // variant: "destructive"
        })
        return
      }
    }

    // Validate AML questionnaires (require yes/no for each question if questionnaires exist)
    if (Array.isArray(questionnaires) && questionnaires.length > 0) {
      const missing = questionnaires.filter(q => questionnaireAnswers[q.id] === undefined || questionnaireAnswers[q.id] === null)
      if (missing.length > 0) {
        toast({
          title: "Required fields missing",
          description: `Please answer AML Questionnaires (${missing.length} unanswered).`,
        })
        return
      }
    }

    const payload: any = {
      customer_type: "corporate",
      onboarding_type: "full",
      screening_fuzziness: "OFF",
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
        business_activity: businessActivity === 'Other' ? businessActivityOther : businessActivity,
        is_entity_dealting_with_import_export: isImportExport,
        has_sister_concern: hasSisterConcern,
        account_holding_bank_name: accountHoldingBankName,
        purpose_of_relation: purposeOfRelation,
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

      // IMPORTANT: AML Questionnaires answers
      // Array of { question_id, answer } where answer is 1 (yes) or 0 (no)
      aml_questionnaires: (questionnaires || []).map(q => ({
        question_id: q.id,
        answer: questionnaireAnswers[q.id] ?? 0,
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
      console.log("After calling onboarding api response", res.status, data)

      if (res.ok) {
        const msg = data?.message || "Onboarding submitted successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        console.log("After calling onboarding api response else")
        const details = data?.errors ? (Object.values(data.errors as Record<string, string[]>).flat().join("; ")) : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({
          title: "Onboarding failed",
          description: errText,
          // variant: "destructive" 
        })
      }
    } catch (err: any) {
      console.log("After calling onboarding api response catch")
      toast({
        title: "Onboarding failed",
        description: err?.message || "Network error",
        // variant: "destructive" 
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Corporate</span>
        <h3 className="text-lg font-semibold">New Corporate Registration</h3>
      </div>

      <Tabs value={activeTabCorp} onValueChange={setActiveTabCorp} className="w-full">
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md py-3 mb-4 rounded-2xl border border-border/50 px-2">
          <TabsList className={TABS_GRID_LIST_CLASS}>
            <TabsTrigger value="company" className={TABS_GRID_TRIGGER_CLASS}>
              Company Information
            </TabsTrigger>
            <TabsTrigger value="contact" className={TABS_GRID_TRIGGER_CLASS}>
              Contact Information
            </TabsTrigger>
            <TabsTrigger value="identity" className={TABS_GRID_TRIGGER_CLASS}>
              Identity Information
            </TabsTrigger>
            <TabsTrigger value="operations" className={TABS_GRID_TRIGGER_CLASS}>
              Business Information
            </TabsTrigger>
            <TabsTrigger value="product" className={TABS_GRID_TRIGGER_CLASS}>
              Product Details
            </TabsTrigger>
            <TabsTrigger value="aml" className={TABS_GRID_TRIGGER_CLASS}>
              AML Questionnaire
            </TabsTrigger>
            <TabsTrigger value="related" className={TABS_GRID_TRIGGER_CLASS}>
              Partners/Reps
            </TabsTrigger>
            <TabsTrigger value="additional" className={TABS_GRID_TRIGGER_CLASS}>
              Additional Info
            </TabsTrigger>
            <TabsTrigger value="documents" className={TABS_GRID_TRIGGER_CLASS}>
              Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>
          <TabsContent value="company" className="mt-0">
            {/* Company Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Company Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="Company Name" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter the Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <RequiredLabel text="Company Address" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter the Company address" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="City" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter the city" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Country of Incorporation" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={companyCountry}
                      onValueChange={handleSingleSelect(setCompanyCountry)}
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={FIELD_LABEL_CLASS}>PO Box No </label>
                    <input className={FIELD_CLASS} placeholder="Enter the PO Box No" value={poBox} onChange={e => setPoBox(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Customer Type" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={corporate_customer_type}
                      value={corporateCustomerType}
                      onValueChange={handleSingleSelect(setCorporateCustomerType)}
                      placeholder="Select Customer Type"
                      searchPlaceholder="Search type..."
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            {/* Contact Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={FIELD_LABEL_CLASS}>Country Code </label>
                      <Combobox
                        options={countryCodes}
                        value={officeCountryCode}
                        onValueChange={handleSingleSelect(setOfficeCountryCode)}
                        placeholder="Select"
                        searchPlaceholder="Search code..."
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={FIELD_LABEL_CLASS}>Contact Office No </label>
                      <input className={FIELD_CLASS} placeholder="Enter the Contact Office No" value={officeNo} onChange={e => setOfficeNo(formatContactNumber(e.target.value))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel text="Country Code" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={countryCodes}
                        value={mobileCountryCode}
                        onValueChange={handleSingleSelect(setMobileCountryCode)}
                        placeholder="Select"
                        searchPlaceholder="Search code..."
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="Contact Mobile No" className={FIELD_LABEL_CLASS} />
                      <input className={FIELD_CLASS} placeholder="Enter the Contact Mobile No" value={mobileNo} onChange={e => setMobileNo(formatContactNumber(e.target.value))} />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <RequiredLabel text="Email" className={FIELD_LABEL_CLASS} />
                    <input type="email" className={FIELD_CLASS} placeholder="Enter your email (abc@dom.com)" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="identity" className="mt-0">
            {/* Identity Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Identity Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/CR No" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter Trade License/CR No" value={tradeLicenseNo} onChange={e => setTradeLicenseNo(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/CR Issued At" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={[
                        ...countries,
                        { value: "Outside UAE", label: "Outside UAE" },
                      ]}
                      value={tradeLicenseIssuedAt}
                      onValueChange={handleSingleSelect(setTradeLicenseIssuedAt)}
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/COI Issued By" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={licance_issue_authorities}
                      value={tradeLicenseIssuedBy}
                      onValueChange={handleSingleSelect(setTradeLicenseIssuedBy)}
                      placeholder="Select a issuing authority"
                      searchPlaceholder="Search issuing authority..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/CR Issued Date" className={FIELD_LABEL_CLASS} />
                    <input type="date" className={FIELD_CLASS} value={licenseIssueDate} onChange={e => setLicenseIssueDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/CR Expiry Date" className={FIELD_LABEL_CLASS} />
                    <input type="date" className={FIELD_CLASS} value={licenseExpiryDate} onChange={e => setLicenseExpiryDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={FIELD_LABEL_CLASS}>VAT Registration Number </label>
                    <input className={FIELD_CLASS} placeholder="Enter VAT Registration Number" value={vatRegistrationNo} onChange={e => setVatRegistrationNo(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <RequiredLabel text="Tenancy Contract Expiry Date" className={FIELD_LABEL_CLASS} />
                    <input type="date" className={FIELD_CLASS} value={tenancyContractExpiryDate} onChange={e => setTenancyContractExpiryDate(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="mt-0">
            {/* Business Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Business Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <RequiredLabel text="Entity Type" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={entity_types}
                      value={entityType}
                      onValueChange={handleSingleSelect(setEntityType)}
                      placeholder="Select entity type"
                      searchPlaceholder="Search type..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Countries of Operation" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={countriesOfOperation}
                      onValueChange={handleMultiSelect(setCountriesOfOperation)}
                      multiple
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Business Activity" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={business_activities}
                      value={businessActivity}
                      onValueChange={handleSingleSelect(setBusinessActivity)}
                      placeholder="Select business activity"
                      searchPlaceholder="Search business activity..."
                      className={FIELD_CLASS}
                    />
                    {businessActivity === "Other" && (
                      <input
                        className={`${FIELD_CLASS} mt-3`}
                        placeholder="Please specify business activity"
                        value={businessActivityOther}
                        onChange={e => setBusinessActivityOther(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Is entity dealing with Import/Export?" className={FIELD_LABEL_CLASS} />
                    <div className="mt-2 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isImportExport" value="yes" checked={isImportExport} onChange={() => setIsImportExport(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isImportExport" value="no" checked={!isImportExport} onChange={() => setIsImportExport(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className={FIELD_LABEL_CLASS}>Any other sister concern/branch?</label>
                    <div className="mt-2 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasSisterConcern" value="yes" checked={hasSisterConcern} onChange={() => setHasSisterConcern(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasSisterConcern" value="no" checked={!hasSisterConcern} onChange={() => setHasSisterConcern(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Bank Name */}
                    <div className="space-y-2">
                      <label className={FIELD_LABEL_CLASS}>Account Holding Bank Name</label>
                      <input
                        className={FIELD_CLASS}
                        placeholder="Enter bank name (max 50 characters)"
                        value={accountHoldingBankName}
                        onChange={e => setAccountHoldingBankName(e.target.value)}
                      />
                    </div>

                    {/* Right Column: Purpose of Relation */}
                    <div className="space-y-2">
                      <RequiredLabel text="Purpose of Relationship" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={[
                          { value: "Buy", label: "Buy" },
                          { value: "Sell", label: "Sell" },
                          { value: "Buy and Sell", label: "Buy and Sell" },
                          { value: "Investment", label: "Investment" },
                          { value: "Trading", label: "Trading" },
                          { value: "Manufacturing", label: "Manufacturing" },
                          { value: "Other", label: "Other" },
                        ]}
                        value={purposeOfRelation}
                        onValueChange={handleSingleSelect(setPurposeOfRelation)}
                        placeholder="Select purpose of relation"
                        searchPlaceholder="Search purpose..."
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product" className="mt-0">
            {/* Product Details */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Product Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <RequiredLabel text="Product Type" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={products}
                      value={productTypesCorp}
                      onValueChange={handleMultiSelect(setProductTypesCorp)}
                      multiple
                      placeholder="Select Product Type"
                      searchPlaceholder="Search type..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Product Source" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={product_sources}
                      value={productSource}
                      onValueChange={handleSingleSelect(setProductSource)}
                      placeholder="Select product source"
                      searchPlaceholder="Search source..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Payment Mode" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={payment_modes}
                      value={paymentMode}
                      onValueChange={handleSingleSelect(setPaymentMode)}
                      placeholder="Select payment mode"
                      searchPlaceholder="Search mode..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Delivery Channel" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={delivery_channels}
                      value={deliveryChannel}
                      onValueChange={handleSingleSelect(setDeliveryChannel)}
                      placeholder="Select delivery channel"
                      searchPlaceholder="Search channel..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Expected No of Transactions" className={FIELD_LABEL_CLASS} />
                    <input type="number" className={FIELD_CLASS} placeholder="0" value={expectedNoOfTransactions} onChange={e => setExpectedNoOfTransactions(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Expected Volume" className={FIELD_LABEL_CLASS} />
                    <input type="number" className={FIELD_CLASS} placeholder="0" value={expectedVolume} onChange={e => setExpectedVolume(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <RequiredLabel text="Deal with Dual-used Goods?" className={FIELD_LABEL_CLASS} />
                    <div className="mt-2 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dealWithGoods" value="yes" checked={dealWithGoods} onChange={() => setDealWithGoods(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dealWithGoods" value="no" checked={!dealWithGoods} onChange={() => setDealWithGoods(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aml" className="mt-0">
            {/* AML Compliance Questionnaire */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">AML Compliance Questionnaire</h4>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <RequiredLabel text="Is entity registered in GOAML" className={FIELD_LABEL_CLASS} />
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isRegisteredGoAML" value="yes" checked={isRegisteredGoAML} onChange={() => setIsRegisteredGoAML(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isRegisteredGoAML" value="no" checked={!isRegisteredGoAML} onChange={() => setIsRegisteredGoAML(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <RequiredLabel text="KYC documents collected with form" className={FIELD_LABEL_CLASS} />
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="kycCollected" value="yes" checked={kycCollected} onChange={() => setKycCollected(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="kycCollected" value="no" checked={!kycCollected} onChange={() => setKycCollected(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3 hidden">
                    <RequiredLabel text="Is Entity Having Material Match" className={FIELD_LABEL_CLASS} />
                    <p className="text-xs text-primary/80 mb-3">We don't Check adverse news feed</p>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isAdverseNews" value="yes" checked={isAdverseNews} onChange={() => setIsAdverseNews(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isAdverseNews" value="no" checked={!isAdverseNews} onChange={() => setIsAdverseNews(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>

                  {Array.isArray(questionnaires) && questionnaires.length > 0 && (
                    <>
                      <div className="h-px bg-border/50 my-6"></div>
                      <div className="space-y-4">
                        {questionnaires.map((q) => (
                          <div key={q.id} className="rounded-xl border border-border/60 bg-background/50 p-5 shadow-sm">
                            <div className="text-sm font-semibold text-foreground mb-3">{q.category ? `${q.category}: ` : ""}{q.question} <span className="text-destructive">*</span></div>
                            <div className="flex items-center gap-6">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  value="yes"
                                  checked={questionnaireAnswers[q.id] === 1}
                                  onChange={() => setQuestionnaireAnswer(q.id, 1)}
                                  className="accent-primary"
                                />
                                <span className="text-sm font-medium">Yes</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  value="no"
                                  checked={questionnaireAnswers[q.id] === 0}
                                  onChange={() => setQuestionnaireAnswer(q.id, 0)}
                                  className="accent-primary"
                                />
                                <span className="text-sm font-medium">No</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="mt-0">
            {/* Partner/Representative/Authorized Person Details */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UsersIcon className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Partner/Representative/Authorized Person Details</h4>
                </div>
                {ubos.map((ubo, index) => (
                  <div key={ubo.id} className="mb-8 last:mb-0">
                    <div className="flex items-center justify-between mb-5 bg-muted/30 p-3 rounded-xl border border-border/40">
                      <h5 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        UBO {index + 1}
                      </h5>
                      {ubos.length > 1 && (
                        <Button variant="ghost" size="sm" type="button" onClick={() => removeUBO(ubo.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                      <div className="space-y-2">
                        <RequiredLabel text="Type" className={FIELD_LABEL_CLASS} />
                        <Combobox
                          options={[
                            { value: "Individual", label: "Individual" },
                            { value: "Entity", label: "Entity" },
                          ]}
                          value={ubo.type}
                          onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "type", v)}
                          placeholder="Select type"
                          searchPlaceholder="Search type..."
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="Name" className={FIELD_LABEL_CLASS} />
                        <input className={FIELD_CLASS} placeholder="Enter Name" value={ubo.name} onChange={e => setUboField(ubo.id, "name", e.target.value)} />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <RequiredLabel text="Politically Exposed Person (PEP)?" className={FIELD_LABEL_CLASS} />
                        <div className="mt-2 flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name={`pep-${ubo.id}`} value="yes" checked={ubo.isPep} onChange={() => setUboField(ubo.id, 'isPep', true)} className="accent-primary" />
                            <span className="text-sm font-medium">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name={`pep-${ubo.id}`} value="no" checked={!ubo.isPep} onChange={() => setUboField(ubo.id, 'isPep', false)} className="accent-primary" />
                            <span className="text-sm font-medium">No</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className={FIELD_LABEL_CLASS}>Nationality</label>
                        <Combobox
                          options={countries}
                          value={ubo.nationality}
                          onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "nationality", v)}
                          placeholder="Select nationality"
                          searchPlaceholder="Search nationality..."
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="ID Type" className={FIELD_LABEL_CLASS} />
                        <Combobox
                          options={idTypes}
                          value={ubo.idType}
                          onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "idType", v)}
                          placeholder="Passport"
                          searchPlaceholder="Search type..."
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="ID No/License No" className={FIELD_LABEL_CLASS} />
                        <input className={FIELD_CLASS} placeholder="Enter ID License No" value={ubo.idNo} onChange={e => setUboField(ubo.id, "idNo", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="ID Issue Date" className={FIELD_LABEL_CLASS} />
                        <input type="date" className={FIELD_CLASS} value={ubo.idIssue} onChange={e => setUboField(ubo.id, "idIssue", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                        <input type="date" className={FIELD_CLASS} value={ubo.idExpiry} onChange={e => setUboField(ubo.id, "idExpiry", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="Date of Birth" className={FIELD_LABEL_CLASS} />
                        <input type="date" className={FIELD_CLASS} value={ubo.dob} onChange={e => setUboField(ubo.id, "dob", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="Role" className={FIELD_LABEL_CLASS} />
                        <Combobox
                          options={roles}
                          value={ubo.role}
                          onValueChange={(v) => typeof v === "string" && setUboField(ubo.id, "role", v)}
                          placeholder="UBO"
                          searchPlaceholder="Search role..."
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div className="space-y-2">
                        <RequiredLabel text="Percentage of Share" className={FIELD_LABEL_CLASS} />
                        <input className={FIELD_CLASS} placeholder="Enter Percentage (0-100)" value={ubo.ownershipPercentage as string} onChange={e => setUboField(ubo.id, "ownershipPercentage", e.target.value)} />
                      </div>
                    </div>
                    {index < ubos.length - 1 && <div className="h-px bg-border/50 my-8"></div>}
                  </div>
                ))}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <Button variant="outline" type="button" onClick={addUBO} className="w-full border-dashed border-2 hover:bg-primary/5 text-primary border-primary/20 bg-transparent h-12 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Representative
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            {/* Upload Documents */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Upload Documents</h4>
                </div>
                <div
                  className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-10 text-center cursor-pointer group"
                  onClick={openCorpFilePicker}
                >
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h5 className="font-semibold text-foreground mb-1">Click to Upload Documents</h5>
                  <p className="text-sm text-muted-foreground">Max 5 files, each up to 5MB (Images, PDFs, Docs)</p>
                  <input
                    ref={corpFileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,.txt,.gif,.bmp,.tiff,.svg,.webp,.heic"
                    onChange={handleCorpFileChange}
                    className="mt-2 hidden"
                  />
                  {corpFiles.length > 0 && (
                    <div className="mt-6 flex flex-col items-center gap-2 text-left">
                      {corpFiles.map((file, idx) => (
                        <div key={idx} className="bg-background px-4 py-2 rounded-lg border border-border/50 shadow-sm w-full max-w-sm flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="mt-0">
            {/* Additional Information */}
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Additional Information</h4>
                </div>
                <div className="space-y-4">
                  {/* <div className="space-y-2">
                    <RequiredLabel text="Screening Fuzziness" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={screeningFuzziness}
                      value={corpFuzziness}
                      onValueChange={handleSingleSelect(setCorpFuzziness)}
                      placeholder="OFF"
                      searchPlaceholder="Search fuzziness..."
                      className={FIELD_CLASS}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <label className={FIELD_LABEL_CLASS}>Remarks</label>
                    <textarea className={TEXTAREA_CLASS} placeholder="Enter any remarks" rows={3} value={corpRemarks} onChange={e => setCorpRemarks(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-6 z-10 flex justify-end">
            <Button
              className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              type="submit"
              disabled={submitting || !isCorporateFormValid}
            >
              {submitting ? (
                <>
                  <Spinner className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
