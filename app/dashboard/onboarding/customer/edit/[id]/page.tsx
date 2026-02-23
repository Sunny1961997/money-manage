"use client"

import { Spinner } from "@/components/ui/spinner"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RequiredLabel } from "@/components/ui/required-label"
import { Combobox } from "@/components/ui/combobox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  User,
  Building2,
  MapPin,
  Phone,
  Award as IdCard,
  Briefcase,
  DollarSign,
  FileText,
  Loader2,
  Upload,
  Plus,
  Trash2,
  Globe,
  ShieldCheck,
  Users,
  Package,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatContactNumber } from "@/lib/utils"

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

const PAGE_CONTAINER_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const HEADER_CARD_CLASS =
  "relative overflow-hidden rounded-3xl border-border/50 bg-card/60 bg-gradient-to-br from-background via-background to-primary/10 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const FORM_SECTION_CARD_CLASS =
  "rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 sm:p-6 shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const TABS_BAR_CLASS =
  "sticky top-0 z-20 mb-4 rounded-2xl border border-border/50 bg-background/80 px-2 py-3 backdrop-blur-md"
const TABS_LIST_CLASS = "grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0 md:grid-cols-3 lg:grid-cols-5"
const TABS_TRIGGER_CLASS =
  "h-10 w-full justify-center rounded-xl px-2 text-center text-sm whitespace-nowrap transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
const SECONDARY_LABEL_CLASS = "text-xs font-extrabold uppercase tracking-[0.14em] text-foreground"
const FIELD_LABEL_CLASS = "mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const FORM_SECTION_HEADING_CLASS = "text-sm font-semibold tracking-tight"
const FORM_SUPPORT_TEXT_CLASS = "text-xs text-muted-foreground"
const FORM_QUESTION_GROUP_TITLE_CLASS = "mb-2 text-sm font-semibold tracking-tight"
const FORM_QUESTION_TEXT_CLASS = "text-sm font-medium text-foreground"
const ACTION_BAR_CLASS =
  "sticky bottom-0 z-10 mt-6 border-t border-border/60 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
const CANCEL_BUTTON_CLASS =
  "h-12 rounded-full border-zinc-300 !bg-white px-8 text-base font-semibold text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:!bg-zinc-100 hover:text-zinc-900 active:!bg-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-zinc-600 dark:!bg-zinc-900 dark:text-zinc-100 dark:hover:!bg-zinc-800 dark:active:!bg-zinc-700 hover:shadow-md"
const SAVE_BUTTON_CLASS = "h-12 rounded-full px-8 text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
const CORPORATE_GRID_CLASS = "grid grid-cols-1 gap-6 md:grid-cols-2"
const RELATED_PERSON_GRID_CLASS =
  "grid grid-cols-1 gap-3 md:grid-cols-2 [&_[data-slot=input]]:mt-1.5 [&_[data-slot=input]]:h-10 [&_[data-slot=input]]:rounded-xl [&_[data-slot=input]]:border-border/70 [&_[data-slot=input]]:bg-background/90 [&_[data-slot=input]]:transition-colors [&_[data-slot=input]:focus-visible]:border-primary/80 [&_[data-slot=input]:focus-visible]:ring-0 [&_[data-slot=input]:focus-visible]:ring-transparent [&_[data-slot=input]:focus-visible]:ring-offset-0 [&_[data-slot=button][role=combobox]]:mt-1.5 [&_[data-slot=button][role=combobox]]:h-10 [&_[data-slot=button][role=combobox]]:rounded-xl [&_[data-slot=button][role=combobox]]:border-border/70 [&_[data-slot=button][role=combobox]]:bg-background/90 [&_[data-slot=button][role=combobox]]:transition-colors [&_[data-slot=button][role=combobox]:focus-visible]:border-primary/80 [&_[data-slot=button][role=combobox]:focus-visible]:ring-0 [&_[data-slot=button][role=combobox]:focus-visible]:ring-transparent [&_[data-slot=button][role=combobox]:focus-visible]:ring-offset-0"
const ID_BADGE_CLASS = "inline-flex items-center rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground"
const INDIVIDUAL_BADGE_CLASS = "border-primary/25 bg-primary/10 text-primary"
const CORPORATE_BADGE_CLASS = "border-zinc-300 bg-zinc-200 text-zinc-700"

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading form data...</p>
      </div>
    )
  }

  if (!customerData) return <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">Customer not found</div>

  const customerLabel =
    customerType === "individual"
      ? [customerData?.individual_detail?.first_name, customerData?.individual_detail?.last_name].filter(Boolean).join(" ")
      : customerData?.corporate_detail?.company_name
  const fallbackLabel = customerData?.name || "Customer"
  const customerTitle = customerLabel || fallbackLabel
  const customerEmail = customerData?.individual_detail?.email || customerData?.corporate_detail?.email || customerData?.email

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <Card className={HEADER_CARD_CLASS}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="min-w-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-full border-border/70 bg-background/85 px-4 text-xs font-semibold"
                onClick={() => router.push("/dashboard/customers")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Customers
              </Button>

              <div className="mt-5 flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  {customerType === "individual" ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                </div>
                <div className="min-w-0 space-y-2.5">
                  <p className={SECONDARY_LABEL_CLASS}>Compliance Dashboard</p>
                  <h1 className="break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{customerTitle}</h1>
                  <p className="text-sm text-muted-foreground">Customer onboarding profile</p>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-border/60 bg-background/75 p-4 shadow-[0_10px_28px_-22px_oklch(0.28_0.06_260/0.5)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Record Details</p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Customer ID</span>
                  <span className={ID_BADGE_CLASS}>#{id}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${customerType === "individual" ? INDIVIDUAL_BADGE_CLASS : CORPORATE_BADGE_CLASS
                      }`}
                  >
                    {customerType === "individual" ? "Individual" : "Corporate"}
                  </span>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Email</p>
                  <p className="mt-1 break-all text-sm text-foreground/90">{customerEmail || "Not provided"}</p>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <p className="text-xs text-muted-foreground">
                    Update onboarding details across the tabs below, then save with <span className="font-medium text-foreground">Update Information</span>.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Card>

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
  // const [fuzziness, setFuzziness] = useState(customerData.screening_fuzziness || "")
  const [remarks, setRemarks] = useState(customerData.remarks || "")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [activeTab, setActiveTab] = useState("personal")
  const [submitting, setSubmitting] = useState(false)

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
    if (submitting) return
    setSubmitting(true)

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
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className={TABS_BAR_CLASS}>
          <TabsList className={TABS_LIST_CLASS}>
            <TabsTrigger value="personal" className={TABS_TRIGGER_CLASS}>
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="address" className={TABS_TRIGGER_CLASS}>
              Address Information
            </TabsTrigger>
            <TabsTrigger value="contact" className={TABS_TRIGGER_CLASS}>
              Contact Information
            </TabsTrigger>
            <TabsTrigger value="gender-pep" className={TABS_TRIGGER_CLASS}>
              Gender and PEP Status
            </TabsTrigger>
            <TabsTrigger value="occupation" className={TABS_TRIGGER_CLASS}>
              Occupation and Income
            </TabsTrigger>
            <TabsTrigger value="financial" className={TABS_TRIGGER_CLASS}>
              Financial Details
            </TabsTrigger>
            <TabsTrigger value="transactions" className={TABS_TRIGGER_CLASS}>
              Transactions and ID Details
            </TabsTrigger>
            <TabsTrigger value="identification" className={TABS_TRIGGER_CLASS}>
              Identification Details
            </TabsTrigger>
            <TabsTrigger value="additional-info" className={TABS_TRIGGER_CLASS}>
              Additional Information
            </TabsTrigger>
            <TabsTrigger value="documents" className={TABS_TRIGGER_CLASS}>
              Upload Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Personal Information</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RequiredLabel text="First Name" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Last Name" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Date of Birth" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} type="date" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Residential Status" className={FIELD_LABEL_CLASS} />
                  <select className={FIELD_CLASS} value={residentialStatus} onChange={e => setResidentialStatus(e.target.value)}>
                    <option value="resident">Resident</option>
                    <option value="non-resident">Non-Resident</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Address Information</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Address" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="City" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} placeholder="Enter city" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2">
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
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Contact Information</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <RequiredLabel text="Contact No" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} placeholder="Enter contact number" value={contactNo} onChange={e => setContactNo(formatContactNumber(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Email" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gender-pep" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Gender and PEP Status</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RequiredLabel text="Gender" className={FIELD_LABEL_CLASS} />
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
                  <RequiredLabel text="Politically Exposed Person (PEP)?" className={FIELD_LABEL_CLASS} />
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
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Occupation and Income</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Financial Details</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Transactions and ID Details</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <label className={FIELD_LABEL_CLASS}>Expected No of Transactions</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={expectedNoOfTransactions}
                    onChange={(e) => setExpectedNoOfTransactions(e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <label className={FIELD_LABEL_CLASS}>Expected Volume</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="identification" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IdCard className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Identification Details</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <RequiredLabel text="ID No" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} placeholder="Enter ID number" value={idNo} onChange={e => setIdNo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="ID Issued By" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} placeholder="Enter issuing authority" value={issuingAuthority} onChange={e => setIssuingAuthority(e.target.value)} />
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <RequiredLabel text="ID Issued Date" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} type="date" value={idIssueDate} onChange={e => setIdIssueDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                  <Input className={FIELD_CLASS} type="date" value={idExpiryDate} onChange={e => setIdExpiryDate(e.target.value)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="additional-info" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Additional Information</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Dual Nationality" className={FIELD_LABEL_CLASS} />
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
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Is Customer Facing any adverse event?" className={FIELD_LABEL_CLASS} />
                  <p className="text-xs text-primary/80 mb-2">We don't Check adverse news feed</p>
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
                {/* <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Screening Fuzziness" />
                  <Combobox
                    options={screeningFuzziness}
                    value={fuzziness}
                    onValueChange={handleSingleSelect(setFuzziness)}
                    placeholder="Select fuzziness level"
                    searchPlaceholder="Search fuzziness..."
                  />
                </div> */}
                <div className="md:col-span-2 space-y-2">
                  <label className={FIELD_LABEL_CLASS}>Remarks</label>
                  <Textarea placeholder="Enter any remarks" className={TEXTAREA_CLASS} rows={4} value={remarks} onChange={e => setRemarks(e.target.value)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
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
                  />
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background/50">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <div className={ACTION_BAR_CLASS}>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className={`w-full sm:w-auto ${CANCEL_BUTTON_CLASS}`}
                onClick={() => router.push("/dashboard/customers")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button className={`w-full sm:w-auto ${SAVE_BUTTON_CLASS}`} type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Information"
                )}
              </Button>
            </div>
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
  // const [fuzziness, setFuzziness] = useState(customerData.screening_fuzziness || "")
  const [remarks, setRemarks] = useState(customerData.remarks || "")
  const [files, setFiles] = useState<File[]>([])
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
      id_issue_date: rp.id_issue_date || "",
      id_expiry_date: rp.id_expiry_date || "",
      dob: rp.dob || "",
      role: rp.role || "",
      ownership_percentage: rp.ownership_percentage || "",
    }))
  )

  const [activeTab, setActiveTab] = useState("company")
  const [submitting, setSubmitting] = useState(false)

  // Compliance questionnaire answers (prefill from API)
  // Stored as: { [question_id]: boolean | null }
  const existingQAs: any[] = Array.isArray(corp?.question_answers) ? corp.question_answers : []
  const [complianceQuestionAnswers, setComplianceQuestionAnswers] = useState<Record<number, boolean | null>>(() => {
    const map: Record<number, boolean | null> = {}
    for (const qa of existingQAs) {
      const qid = Number(qa?.compliance_question_id ?? qa?.question?.id)
      if (!Number.isFinite(qid) || qid <= 0) continue
      // backend returns answer as boolean (or null)
      map[qid] = qa?.answer === null || qa?.answer === undefined ? null : Boolean(qa.answer)
    }
    return map
  })

  const setComplianceAnswer = (questionId: number, v: "yes" | "no" | "") => {
    setComplianceQuestionAnswers(prev => ({
      ...prev,
      [questionId]: v === "" ? null : v === "yes",
    }))
  }

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
        type: "Individual",
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
    if (submitting) return
    setSubmitting(true)

    const payload = {
      customer_type: "corporate",
      onboarding_type: "full",
      screening_fuzziness: "OFF",
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

      // Add compliance questionnaire answers for Laravel
      aml_questionnaires: Object.entries(complianceQuestionAnswers)
        .filter(([qid]) => Number(qid) > 0)
        .map(([qid, answer]) => ({
          question_id: Number(qid),
          answer: answer === null ? null : Boolean(answer),
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
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className={TABS_BAR_CLASS}>
          <TabsList className={TABS_LIST_CLASS}>
            <TabsTrigger value="company" className={TABS_TRIGGER_CLASS}>
              Company Information
            </TabsTrigger>
            <TabsTrigger value="contact" className={TABS_TRIGGER_CLASS}>
              Contact Information
            </TabsTrigger>
            <TabsTrigger value="identity" className={TABS_TRIGGER_CLASS}>
              Identity Information
            </TabsTrigger>
            <TabsTrigger value="operations" className={TABS_TRIGGER_CLASS}>
              Operations Information
            </TabsTrigger>
            <TabsTrigger value="product" className={TABS_TRIGGER_CLASS}>
              Product Details
            </TabsTrigger>
            <TabsTrigger value="aml" className={TABS_TRIGGER_CLASS}>
              AML Compliance
            </TabsTrigger>
            <TabsTrigger value="related" className={TABS_TRIGGER_CLASS}>
              Partner/Representative
            </TabsTrigger>
            <TabsTrigger value="additional" className={TABS_TRIGGER_CLASS}>
              Additional Information
            </TabsTrigger>
            <TabsTrigger value="documents" className={TABS_TRIGGER_CLASS}>
              Upload Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <form className="space-y-6 pb-0" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}>

          {/* Company Info Tab */}
          <TabsContent value="company" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Company Information</h4>
              </div>
              <div className={CORPORATE_GRID_CLASS}>
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Company Name" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Company Address" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter full address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="City" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Country Incorporated" className={FIELD_LABEL_CLASS} />
                  <Combobox
                    options={countries}
                    value={countryIncorporated}
                    onValueChange={handleSingleSelect(setCountryIncorporated)}
                    placeholder="Select country"
                    searchPlaceholder="Search country..."
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <label className={FIELD_LABEL_CLASS}>P.O. Box</label>
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter PO Box"
                    value={poBox}
                    onChange={(e) => setPoBox(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Customer Type" className={FIELD_LABEL_CLASS} />
                  <Combobox
                    options={occupations}
                    value={customerType}
                    onValueChange={handleSingleSelect(setCustomerType)}
                    placeholder="Select type"
                    searchPlaceholder="Search type..."
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Contact Information</h4>
              </div>
              <div className={CORPORATE_GRID_CLASS}>
                <div className="space-y-2">
                  <RequiredLabel text="Office No (Country Code)" className={FIELD_LABEL_CLASS} />
                  <Combobox
                    options={countryCodes}
                    value={officeCountryCode}
                    onValueChange={handleSingleSelect(setOfficeCountryCode)}
                    placeholder="Select code"
                    searchPlaceholder="Search code..."
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Office Number" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter office number"
                    value={officeNo}
                    onChange={(e) => setOfficeNo(formatContactNumber(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Mobile No (Country Code)" className={FIELD_LABEL_CLASS} />
                  <Combobox
                    options={countryCodes}
                    value={mobileCountryCode}
                    onValueChange={handleSingleSelect(setMobileCountryCode)}
                    placeholder="Select code"
                    searchPlaceholder="Search code..."
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Mobile Number" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter mobile number"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(formatContactNumber(e.target.value))}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Email Address" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Identity Information Tab */}
          <TabsContent value="identity" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IdCard className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Identity Information</h4>
              </div>
              <div className={CORPORATE_GRID_CLASS}>
                <div className="space-y-2">
                  <RequiredLabel text="Trade License Number" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter trade license number"
                    value={tradeLicenseNo}
                    onChange={(e) => setTradeLicenseNo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Trade License Issued At" className={FIELD_LABEL_CLASS} />
                  <Combobox
                    options={countries}
                    value={tradeLicenseIssuedAt}
                    onValueChange={handleSingleSelect(setTradeLicenseIssuedAt)}
                    placeholder="Select country"
                    searchPlaceholder="Search country..."
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="Trade License Issued By" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter issuing authority"
                    value={tradeLicenseIssuedBy}
                    onChange={(e) => setTradeLicenseIssuedBy(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="License Issue Date" className={FIELD_LABEL_CLASS} />
                  <Input
                    type="date"
                    className={FIELD_CLASS}
                    value={licenseIssueDate}
                    onChange={(e) => setLicenseIssueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <RequiredLabel text="License Expiry Date" className={FIELD_LABEL_CLASS} />
                  <Input
                    type="date"
                    className={FIELD_CLASS}
                    value={licenseExpiryDate}
                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={FIELD_LABEL_CLASS}>VAT Registration Number</label>
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter VAT registration number"
                    value={vatRegistrationNo}
                    onChange={(e) => setVatRegistrationNo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={FIELD_LABEL_CLASS}>Tenancy Contract Expiry Date</label>
                  <Input
                    type="date"
                    className={FIELD_CLASS}
                    value={tenancyContractExpiryDate}
                    onChange={(e) => setTenancyContractExpiryDate(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Operations Information Tab */}
          <TabsContent value="operations" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Operations Information</h4>
              </div>
              <div className={CORPORATE_GRID_CLASS}>
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
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Any other sister concern/branch?" className={FIELD_LABEL_CLASS} />
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
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Account Holding Bank Name" className={FIELD_LABEL_CLASS} />
                  <Input
                    className={FIELD_CLASS}
                    placeholder="Enter bank name (max 50 characters)"
                    value={accountHoldingBankName}
                    onChange={(e) => setAccountHoldingBankName(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Product Details Tab */}
          <TabsContent value="product" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Package className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Product Details</h4>
              </div>
              <div className={CORPORATE_GRID_CLASS}>
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <RequiredLabel text="Product Source" className={FIELD_LABEL_CLASS} />
                  <Combobox
                    options={product_sources}
                    value={productSource}
                    onValueChange={handleSingleSelect(setProductSource)}
                    placeholder="Select product source"
                    searchPlaceholder="Search source..."
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
                  <label className={FIELD_LABEL_CLASS}>Expected No of Transactions</label>
                  <Input
                    className={FIELD_CLASS}
                    type="number"
                    placeholder="0"
                    value={expectedNoOfTransactions}
                    onChange={(e) => setExpectedNoOfTransactions(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={FIELD_LABEL_CLASS}>Expected Volume</label>
                  <Input
                    className={FIELD_CLASS}
                    type="number"
                    placeholder="0"
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <RequiredLabel text="Deal with Goods?" className={FIELD_LABEL_CLASS} />
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
          <TabsContent value="aml" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">AML Compliance</h4>
              </div>
              <div className={CORPORATE_GRID_CLASS}>
                <div className="space-y-2">
                  <RequiredLabel text="KYC Documents Collected" className={FIELD_LABEL_CLASS} />
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
                <div className="space-y-2">
                  <RequiredLabel text="Registered in GOAML" className={FIELD_LABEL_CLASS} />
                  <RadioGroup value={isRegisteredInGoaml ? "yes" : "no"} onValueChange={handleBooleanRadio(setIsRegisteredInGoaml)} className="flex gap-6 mt-2">
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
                <div className="space-y-2">
                  <RequiredLabel text="Adverse News" className={FIELD_LABEL_CLASS} />
                  <RadioGroup value={hasAdverseNews ? "yes" : "no"} onValueChange={handleBooleanRadio(setHasAdverseNews)} className="flex gap-6 mt-2">
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

              {existingQAs.length > 0 ? (
                <>
                  <div className="pt-4 border-t mt-6 mb-4"></div>
                  <div className="space-y-4">
                    {Object.entries(
                      existingQAs.reduce((acc: Record<string, any[]>, qa: any) => {
                        const cat = qa?.question?.category || "Other"
                        if (!acc[cat]) acc[cat] = []
                        acc[cat].push(qa)
                        return acc
                      }, {})
                    ).map(([category, items]) => (
                      <div key={category} className="border rounded p-3">
                        <div className={FORM_QUESTION_GROUP_TITLE_CLASS}>{category}</div>
                        <div className="space-y-3">
                          {(items as any[]).map((qa: any) => {
                            const qid = Number(qa?.compliance_question_id ?? qa?.question?.id)
                            const qText = qa?.question?.question || "-"
                            const current = complianceQuestionAnswers[qid]
                            const value = current === true ? "yes" : current === false ? "no" : ""

                            return (
                              <div key={qa.id || `${qid}-${qText}`} className="rounded-xl border border-border/60 bg-background/50 p-5 shadow-sm">
                                <div className={FORM_QUESTION_TEXT_CLASS}>{qText} <span className="text-destructive">*</span></div>
                                <div className="mt-3">
                                  <RadioGroup
                                    value={value}
                                    onValueChange={(v) => (v === "yes" || v === "no" || v === "") && setComplianceAnswer(qid, v as any)}
                                    className="flex gap-6"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="yes" id={`cq-${qid}-yes`} />
                                      <Label htmlFor={`cq-${qid}-yes`}>Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="no" id={`cq-${qid}-no`} />
                                      <Label htmlFor={`cq-${qid}-no`}>No</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground mt-4 pt-4 border-t">No compliance questionnaire answers available.</div>
              )}
            </Card>
          </TabsContent>

          {/* Partner/Representative Tab */}
          <TabsContent value="related" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground tracking-tight">Partner/Representative Details</h4>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addRelatedPerson} className="rounded-full shadow-sm hover:translate-y-[-1px] transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Representative
                </Button>
              </div>

              {relatedPersons.map((person, index) => (
                <div key={index} className="relative group p-6 rounded-2xl border border-border/50 bg-muted/20 mb-6 last:mb-0 transition-all hover:bg-muted/30">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {index + 1}
                      </div>
                      <h5 className="font-semibold text-sm text-foreground uppercase tracking-wider">Representative Information</h5>
                    </div>
                    {relatedPersons.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRelatedPerson(index)}
                        className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className={RELATED_PERSON_GRID_CLASS}>
                    <div className="space-y-2">
                      <RequiredLabel text="Type" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={[
                          { value: "Individual", label: "Individual" },
                          { value: "Entity", label: "Entity" },
                        ]}
                        value={person.type}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "type", v)}
                        placeholder="Select type"
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="Full Name" className={FIELD_LABEL_CLASS} />
                      <Input
                        className={FIELD_CLASS}
                        value={person.name}
                        onChange={(e) => updateRelatedPerson(index, "name", e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <RequiredLabel text="Previously Exposed Person (PEP)?" className={FIELD_LABEL_CLASS} />
                      <RadioGroup
                        value={person.is_pep ? "yes" : "no"}
                        onValueChange={(v) => updateRelatedPerson(index, "is_pep", v === "yes")}
                        className="flex gap-8 mt-2"
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
                    <div className="space-y-2">
                      <RequiredLabel text="Nationality" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={countries}
                        value={person.nationality}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "nationality", v)}
                        placeholder="Select nationality"
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="ID Type" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={idTypes}
                        value={person.id_type}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "id_type", v)}
                        placeholder="Passport"
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="ID No/License No" className={FIELD_LABEL_CLASS} />
                      <Input
                        className={FIELD_CLASS}
                        value={person.id_no}
                        onChange={(e) => updateRelatedPerson(index, "id_no", e.target.value)}
                        placeholder="Enter ID License No"
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="ID Issue Date" className={FIELD_LABEL_CLASS} />
                      <Input
                        type="date"
                        className={FIELD_CLASS}
                        value={person.id_issue_date}
                        onChange={(e) => updateRelatedPerson(index, "id_issue_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                      <Input
                        type="date"
                        className={FIELD_CLASS}
                        value={person.id_expiry_date}
                        onChange={(e) => updateRelatedPerson(index, "id_expiry_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="Date of Birth" className={FIELD_LABEL_CLASS} />
                      <Input
                        type="date"
                        className={FIELD_CLASS}
                        value={person.dob}
                        onChange={(e) => updateRelatedPerson(index, "dob", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="Role" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={roles}
                        value={person.role}
                        onValueChange={(v) => typeof v === "string" && updateRelatedPerson(index, "role", v)}
                        placeholder="Select role"
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel text="Percentage of Share" className={FIELD_LABEL_CLASS} />
                      <Input
                        className={FIELD_CLASS}
                        value={person.ownership_percentage}
                        onChange={(e) => updateRelatedPerson(index, "ownership_percentage", e.target.value)}
                        placeholder="Enter percentage (0-100)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Additional Information</h4>
              </div>
              <div className={CORPORATE_GRID_CLASS}>
                <div className="md:col-span-2 space-y-2">
                  <label className={FIELD_LABEL_CLASS}>Remarks</label>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter any additional remarks"
                    className={TEXTAREA_CLASS}
                    rows={4}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <Card className={FORM_SECTION_CARD_CLASS}>
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-lg text-foreground tracking-tight">Upload Documents</h4>
              </div>
              <div className="space-y-6">
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <div
                    onClick={openFilePicker}
                    className="flex flex-col items-center justify-center min-h-[160px] rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-10 transition-all hover:border-primary/40 hover:bg-muted/30 group-hover:shadow-md"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Click to upload documents</p>
                    <p className="text-xs text-muted-foreground text-center">
                      Support for PDF, JPG, PNG, DOC (max 10MB per file)
                    </p>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((f, i) => (
                      <div key={i} className="text-sm text-muted-foreground">{f.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <div className={ACTION_BAR_CLASS}>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className={`w-full sm:w-auto ${CANCEL_BUTTON_CLASS}`}
                onClick={() => router.push("/dashboard/customers")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button className={`w-full sm:w-auto ${SAVE_BUTTON_CLASS}`} type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Information"
                )}
              </Button>
            </div>
          </div>
        </form >
      </Tabs >
    </div >
  )
}
