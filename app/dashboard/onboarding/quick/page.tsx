"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Combobox } from "@/components/ui/combobox"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { User, Users, Upload, Download, Info } from "lucide-react"
import { cn, formatContactNumber } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

type EntryType = "single" | "batch"

const PAGE_CLASS = "space-y-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500"
const CARD_STYLE =
  "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all"
const SECONDARY_LABEL_CLASS = "text-xs font-extrabold uppercase tracking-[0.14em] text-foreground"
const FIELD_LABEL_CLASS = "mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
const FIELD_CLASS =
  "h-10 w-full rounded-xl border border-border/70 bg-background/90 px-3 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"
const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground"


const idTypes = [
  { value: "Passport", label: "Passport" },
  { value: "EID", label: "EID" },
  { value: "GCC ID", label: "GCC ID" },
  { value: "Govt. Issued ID", label: "Govt. Issued ID" },
  { value: "Commercial License", label: "Commercial License" },
]

const screeningFuzziness = [
  { value: "OFF", label: "OFF" },
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
]

export default function QuickOnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [entryType, setEntryType] = useState<EntryType>("single")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isIdCardExpanded, setIsIdCardExpanded] = useState(false)
  const [idCardFile, setIdCardFile] = useState<File | null>(null)

  // Meta data
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([])
  const [countryCodes, setCountryCodes] = useState<Array<{ value: string; label: string }>>([])
  const [loading, setLoading] = useState(true)

  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState("")
  const [residentialStatus, setResidentialStatus] = useState("resident")
  const [address, setAddress] = useState("")
  const [nationality, setNationality] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [idType, setIdType] = useState("")
  const [idNo, setIdNo] = useState("")
  const [idIssueDate, setIdIssueDate] = useState("")
  const [idExpiryDate, setIdExpiryDate] = useState("")
  // const [fuzziness, setFuzziness] = useState("OFF")

  const [submitting, setSubmitting] = useState(false)

  // Handler for batch upload
  const [batchSubmitting, setBatchSubmitting] = useState(false)
  const handleBatchUpload = async () => {
    if (!selectedFile || !selectedFile.name.endsWith('.xlsx')) {
      toast({
        title: "No file selected",
        description: "Please select a valid .xlsx file to process batch onboarding.",
      })
      return
    }
    setBatchSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      const res = await fetch("/api/onboarding/bulk-quick-upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await res.json().catch(async () => ({ message: await res.text() }))
      if (res.ok) {
        toast({ title: "Batch upload successful", description: data?.message || "Batch onboarding submitted." })
        router.push("/dashboard/customers")
      } else {
        toast({
          title: "Batch upload failed",
          description: data?.message || data?.error || "Unknown error",
        })
      }
    } catch (err: any) {
      toast({
        title: "Batch upload failed",
        description: err?.message || "Network error",
      })
    } finally {
      setBatchSubmitting(false)
    }
  }

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("/api/onboarding/meta", { credentials: "include" })
        const json = await res.json()
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
              label: `${c.phoneCode} (${c.label})`
            }))
        )
      } catch (e) {
        console.error("Failed to fetch meta:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchMeta()
  }, [])
  const handleDownloadTemplate = () => {
    const link = document.createElement("a")
    link.href = "/Quick Onboarding.xlsx"
    link.download = "Quick Onboarding.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleIdCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdCardFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleIdCardDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIdCardFile(e.dataTransfer.files[0])
    }
  }

  const handleSingleSelect = (setter: (v: string) => void) => (value: string | string[]) => {
    if (typeof value === "string") setter(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Validation
    const requiredFields = {
      'First Name': firstName,
      'Last Name': lastName,
      'Email': email,
      'Date of Birth': dob,
      'Address': address,
      'Nationality': nationality,
      'Country Code': countryCode,
      'Contact No': contactNo,
      'ID Type': idType,
      'ID No': idNo,
      'ID Issue Date': idIssueDate,
      'ID Expiry Date': idExpiryDate,
    }

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field, _]) => field)

    if (emptyFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in: ${emptyFields.join(', ')}`,
      })
      setSubmitting(false)
      return
    }

    const payload = {
      customer_type: "individual",
      onboarding_type: "quick_single",
      screening_fuzziness: "OFF",
      individual_details: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        dob,
        residential_status: residentialStatus,
        address,
        nationality,
        country_code: countryCode,
        contact_no: contactNo,
        id_type: idType,
        id_no: idNo,
        id_issue_date: idIssueDate,
        id_expiry_date: idExpiryDate,
      },
    }

    try {
      const formData = new FormData()
      formData.append("data", JSON.stringify(payload))
      if (selectedFile) {
        formData.append("documents[]", selectedFile)
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json().catch(async () => ({ message: await res.text() }))
      console.log("[Quick Onboarding] API response:", { status: res.status, data })

      if (res.ok) {
        const msg = data?.message || "Quick onboarding submitted successfully"
        toast({ title: "Success", description: msg })
        router.push("/dashboard/customers")
      } else {
        const details = data?.errors
          ? Object.values(data.errors as Record<string, string[]>)
            .flat()
            .join("; ")
          : ""
        const errText = details || data?.message || data?.error || "Unknown error"
        toast({
          title: "Onboarding failed",
          description: errText,
        })
      }
    } catch (err: any) {
      toast({
        title: "Onboarding failed",
        description: err?.message || "Network error",
      })
    } finally {
      setSubmitting(false)
    }
  }

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
      {/* Choose Entry Type */}
      <Card className={cn(CARD_STYLE, "mb-8")}>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2 text-foreground">Choose Entry Type</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Select <span className="font-semibold text-foreground">Single</span> for individual onboarding or <span className="font-semibold text-foreground">Batch</span> to start a bulk operation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => setEntryType("single")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden bg-background/50",
                entryType === "single"
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                  : "border-border/50 hover:border-primary/30 hover:bg-white/50"
              )}
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors",
                  entryType === "single" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-base mb-1 text-foreground">Individual Single Entry</div>
                  <div className="text-sm text-muted-foreground">Onboard single customer or sole proprietor entries.</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setEntryType("batch")}
              className={cn(
                "group relative p-6 rounded-2xl border-2 transition-all text-left overflow-hidden bg-background/50",
                entryType === "batch"
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                  : "border-border/50 hover:border-primary/30 hover:bg-white/50",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              )}
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors",
                  entryType === "batch" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-base mb-1 text-foreground">Individual Batch Entry (Coming Soon)</div>
                  <div className="text-sm text-muted-foreground">Onboard batch entries of customers or entities.</div>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Single Entry Form */}
      {entryType === "single" && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className={CARD_STYLE}>
              <CardContent className="space-y-10 p-8">
                <section>
                  <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">Personal Information</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="firstName" text="First Name" className={FIELD_LABEL_CLASS} />
                      <input
                        id="firstName"
                        placeholder="Enter first name"
                        className={FIELD_CLASS}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="lastName" text="Last Name" className={FIELD_LABEL_CLASS} />
                      <input
                        id="lastName"
                        placeholder="Enter last name"
                        className={FIELD_CLASS}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="email" text="Email" className={FIELD_LABEL_CLASS} />
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        className={FIELD_CLASS}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="dob" text="Date of Birth" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="dob"
                        type="date"
                        className={FIELD_CLASS}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel text="Residential Status" className={FIELD_LABEL_CLASS} />
                      <div className="mt-2 flex items-center gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="residentialStatus"
                            value="resident"
                            checked={residentialStatus === "resident"}
                            onChange={() => setResidentialStatus("resident")}
                            className="accent-primary"
                          />
                          <span className="text-sm font-medium">Resident</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="residentialStatus"
                            value="non-resident"
                            checked={residentialStatus === "non-resident"}
                            onChange={() => setResidentialStatus("non-resident")}
                            className="accent-primary"
                          />
                          <span className="text-sm font-medium">Non-Resident</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="address" text="Address" className={FIELD_LABEL_CLASS} />
                      <input
                        id="address"
                        placeholder="Enter address"
                        className={FIELD_CLASS}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="nationality" text="Nationality" className={FIELD_LABEL_CLASS} />
                      <Combobox
                        options={countries}
                        value={nationality}
                        onValueChange={handleSingleSelect(setNationality)}
                        placeholder="Select a nationality"
                        searchPlaceholder="Search nationality..."
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="countryCode" text="Country Code" className={FIELD_LABEL_CLASS} />
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
                      <RequiredLabel htmlFor="contactNo" text="Contact No" className={FIELD_LABEL_CLASS} />
                      <input
                        id="contactNo"
                        placeholder="Enter contact number"
                        className={FIELD_CLASS}
                        value={contactNo}
                        onChange={(e) => setContactNo(formatContactNumber(e.target.value))}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-border/50 pt-10">
                  <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">Identification Details</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="idType" text="ID Type" className={FIELD_LABEL_CLASS} />
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
                      <RequiredLabel htmlFor="idNo" text="ID No" className={FIELD_LABEL_CLASS} />
                      <input
                        id="idNo"
                        placeholder="Enter ID number"
                        className={FIELD_CLASS}
                        value={idNo}
                        onChange={(e) => setIdNo(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <RequiredLabel htmlFor="idIssued" text="ID Issued Date" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="idIssued"
                        type="date"
                        className={FIELD_CLASS}
                        value={idIssueDate}
                        onChange={(e) => setIdIssueDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <RequiredLabel htmlFor="idExpiry" text="ID Expiry Date" className={FIELD_LABEL_CLASS} />
                      <Input
                        id="idExpiry"
                        type="date"
                        className={FIELD_CLASS}
                        value={idExpiryDate}
                        onChange={(e) => setIdExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-border/50 pt-10">
                  <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Upload className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">Upload Documents</h4>
                  </div>

                  <div
                    className="group cursor-pointer rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-10 text-center transition-colors hover:bg-primary/10"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileUpload")?.click()}
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm transition-transform group-hover:scale-105">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h5 className="mb-1 font-semibold text-foreground">Click to Upload Documents</h5>
                    <p className="text-sm text-muted-foreground">Max 5 files, each up to 5MB (Images, PDFs, Docs)</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Drag & drop files here, or click to select"}
                    </p>

                    <input
                      type="file"
                      className="hidden"
                      id="fileUpload"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                    />
                  </div>
                </section>
              </CardContent>
            </Card>

            <div className="sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-6 z-10 flex justify-end">
              <Button
                className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                type="submit"
                disabled={submitting}
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
        </div >
      )
      }

      {/* Batch Entry Form */}
      {entryType === "batch" && (
        <div className="space-y-6">
          <Card className={CARD_STYLE}>
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-lg text-foreground tracking-tight">Batch Onboarding</h3>
              </div>
              <Button variant="outline" className="mb-8 border-primary/20 hover:bg-primary/5 text-primary hover:text-primary bg-transparent h-10 px-4" onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Excel Template
              </Button>

              {/* Instructions */}
              <div className="mb-8 p-6 border border-border/50 rounded-2xl bg-primary/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-foreground tracking-tight">Instructions</h4>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">First Name:</strong> Required, text (e.g., John).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Last Name:</strong> Required, text (e.g., Doe).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Email:</strong> Required, text (e.g., john@example.com).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Date of Birth:</strong> Required, format: yyyy-mm-dd.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Residential Status:</strong> "Resident" or "Non-Resident".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Address:</strong> Required, text.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Nationality:</strong> Required, valid country name.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Country Code:</strong> Required, valid phone country code.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Contact Number:</strong> Required, numeric only.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">ID Type:</strong> Required, valid ID type.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">ID Number:</strong> Required, text format matching type.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">ID Issued/Expiry:</strong> Required, format: yyyy-mm-dd.</span>
                  </li>
                </ul>
              </div>

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-12 text-center cursor-pointer group mb-6"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("batchFileUpload")?.click()}
              >
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h5 className="font-semibold text-foreground mb-1">Click to Upload Batch File</h5>
                <p className="text-sm text-muted-foreground">Drag & drop a .xlsx file here, or click to select</p>
                <input type="file" className="hidden" id="batchFileUpload" accept=".xlsx" onChange={handleFileChange} />
                {selectedFile && <p className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">Selected: {selectedFile.name}</p>}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button
                  className="sm:w-auto min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  type="button"
                  onClick={handleBatchUpload}
                  disabled={batchSubmitting}
                >
                  {batchSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Process Batch
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
