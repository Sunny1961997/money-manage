"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RequiredLabel } from "@/components/ui/required-label"
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
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CustomerType = "individual" | "corporate"

const PAGE_CLASS = "space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const FIELD_LABEL_CLASS = "mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const TABS_GRID_LIST_CLASS = "grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0 md:grid-cols-3 lg:grid-cols-5"
const TABS_GRID_TRIGGER_CLASS =
  "h-10 bg-primary/20 w-full rounded-xl px-2 text-center text-sm whitespace-nowrap justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"

const occupations = [
  { value: "Accounting", label: "Accounting" },
  { value: "Advocacy Organizations", label: "Self Employed" },
  { value: "Air Couriers and Cargo Services", label: "Air Couriers and Cargo Services" },
  { value: "Advertising, Marketing and PR", label: "Advertising, Marketing and PR" },
  { value: "Banking/Financial Institutions", label: "Banking/Financial Institutions" },
  { value: "Business Services Other", label: "Business Services Other" },
  { value: "Charitable Organizations and Foundations", label: "Charitable Organizations and Foundations" },
  { value: "Counsulting/Freelancer", label: "Counsulting/Freelancer" },
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
  { value: "Bank Transfer _ Outside UAE", label: "Bank Transfer _ Outside UAE" },
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
  { value: "Thirdparty Referal", label: "Thirdparty Referral" },
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
              value: `${c.phoneCode}`,
              label: `${c.phoneCode} (${c.label})`
            }))
        )
        setProducts(
          (metaJson.data.products || []).map((p: any) => ({ value: p.id.toString(), label: p.name }))
        )

        // Fetch customer data
        const customerRes = await fetch(`/api/onboarding/customers/${id}`, { credentials: "include" })
        const customerJson = await customerRes.json()
        console.log("Fetched customer data:", customerJson)
        
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

  if (loading) {
    return (
      <div className="grid w-full min-h-[calc(100vh-10rem)] place-items-center">
        <div className="relative flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" aria-hidden="true" />
          </div>
          <p className="absolute top-full mt-4 text-sm text-muted-foreground animate-pulse whitespace-nowrap">Loading form data...</p>
        </div>
      </div>
    )
  }

  if (!customerData) return <div className="max-w-5xl mx-auto p-6">Customer not found</div>

  return (
    <div className={PAGE_CLASS}>
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
  const [state, setState] = useState(ind.state || "")
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
  const [remarks, setRemarks] = useState(customerData.remarks || "")
  const [files, setFiles] = useState<File[]>([])
  const [existingDocuments, setExistingDocuments] = useState<any[]>(customerData.documents || [])
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  const [activeTab, setActiveTab] = useState("personal")

  // State for dynamic issuing authority options
  const [issuingAuthorityOptions, setIssuingAuthorityOptions] = useState<Array<{ value: string; label: string }>>([])

  // Get issuing authorities based on ID type
  const getIssuingAuthorities = (idTypeValue: string) => {
    switch(idTypeValue) {
      case "EID":
        return [
          { value: "Federal Authority for Identity", label: "Federal Authority for Identity" },
          { value: "Citizenship", label: "Citizenship" },
          { value: "Customs and Port Security", label: "Customs and Port Security" },
        ];
      case "Passport":
        // Use existing countries - show country label and set country value as value
        return countries.map(country => ({
          value: country.value,  // e.g., "AE" or country code
          label: country.label   // e.g., "United Arab Emirates"
        }));
      case "GCC ID":
        // Filter GCC countries
        const gccCountryNames = ["United Arab Emirates", "Saudi Arabia", "Kuwait", "Qatar", "Bahrain", "Oman"];
        const gccCountries = countries.filter(country => 
          gccCountryNames.includes(country.label)
        );
        return gccCountries.map(country => ({
          value: country.value,  // e.g., "AE", "SA", etc.
          label: country.label   // e.g., "United Arab Emirates"
        }));
      case "Govt. Issued ID":
        return [
          { value: "Ministry of Interior", label: "Ministry of Interior" },
          { value: "Dubai Health Authority", label: "Dubai Health Authority" },
          { value: "Department of Economy and Tourism", label: "Department of Economy and Tourism" },
          { value: "Roads and Transport Authority", label: "Roads and Transport Authority" },
          { value: "Dubai Municipality", label: "Dubai Municipality" },
          { value: "Other Government Authority", label: "Other Government Authority" },
        ];
      default:
        return [];
    }
  };

  // Update issuing authorities when ID type changes
  useEffect(() => {
    if (idType && countries.length > 0) {
      const authorities = getIssuingAuthorities(idType);
      setIssuingAuthorityOptions(authorities);
      // Only reset if the current issuingAuthority is not in the new options
      const isCurrentValid = authorities.some(auth => auth.value === issuingAuthority);
      if (!isCurrentValid && issuingAuthority) {
        setIssuingAuthority("");
      }
    } else {
      setIssuingAuthorityOptions([]);
    }
  }, [idType, countries]);

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

  const deleteExistingDocument = (docId: number) => {
    setExistingDocuments(existingDocuments.filter((doc) => doc.id !== docId))
    setDeletedDocumentIds([...deletedDocumentIds, docId])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const requiredFields: Record<string, string> = {
      'First Name': firstName,
      'Last Name': lastName,
      'Date of Birth': dob,
      'Address': address,
      'City': city,
      'State': state,
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
    }

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field, _]) => field)

    if (emptyFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in: ${emptyFields.join(', ')}`,
      })
      return
    }

    const payload = {
      customer_type: "individual",
      onboarding_type: "full",
      screening_fuzziness: "OFF",
      remarks,
      deleted_document_ids: deletedDocumentIds,
      individual_details: {
        first_name: firstName,
        last_name: lastName,
        dob,
        residential_status: residentialStatus,
        address,
        city,
        state:state,
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
              Financial Details
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

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="mt-0">
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
                    <Input type="date" className={FIELD_CLASS} value={dob} onChange={e => setDob(e.target.value)} />
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
                    <RequiredLabel text="State" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter state" value={state} onChange={e => setState(e.target.value)} />
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
                    <input className={FIELD_CLASS} placeholder="Enter contact number" value={contactNo} onChange={e => setContactNo(e.target.value)} />
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
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Identification Tab - WITH DEPENDENT DROPDOWN */}
          <TabsContent value="identification" className="mt-0">
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Identification Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID Type Dropdown */}
                  <div>
                    <RequiredLabel text="ID Type" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={idTypes}
                      value={idType}
                      onValueChange={(value) => {
                        if (typeof value === 'string') {
                          setIdType(value);
                          setIssuingAuthority(""); // Reset when ID type changes
                        }
                      }}
                      placeholder="Select an ID type"
                      searchPlaceholder="Search type..."
                      className={FIELD_CLASS}
                    />
                  </div>

                  {/* ID No */}
                  <div>
                    <RequiredLabel text="ID No" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter ID number" value={idNo} onChange={e => setIdNo(e.target.value)} />
                  </div>

                  {/* ID Issued By - DYNAMIC DEPENDENT DROPDOWN */}
                  <div>
                    <RequiredLabel text="ID Issued By" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={issuingAuthorityOptions}
                      value={issuingAuthority}
                      onValueChange={(value) => {
                        if (typeof value === 'string') {
                          setIssuingAuthority(value);
                        }
                      }}
                      placeholder={idType ? "Select issuing authority" : "Select ID type first"}
                      searchPlaceholder="Search authority..."
                      className={FIELD_CLASS}
                      disabled={!idType}
                    />
                  </div>

                  {/* ID Issued At Country */}
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

                  {/* ID Issued Date */}
                  <div>
                    <RequiredLabel text="ID Issued Date" className={FIELD_LABEL_CLASS} />
                    <Input type="date" className={FIELD_CLASS} value={idIssueDate} onChange={e => setIdIssueDate(e.target.value)} />
                  </div>

                  {/* ID Expiry Date */}
                  <div>
                    <RequiredLabel text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                    <Input type="date" className={FIELD_CLASS} value={idExpiryDate} onChange={e => setIdExpiryDate(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional-info" className="mt-0">
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
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Upload Documents</h4>
                </div>

                {/* Existing Documents */}
                {existingDocuments.length > 0 && (
                  <div className="mb-6">
                    <label className={FIELD_LABEL_CLASS}>Existing Documents</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                      {existingDocuments.map((doc: any, idx: number) => (
                        <div key={doc.id || idx} className="relative group rounded-xl border border-border/60 bg-background/50 p-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/10 hover:bg-destructive/20"
                            onClick={() => deleteExistingDocument(doc.id)}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                          {doc.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.file_name || "") ? (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={doc.file_url}
                                alt={doc.file_name || "Document"}
                                className="w-full h-24 object-cover rounded-lg mb-2"
                              />
                            </a>
                          ) : (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center h-24 bg-muted/30 rounded-lg mb-2"
                            >
                              <FileCheck className="w-8 h-8 text-muted-foreground" />
                            </a>
                          )}
                          <p className="text-xs text-muted-foreground truncate">{doc.file_name || "Document"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Documents */}
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

          <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-6 z-10 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-[150px] h-12"
              onClick={() => router.push("/dashboard/customers")}
            >
              Cancel
            </Button>
            <Button
              className="min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              type="submit"
            >
              Update Information
            </Button>
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
  const [state, setState] = useState(corp.state || "")
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
  const [purposeOfRelation, setPurposeOfRelation] = useState(corp.purpose_of_onboarding || "")
  
  const [productSource, setProductSource] = useState(corp.product_source || "")
  const [paymentMode, setPaymentMode] = useState(corp.payment_mode || "")
  const [deliveryChannel, setDeliveryChannel] = useState(corp.delivery_channel || "")
  const [expectedNoOfTransactions, setExpectedNoOfTransactions] = useState(corp.expected_no_of_transactions?.toString() || "")
  const [expectedVolume, setExpectedVolume] = useState(corp.expected_volume?.toString() || "")
  const [dualUseGoods, setDualUseGoods] = useState(!!corp.dual_use_goods)
  const [kycDocumentsCollected, setKycDocumentsCollected] = useState(!!corp.kyc_documents_collected_with_form)
  const [isRegisteredInGoaml, setIsRegisteredInGoaml] = useState(!!corp.is_entity_registered_in_GOAML)
  const [hasAdverseNews, setHasAdverseNews] = useState(!!corp.is_entity_having_adverse_news)
  
  // AML Questionnaires from question_answers
  const questionnaires = (corp.question_answers || []).map((qa: any) => ({
    id: qa.compliance_question_id || qa.question?.id,
    question: qa.question?.question || "",
    category: qa.question?.category || "",
    default_answer: qa.answer,
  })).filter((q: any) => q.id && q.question)

  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<number, 1 | 0 | null>>(() => {
    const answers: Record<number, 1 | 0 | null> = {}
    const questionAnswers = corp.question_answers || []
    questionAnswers.forEach((qa: any) => {
      if (qa.compliance_question_id) {
        answers[qa.compliance_question_id] = qa.answer ? 1 : 0
      }
    })
    return answers
  })

  const setQuestionnaireAnswer = (questionId: number, value: 1 | 0) => {
    setQuestionnaireAnswers((prev) => ({ ...prev, [questionId]: value }))
  }
  
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
    // { value: "UBO", label: "UBO" },
    { value: "SHRHL", label: "SHARE HOLDER" },
    // { value: "PARTNER", label: "PARTNER" },
    // { value: "DIR", label: "DIRECTOR" },
    // { value: "MAN", label: "MANAGER" },
    // { value: "REPRESENTATIVE", label: "REPRESENTATIVE" },
  ]
  
  const [productTypes, setProductTypes] = useState<string[]>(
    (customerData.products || []).map((p: any) => p.id.toString())
  )
  const [operationCountries, setOperationCountries] = useState<string[]>(
    (customerData.country_operations || []).map((c: any) => c.country)
  )
  // const [fuzziness, setFuzziness] = useState(customerData.screening_fuzziness || "")
  const [remarks, setRemarks] = useState(customerData.remarks || "")
  const [files, setFiles] = useState<File[]>([])
  const [existingDocuments, setExistingDocuments] = useState<any[]>(customerData.documents || [])
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Related persons
  const [relatedPersons, setRelatedPersons] = useState<any[]>(
    (corp.related_persons || []).map((rp: any) => ({
      type: rp.type || "Individual",
      name: rp.name || "",
      is_pep: !!rp.is_pep,
      nationality: rp.nationality || "",
      id_type: rp.id_type || "",
      id_no: rp.id_no || "",
      id_issue: rp.id_issue || rp.id_issue_date || rp.id_issue || "",
      id_expiry: rp.id_expiry || rp.id_expiry_date || rp.id_expiry || "",
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

  const deleteExistingDocument = (docId: number) => {
    setExistingDocuments(existingDocuments.filter((doc) => doc.id !== docId))
    setDeletedDocumentIds([...deletedDocumentIds, docId])
    console.log("Deleting document with ID:", docId)
    console.log("Updated deletedDocumentIds:", deletedDocumentIds)
  }

  const addRelatedPerson = () => {
    setRelatedPersons([
      ...relatedPersons,
      {
        type: "Individual",
        name: "",
        is_pep: false,
        nationality: "",
        id_type: "",
        id_no: "",
        id_issue: "",
        id_expiry: "",
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
    console.log("deletedDocumentIds data when submitting:", deletedDocumentIds)

    // Validation - check required fields
    const requiredFields: Record<string, string> = {
      // Company Information
      'Company Name': companyName,
      'Company Address': companyAddress,
      'State': state,
      'City': city,
      'Country of Incorporation': countryIncorporated,
      'Customer Type': customerType,
      // Contact Information
      'Country Code (Mobile)': mobileCountryCode,
      'Contact Mobile No': mobileNo,
      'Email': email,
      // Identity Information
      'Trade License/CR No': tradeLicenseNo,
      'Trade License/CR Issued At': tradeLicenseIssuedAt,
      'Trade License/COI Issued By': tradeLicenseIssuedBy,
      'Trade License/CR Issued Date': licenseIssueDate,
      'Trade License/CR Expiry Date': licenseExpiryDate,
      // Business Information
      'Entity Type': entityType,
      'Countries of Operation': operationCountries.length > 0 ? 'filled' : '',
      'Business Activity': businessActivity,
      'Purpose of Relation': purposeOfRelation,
      // Product Details
      'Product Type': productTypes.length > 0 ? 'filled' : '',
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
      })
      return
    }

    // Validate UBO/Related persons
    for (let i = 0; i < relatedPersons.length; i++) {
      const person = relatedPersons[i]
      const uboRequiredFields: Record<string, string> = {
        [`UBO ${i + 1} - Type`]: person.type,
        [`UBO ${i + 1} - Name`]: person.name,
        [`UBO ${i + 1} - Nationality`]: person.nationality,
        [`UBO ${i + 1} - ID Type`]: person.id_type,
        [`UBO ${i + 1} - ID No`]: person.id_no,
        [`UBO ${i + 1} - ID Issue Date`]: person.id_issue,
        [`UBO ${i + 1} - ID Expiry Date`]: person.id_expiry,
        [`UBO ${i + 1} - Date of Birth`]: person.dob,
        [`UBO ${i + 1} - Role`]: person.role,
        [`UBO ${i + 1} - Percentage of Share`]: person.ownership_percentage,
      }

      const uboEmptyFields = Object.entries(uboRequiredFields)
        .filter(([_, value]) => !value)
        .map(([field, _]) => field)

      if (uboEmptyFields.length > 0) {
        toast({
          title: "Required fields missing",
          description: `Please fill in: ${uboEmptyFields.join(', ')}`,
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

    const payload = {
      customer_type: "corporate",
      onboarding_type: "full",
      screening_fuzziness: "OFF",
      remarks,
      deleted_document_ids: deletedDocumentIds,
      corporate_details: {
        company_name: companyName,
        company_address: companyAddress,
        state: state,
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
        purpose_of_onboarding: purposeOfRelation,
      },
      corporate_related_persons: relatedPersons.map((rp: any) => ({
        type: rp.type,
        name: rp.name,
        is_pep: rp.is_pep ? 1 : 0,
        nationality: rp.nationality,
        id_type: rp.id_type,
        id_no: rp.id_no,
        id_issue: rp.id_issue || "",
        id_expiry: rp.id_expiry || "",
        dob: rp.dob,
        role: rp.role,
        ownership_percentage: rp.ownership_percentage,
      })),
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

          {/* Company Info Tab */}
          <TabsContent value="company" className="mt-0">
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
                  <div className="md:col-span-2">
                    <RequiredLabel text="State" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter the State" value={state} onChange={e => setState(e.target.value)} />
                  </div>
                  <div>
                    <RequiredLabel text="City" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter the city" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Country of Incorporation" className={FIELD_LABEL_CLASS} />
                    <Combobox
                      options={countries}
                      value={countryIncorporated}
                      onValueChange={handleSingleSelect(setCountryIncorporated)}
                      placeholder="Select a country"
                      searchPlaceholder="Search country..."
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={FIELD_LABEL_CLASS}>PO Box No</label>
                    <input className={FIELD_CLASS} placeholder="Enter the PO Box No" value={poBox} onChange={e => setPoBox(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Customer Type" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter customer type" value={customerType} onChange={e => setCustomerType(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-0">
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
                      <label className={FIELD_LABEL_CLASS}>Office Contact Country Code</label>
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
                      <label className={FIELD_LABEL_CLASS}>Office Contact No</label>
                      <input className={FIELD_CLASS} placeholder="Enter the Office Contact No" value={officeNo} onChange={e => setOfficeNo(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <RequiredLabel text="Mobile Contact Country Code" className={FIELD_LABEL_CLASS} />
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
                      <RequiredLabel text="Mobile Contact No" className={FIELD_LABEL_CLASS} />
                      <input className={FIELD_CLASS} placeholder="Enter the Mobile Contact No" value={mobileNo} onChange={e => setMobileNo(e.target.value)} />
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

          {/* Identity Information Tab */}
          <TabsContent value="identity" className="mt-0">
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
                    <input className={FIELD_CLASS} placeholder="Enter issuing location" value={tradeLicenseIssuedAt} onChange={e => setTradeLicenseIssuedAt(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/COI Issued By" className={FIELD_LABEL_CLASS} />
                    <input className={FIELD_CLASS} placeholder="Enter issuing authority" value={tradeLicenseIssuedBy} onChange={e => setTradeLicenseIssuedBy(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/CR Issued Date" className={FIELD_LABEL_CLASS} />
                    <Input type="date" className={FIELD_CLASS} value={licenseIssueDate} onChange={e => setLicenseIssueDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <RequiredLabel text="Trade License/CR Expiry Date" className={FIELD_LABEL_CLASS} />
                    <Input type="date" className={FIELD_CLASS} value={licenseExpiryDate} onChange={e => setLicenseExpiryDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={FIELD_LABEL_CLASS}>VAT Registration Number</label>
                    <input className={FIELD_CLASS} placeholder="Enter VAT Registration Number" value={vatRegistrationNo} onChange={e => setVatRegistrationNo(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className={FIELD_LABEL_CLASS}>Tenancy Contract Expiry Date</label>
                    <Input type="date" className={FIELD_CLASS} value={tenancyContractExpiryDate} onChange={e => setTenancyContractExpiryDate(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Information Tab */}
          <TabsContent value="operations" className="mt-0">
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
                    <RequiredLabel text="Entity legal status" className={FIELD_LABEL_CLASS} />
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
                      value={operationCountries}
                      onValueChange={handleMultiSelect(setOperationCountries)}
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
                    <div className="space-y-2">
                      <label className={FIELD_LABEL_CLASS}>Account Holding Bank Name</label>
                      <input
                        className={FIELD_CLASS}
                        placeholder="Enter bank name (max 50 characters)"
                        value={accountHoldingBankName}
                        onChange={e => setAccountHoldingBankName(e.target.value)}
                      />
                    </div>
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

          {/* Product Details Tab */}
          <TabsContent value="product" className="mt-0">
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
                      value={productTypes}
                      onValueChange={handleMultiSelect(setProductTypes)}
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
                        <input type="radio" name="dealWithGoods" value="yes" checked={dualUseGoods} onChange={() => setDualUseGoods(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dealWithGoods" value="no" checked={!dualUseGoods} onChange={() => setDualUseGoods(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AML Questionnaires Tab */}
          <TabsContent value="aml" className="mt-0">
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
                    <RequiredLabel text="Is entity registered in GOAML?" className={FIELD_LABEL_CLASS} />
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isRegisteredGoAML" value="yes" checked={isRegisteredInGoaml} onChange={() => setIsRegisteredInGoaml(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isRegisteredGoAML" value="no" checked={!isRegisteredInGoaml} onChange={() => setIsRegisteredInGoaml(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <RequiredLabel text="KYC documents collected with form?" className={FIELD_LABEL_CLASS} />
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="kycCollected" value="yes" checked={kycDocumentsCollected} onChange={() => setKycDocumentsCollected(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="kycCollected" value="no" checked={!kycDocumentsCollected} onChange={() => setKycDocumentsCollected(false)} className="accent-primary" />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3 hidden">
                    <RequiredLabel text="Is Entity Having Material Match" className={FIELD_LABEL_CLASS} />
                    <p className="text-xs text-primary/80 mb-3">We don't Check adverse news feed</p>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isAdverseNews" value="yes" checked={hasAdverseNews} onChange={() => setHasAdverseNews(true)} className="accent-primary" />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="isAdverseNews" value="no" checked={!hasAdverseNews} onChange={() => setHasAdverseNews(false)} className="accent-primary" />
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

          {/* Partner/Representative Tab */}
          <TabsContent value="related" className="mt-0">
            <Card className={CARD_STYLE}>
              <CardContent className="p-6">
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
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
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
                        <RequiredLabel text="Type" className={FIELD_LABEL_CLASS} />
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
                        <RequiredLabel text="Name" className={FIELD_LABEL_CLASS} />
                        <Input
                          value={person.name}
                          onChange={(e) => updateRelatedPerson(index, "name", e.target.value)}
                          placeholder="Enter Name"
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <RequiredLabel text="Politically Exposed Person (PEP)?" className={FIELD_LABEL_CLASS} />
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
                        <RequiredLabel className={FIELD_LABEL_CLASS} text="Nationality" />
                        <Combobox
                          options={countries}
                          value={person.nationality}
                          onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "nationality", v)}
                          placeholder="Select nationality"
                          searchPlaceholder="Search nationality..."
                        />
                      </div>
                      <div>
                        <RequiredLabel text="ID Type" className={FIELD_LABEL_CLASS} />
                        <Combobox
                          options={idTypes}
                          value={person.id_type}
                          onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "id_type", v)}
                          placeholder="Passport"
                          searchPlaceholder="Search type..."
                        />
                      </div>
                      <div>
                        <RequiredLabel text="ID No/License No" className={FIELD_LABEL_CLASS} />
                        <Input
                          value={person.id_no}
                          onChange={(e) => updateRelatedPerson(index, "id_no", e.target.value)}
                          placeholder="Enter ID License No"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <RequiredLabel text="ID Issue Date" className={FIELD_LABEL_CLASS} />
                        <Input
                          type="date"
                          placeholder="mm/dd/yyyy"
                          value={person.id_issue}
                          onChange={(e) => updateRelatedPerson(index, "id_issue", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <RequiredLabel text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                        <Input
                          type="date"
                          placeholder="mm/dd/yyyy"
                          value={person.id_expiry}
                          onChange={(e) => updateRelatedPerson(index, "id_expiry", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <RequiredLabel text="Date of Birth" className={FIELD_LABEL_CLASS} />
                        <Input
                          type="date"
                          placeholder="mm/dd/yyyy"
                          value={person.dob}
                          onChange={(e) => updateRelatedPerson(index, "dob", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <RequiredLabel text="Role" className={FIELD_LABEL_CLASS} />
                        <Combobox
                          options={roles}
                          value={person.role}
                          onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "role", v)}
                          placeholder="UBO"
                          searchPlaceholder="Search role..."
                        />
                      </div>
                      <div>
                        <RequiredLabel text="Percentage of Share" className={FIELD_LABEL_CLASS} />
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Information Tab */}
          <TabsContent value="additional" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <Label htmlFor="fuzziness">Screening Fuzziness</Label>
                  <Combobox
                    options={screeningFuzziness}
                    value={fuzziness}
                    onValueChange={handleSingleSelect(setFuzziness)}
                    placeholder="Select fuzziness"
                    searchPlaceholder="Search fuzziness..."
                  />
                </div> */}
                <div className="col-span-2">
                  <label className={FIELD_LABEL_CLASS}>Remarks</label>
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
          <TabsContent value="documents" className="mt-0">
            <Card className="p-6 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Upload Documents</h4>
              </div>

              {/* Existing Documents */}
              {existingDocuments.length > 0 && (
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Existing Documents</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingDocuments.map((doc: any, idx: number) => (
                      <div key={doc.id || idx} className="border rounded-lg p-3 bg-white relative group">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 hover:bg-red-200"
                          onClick={() => deleteExistingDocument(doc.id)}
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                        {doc.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.file_name || "") ? (
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={doc.file_url}
                              alt={doc.file_name || "Document"}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                          </a>
                        ) : (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center h-24 bg-gray-100 rounded mb-2"
                          >
                            <FileCheck className="w-8 h-8 text-gray-400" />
                          </a>
                        )}
                        <p className="text-xs text-gray-600 truncate">{doc.file_name || "Document"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Documents */}
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
                Update Information
              </Button>
            </div>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
