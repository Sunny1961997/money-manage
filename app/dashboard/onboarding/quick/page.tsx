"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Combobox } from "@/components/ui/combobox"
import { User, Users, Upload, Download, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

type EntryType = "single" | "batch"

const idTypes = [
  { value: "Passport", label: "Passport" },
  { value: "EID", label: "EID" },
  { value: "GCC ID", label: "GCC ID" },
  { value: "Govt. Issued ID", label: "Govt. Issued ID" },
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
  const [fuzziness, setFuzziness] = useState("OFF")
  
  const [submitting, setSubmitting] = useState(false)

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
              value: `${c.phoneCode}|${c.code}`,
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
      screening_fuzziness: fuzziness,
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

  if (loading) return <div className="max-w-6xl mx-auto p-6">Loading...</div>

  return (
    <div className="max-w-8xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xl font-semibold mb-1">
          <User className="w-5 h-5" />
          Quick Onboarding
        </div>
      </div>

      {/* Choose Entry Type */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Choose Entry Type</h2>
          <p className="text-sm text-blue-600">
            Selected: <span className="font-medium">{entryType === "single" ? "Single" : "Batch"}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          <button
            onClick={() => setEntryType("single")}
            className={cn(
              "p-6 rounded-lg border-2 transition-all text-left hover:border-blue-300",
              entryType === "single" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-full", entryType === "single" ? "bg-blue-500" : "bg-gray-300")}>
                <User className={cn("w-5 h-5", entryType === "single" ? "text-white" : "text-gray-600")} />
              </div>
              <div>
                <div className="font-semibold text-base mb-1">Individual Single Entry</div>
                <div className="text-sm text-muted-foreground">Onboard single customer or sole proprietor entries.</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setEntryType("batch")}
            className={cn(
              "p-6 rounded-lg border-2 transition-all text-left hover:border-blue-300",
              entryType === "batch" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white",
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-full", entryType === "batch" ? "bg-blue-500" : "bg-gray-300")}>
                <Users className={cn("w-5 h-5", entryType === "batch" ? "text-white" : "text-gray-600")} />
              </div>
              <div>
                <div className="font-semibold text-base mb-1">Individual Batch Entry</div>
                <div className="text-sm text-muted-foreground">Onboard batch entries of customers or entities.</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Single Entry Form */}
      {entryType === "single" && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Individual</span>
              <h3 className="text-lg font-semibold">New Individual Registration</h3>
            </div>

            {/* Onboard with ID card */}
            {/* <div className="mb-6">
              <button
                type="button"
                onClick={() => setIsIdCardExpanded(!isIdCardExpanded)}
                className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span>Onboard with ID card</span>
                </div>
                <svg
                  className={cn("w-4 h-4 transition-transform", isIdCardExpanded && "rotate-180")}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isIdCardExpanded && (
                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div
                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-white cursor-pointer hover:bg-blue-50/30 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleIdCardDrop}
                    onClick={() => document.getElementById("idCardUpload")?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-blue-700">Upload ID Card</p>
                      <p className="text-xs text-muted-foreground">
                        {idCardFile ? idCardFile.name : "Drag & drop files here, or click to select"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      id="idCardUpload"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleIdCardFileChange}
                    />
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <h5 className="text-sm font-semibold text-gray-900">File Requirements</h5>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 ml-6">
                      <li>• Max size: 5MB</li>
                      <li>• Formats: JPG, PNG, PDF</li>
                      <li>• Maximum pages in PDF: 2</li>
                      <li>• One file only at a time</li>
                    </ul>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <h5 className="text-sm font-semibold text-gray-900">Scanning Tips</h5>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 ml-6">
                      <li>• Good lighting, no shadows or glare</li>
                      <li>• Ensure all text is clearly visible</li>
                      <li>• Make sure the text is straight and not skewed or rotated</li>
                      <li>• Use high-resolution scan or photo</li>
                    </ul>
                  </div>
                </div>
              )}
            </div> */}

            {/* Personal Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-sm">Personal Information</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter first name" 
                    className="mt-1.5" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter last name" 
                    className="mt-1.5"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="Enter email address" 
                    className="mt-1.5" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">
                    Date of Birth<span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="dob" 
                    type="date" 
                    className="mt-1.5"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>
                    Residential Status<span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={residentialStatus} 
                    onValueChange={setResidentialStatus}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="resident" id="resident" />
                      <Label htmlFor="resident" className="font-normal cursor-pointer">
                        Resident
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-resident" id="non-resident" />
                      <Label htmlFor="non-resident" className="font-normal cursor-pointer">
                        Non-Resident
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="address" 
                    placeholder="Enter address" 
                    className="mt-1.5"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="nationality">
                    Nationality<span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={countries}
                    value={nationality}
                    onValueChange={handleSingleSelect(setNationality)}
                    placeholder="Select a nationality"
                    searchPlaceholder="Search nationality..."
                  />
                </div>
                <div>
                  <Label htmlFor="countryCode">
                    Country Code <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={countryCodes}
                    value={countryCode}
                    onValueChange={handleSingleSelect(setCountryCode)}
                    placeholder="Select"
                    searchPlaceholder="Search code..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="contactNo">
                    Contact No <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="contactNo" 
                    placeholder="Enter contact number" 
                    className="mt-1.5"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Identification Details */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-purple-50 rounded-lg">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
                <h4 className="font-semibold text-sm">Identification Details</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idType">
                    ID Type <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={idTypes}
                    value={idType}
                    onValueChange={handleSingleSelect(setIdType)}
                    placeholder="Select an ID type"
                    searchPlaceholder="Search type..."
                  />
                </div>
                <div>
                  <Label htmlFor="idNo">
                    ID No <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="idNo" 
                    placeholder="Enter ID number" 
                    className="mt-1.5"
                    value={idNo}
                    onChange={(e) => setIdNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="idIssued">
                    ID Issued Date<span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="idIssued" 
                    type="date" 
                    className="mt-1.5"
                    value={idIssueDate}
                    onChange={(e) => setIdIssueDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="idExpiry">
                    ID Expiry Date<span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="idExpiry" 
                    type="date" 
                    className="mt-1.5"
                    value={idExpiryDate}
                    onChange={(e) => setIdExpiryDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Upload Documents */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-teal-50 rounded-lg">
                <Upload className="w-4 h-4 text-teal-600" />
                <h4 className="font-semibold text-sm">Upload Documents</h4>
              </div>

              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/30 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileUpload")?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-blue-700">Add Documents</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile ? selectedFile.name : "Drag & drop files here, or click to select"}
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  id="fileUpload" 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange} 
                />
              </div>
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                <Info className="w-3 h-3" />
                Max 5 files, each up to 5MB (Images, PDFs, Docs)
              </p>
            </div>

            {/* Screening Settings */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-50 rounded-lg">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="font-semibold text-sm">Screening Settings</h4>
              </div>

              <div>
                <Label htmlFor="fuzziness" className="flex items-center gap-2">
                  Screening Fuzziness<span className="text-red-500">*</span>
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Label>
                <Combobox
                  options={screeningFuzziness}
                  value={fuzziness}
                  onValueChange={handleSingleSelect(setFuzziness)}
                  placeholder="Select fuzziness level"
                  searchPlaceholder="Search fuzziness..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={submitting}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {submitting ? "Submitting..." : "Submit Quick Onboard"}
            </Button>
          </form>
        </div>
      )}

      {/* Batch Entry Form */}
      {entryType === "batch" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Batch Onboarding</h3>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 mb-6">
              <Download className="w-4 h-4 mr-2" />
              Download Excel Template
            </Button>

            {/* Instructions */}
            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm">Instructions</h4>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>First Name:</strong> Required, text (e.g., John).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Last Name:</strong> Required, text (e.g., Doe).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Date of Birth:</strong> Required, format: yyyy-mm-dd (e.g., 1990-01-01).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Residential Status:</strong> Required, must be "Resident" or "Non-Resident".
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Address:</strong> Required, text (e.g., 123 Main St, City).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Nationality:</strong> Required, valid country name (e.g., India).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Country Code:</strong> Required, valid phone country code (e.g., +91).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Contact Number:</strong> Required, numeric only (e.g., 1234567890).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Type:</strong> Required, valid ID type (e.g., Passport, EID).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Number:</strong> Required, text. For EID, use xxx-xxxx-xxxxxxx-x or digits only (e.g.,
                    123456789012345).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Issued Date:</strong> Required, format: yyyy-mm-dd (e.g., 2023-01-01).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>ID Expiry Date:</strong> Required, format: yyyy-mm-dd (e.g., 2033-01-01).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Fuzzy Level:</strong> Required, must be 0, 1, or 2.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    Rows with missing Customer Type or Name will be <strong className="text-red-600">skipped</strong>.
                  </span>
                </li>
              </ul>
            </div>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <p className="text-sm text-gray-600">
                Drag & drop a .xlsx file here, or{" "}
                <label htmlFor="batchFileUpload" className="text-blue-600 cursor-pointer hover:underline">
                  click to select
                </label>
              </p>
              <input type="file" className="hidden" id="batchFileUpload" accept=".xlsx" onChange={handleFileChange} />
              {selectedFile && <p className="mt-3 text-sm text-green-600">Selected: {selectedFile.name}</p>}
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Process Batch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
